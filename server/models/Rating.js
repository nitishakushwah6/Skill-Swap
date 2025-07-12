const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ratingSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  swapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Swap',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index to ensure one rating per user per swap
ratingSchema.index({ swapId: 1, fromUser: 1 }, { unique: true });

// Index for better query performance
ratingSchema.index({ toUser: 1, createdAt: -1 });
ratingSchema.index({ fromUser: 1, createdAt: -1 });
ratingSchema.index({ rating: 1 });

// Virtual for rating text
ratingSchema.virtual('ratingText').get(function() {
  switch (this.rating) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very Good';
    case 5: return 'Excellent';
    default: return 'Unknown';
  }
});

// Static method to get average rating for a user
ratingSchema.statics.getAverageRating = function(userId) {
  return this.aggregate([
    { $match: { toUser: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
};

// Static method to get rating distribution
ratingSchema.statics.getRatingDistribution = function(userId) {
  return this.aggregate([
    { $match: { toUser: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to get recent ratings
ratingSchema.statics.getRecentRatings = function(limit = 10) {
  return this.find()
    .populate('fromUser', 'username profilePicture')
    .populate('toUser', 'username profilePicture')
    .populate('swapId', 'title skill')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get user ratings
ratingSchema.statics.getUserRatings = function(userId) {
  return this.find({ 
    $or: [
      { fromUser: userId },
      { toUser: userId }
    ]
  })
    .populate('fromUser', 'username profilePicture')
    .populate('toUser', 'username profilePicture')
    .populate('swapId', 'title skill')
    .sort({ createdAt: -1 });
};

// Add pagination plugin
ratingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Rating', ratingSchema); 