const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const swapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['technology', 'language', 'music', 'art', 'sports', 'cooking', 'other'],
    required: [true, 'Category is required']
  },
  skill: {
    type: String,
    required: [true, 'Skill is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  preferredTime: {
    type: Date
  },
  contactInfo: {
    type: String,
    maxlength: [200, 'Contact info cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: ['open', 'accepted', 'completed', 'cancelled'],
    default: 'open'
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acceptedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: {
    type: String,
    enum: ['inappropriate', 'spam', 'fake_profile', 'no_show', 'other']
  },
  reportDetails: {
    type: String,
    maxlength: [500, 'Report details cannot exceed 500 characters']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
swapSchema.index({ userId: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });
swapSchema.index({ category: 1 });
swapSchema.index({ skill: 'text', title: 'text', description: 'text' });
swapSchema.index({ location: 1 });
swapSchema.index({ isReported: 1 });

// Virtual for swap duration in days
swapSchema.virtual('durationInDays').get(function() {
  if (!this.createdAt || !this.completedAt) return null;
  return Math.ceil((this.completedAt - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update timestamps
swapSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'accepted':
        this.acceptedAt = new Date();
        break;
      case 'completed':
        this.completedAt = new Date();
        break;
      case 'cancelled':
        this.cancelledAt = new Date();
        break;
    }
  }
  next();
});

// Method to accept swap
swapSchema.methods.accept = function(userId) {
  this.status = 'accepted';
  this.acceptedBy = userId;
  this.acceptedAt = new Date();
  return this.save();
};

// Method to complete swap
swapSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to cancel swap
swapSchema.methods.cancel = function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  return this.save();
};

// Method to report swap
swapSchema.methods.report = function(userId, reason, details) {
  this.isReported = true;
  this.reportReason = reason;
  this.reportDetails = details;
  this.reportedBy = userId;
  this.reportedAt = new Date();
  return this.save();
};

// Static method to get swap statistics
swapSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalSwaps: { $sum: 1 },
        openSwaps: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
        acceptedSwaps: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
        completedSwaps: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        cancelledSwaps: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        reportedSwaps: { $sum: { $cond: ['$isReported', 1, 0] } }
      }
    }
  ]);
};

// Static method to get swaps by user
swapSchema.statics.getUserSwaps = function(userId, status = null) {
  const query = {
    $or: [
      { userId: userId },
      { acceptedBy: userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('userId', 'username email profilePicture')
    .populate('acceptedBy', 'username email profilePicture')
    .sort({ createdAt: -1 });
};

// Static method to get recent swaps
swapSchema.statics.getRecentSwaps = function(limit = 10) {
  return this.find({ status: { $in: ['accepted', 'completed'] } })
    .populate('userId', 'username profilePicture')
    .populate('acceptedBy', 'username profilePicture')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Add pagination plugin
swapSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Swap', swapSchema); 