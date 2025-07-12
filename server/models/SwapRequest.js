const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const swapRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedSkill: {
    type: String,
    required: [true, 'Requested skill is required'],
    trim: true,
    maxlength: [100, 'Requested skill cannot exceed 100 characters']
  },
  offeredSkill: {
    type: String,
    required: [true, 'Offered skill is required'],
    trim: true,
    maxlength: [100, 'Offered skill cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
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
swapRequestSchema.index({ requesterId: 1, status: 1 });
swapRequestSchema.index({ recipientId: 1, status: 1 });
swapRequestSchema.index({ status: 1, createdAt: -1 });
swapRequestSchema.index({ isReported: 1 });

// Compound index to ensure one pending request between users
swapRequestSchema.index({ requesterId: 1, recipientId: 1, status: 1 }, { unique: true });

// Virtual for swap duration in days
swapRequestSchema.virtual('durationInDays').get(function() {
  if (!this.createdAt || !this.completedAt) return null;
  return Math.ceil((this.completedAt - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update timestamps
swapRequestSchema.pre('save', function(next) {
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

// Method to accept swap request
swapRequestSchema.methods.accept = function() {
  this.status = 'accepted';
  this.acceptedAt = new Date();
  return this.save();
};

// Method to reject swap request
swapRequestSchema.methods.reject = function() {
  this.status = 'rejected';
  return this.save();
};

// Method to complete swap
swapRequestSchema.methods.complete = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Method to cancel swap
swapRequestSchema.methods.cancel = function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  return this.save();
};

// Method to report swap
swapRequestSchema.methods.report = function(userId, reason, details) {
  this.isReported = true;
  this.reportReason = reason;
  this.reportDetails = details;
  this.reportedBy = userId;
  this.reportedAt = new Date();
  return this.save();
};

// Static method to get swap request statistics
swapRequestSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        pendingRequests: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        acceptedRequests: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
        completedRequests: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        rejectedRequests: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        cancelledRequests: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        reportedRequests: { $sum: { $cond: ['$isReported', 1, 0] } }
      }
    }
  ]);
};

// Static method to get swap requests by user
swapRequestSchema.statics.getUserRequests = function(userId, status = null) {
  const query = {
    $or: [
      { requesterId: userId },
      { recipientId: userId }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('requesterId', 'name email profilePicture')
    .populate('recipientId', 'name email profilePicture')
    .sort({ createdAt: -1 });
};

// Static method to get received requests (for recipient)
swapRequestSchema.statics.getReceivedRequests = function(userId, status = null) {
  const query = { recipientId: userId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('requesterId', 'name email profilePicture')
    .populate('recipientId', 'name email profilePicture')
    .sort({ createdAt: -1 });
};

// Static method to get sent requests (for requester)
swapRequestSchema.statics.getSentRequests = function(userId, status = null) {
  const query = { requesterId: userId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('requesterId', 'name email profilePicture')
    .populate('recipientId', 'name email profilePicture')
    .sort({ createdAt: -1 });
};

// Add pagination plugin
swapRequestSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('SwapRequest', swapRequestSchema); 