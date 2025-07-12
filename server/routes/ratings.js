const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Swap = require('../models/Swap');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get all ratings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const filter = {
      $or: [
        { fromUser: req.params.userId },
        { toUser: req.params.userId }
      ]
    };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'fromUser', select: 'username email profilePicture' },
        { path: 'toUser', select: 'username email profilePicture' },
        { path: 'swapId', select: 'title skill' }
      ]
    };

    const ratings = await Rating.paginate(filter, options);
    
    res.json({
      success: true,
      data: ratings.docs,
      pagination: {
        page: ratings.page,
        totalPages: ratings.totalPages,
        totalDocs: ratings.totalDocs,
        hasNextPage: ratings.hasNextPage,
        hasPrevPage: ratings.hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings',
      error: error.message
    });
  }
});

// Get rating by ID
router.get('/:id', async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id)
      .populate('fromUser', 'username email profilePicture')
      .populate('toUser', 'username email profilePicture')
      .populate('swapId', 'title skill description');

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    res.json({
      success: true,
      data: rating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rating',
      error: error.message
    });
  }
});

// Submit a rating
router.post('/', 
  authMiddleware,
  [
    body('toUser').isMongoId().withMessage('Invalid user ID'),
    body('swapId').isMongoId().withMessage('Invalid swap ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { toUser, swapId, rating, comment } = req.body;

      // Check if swap exists and is completed
      const swap = await Swap.findById(swapId);
      if (!swap) {
        return res.status(404).json({
          success: false,
          message: 'Swap not found'
        });
      }

      if (swap.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Can only rate completed swaps'
        });
      }

      // Check if user is involved in the swap
      if (swap.userId.toString() !== req.user.id && swap.acceptedBy?.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only rate swaps you are involved in'
        });
      }

      // Check if user is rating the other person (not themselves)
      if (toUser === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot rate yourself'
        });
      }

      // Check if the other user is involved in the swap
      if (swap.userId.toString() !== toUser && swap.acceptedBy?.toString() !== toUser) {
        return res.status(400).json({
          success: false,
          message: 'Can only rate users involved in the swap'
        });
      }

      // Check if rating already exists
      const existingRating = await Rating.findOne({
        fromUser: req.user.id,
        toUser: toUser,
        swapId: swapId
      });

      if (existingRating) {
        return res.status(400).json({
          success: false,
          message: 'You have already rated this user for this swap'
        });
      }

      // Create the rating
      const newRating = new Rating({
        fromUser: req.user.id,
        toUser: toUser,
        swapId: swapId,
        rating: rating,
        comment: comment
      });

      await newRating.save();

      // Update user's average rating
      const userRatings = await Rating.find({ toUser: toUser });
      const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
      
      await User.findByIdAndUpdate(toUser, {
        rating: Math.round(avgRating * 10) / 10,
        totalRatings: userRatings.length
      });

      const populatedRating = await Rating.findById(newRating._id)
        .populate('fromUser', 'username email profilePicture')
        .populate('toUser', 'username email profilePicture')
        .populate('swapId', 'title skill');

      res.status(201).json({
        success: true,
        message: 'Rating submitted successfully',
        data: populatedRating
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error submitting rating',
        error: error.message
      });
    }
  }
);

// Update rating
router.put('/:id', 
  authMiddleware,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const rating = await Rating.findById(req.params.id);
      
      if (!rating) {
        return res.status(404).json({
          success: false,
          message: 'Rating not found'
        });
      }

      // Check if user owns the rating
      if (rating.fromUser.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this rating'
        });
      }

      // Check if rating is within edit window (24 hours)
      const hoursSinceCreation = (Date.now() - rating.createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceCreation > 24) {
        return res.status(400).json({
          success: false,
          message: 'Rating can only be edited within 24 hours of creation'
        });
      }

      const updatedRating = await Rating.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      )
      .populate('fromUser', 'username email profilePicture')
      .populate('toUser', 'username email profilePicture')
      .populate('swapId', 'title skill');

      // Update user's average rating if rating changed
      if (req.body.rating) {
        const userRatings = await Rating.find({ toUser: rating.toUser });
        const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
        
        await User.findByIdAndUpdate(rating.toUser, {
          rating: Math.round(avgRating * 10) / 10,
          totalRatings: userRatings.length
        });
      }

      res.json({
        success: true,
        message: 'Rating updated successfully',
        data: updatedRating
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating rating',
        error: error.message
      });
    }
  }
);

// Delete rating
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user owns the rating or is admin
    if (rating.fromUser.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this rating'
      });
    }

    await Rating.findByIdAndDelete(req.params.id);

    // Update user's average rating
    const userRatings = await Rating.find({ toUser: rating.toUser });
    const avgRating = userRatings.length > 0 
      ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length 
      : 0;
    
    await User.findByIdAndUpdate(rating.toUser, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: userRatings.length
    });

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting rating',
      error: error.message
    });
  }
});

// Get ratings for a specific swap
router.get('/swap/:swapId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const filter = { swapId: req.params.swapId };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'fromUser', select: 'username email profilePicture' },
        { path: 'toUser', select: 'username email profilePicture' }
      ]
    };

    const ratings = await Rating.paginate(filter, options);
    
    res.json({
      success: true,
      data: ratings.docs,
      pagination: {
        page: ratings.page,
        totalPages: ratings.totalPages,
        totalDocs: ratings.totalDocs,
        hasNextPage: ratings.hasNextPage,
        hasPrevPage: ratings.hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap ratings',
      error: error.message
    });
  }
});

// Get average rating for a user
router.get('/average/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ toUser: req.params.userId });
    
    if (ratings.length === 0) {
      return res.json({
        success: true,
        data: {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
          }
        }
      });
    }

    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    
    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    ratings.forEach(r => {
      ratingDistribution[r.rating]++;
    });

    res.json({
      success: true,
      data: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
        ratingDistribution
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating average rating',
      error: error.message
    });
  }
});

module.exports = router; 