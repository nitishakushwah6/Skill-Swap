const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Swap = require('../models/Swap');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User'); // Added User model import

// Get all swaps with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      skill, 
      location, 
      status,
      userId 
    } = req.query;

    const filter = {};
    
    if (category) filter.category = category;
    if (skill) filter.skill = { $regex: skill, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'userId',
        select: 'username email profilePicture rating'
      }
    };

    const swaps = await Swap.paginate(filter, options);
    
    res.json({
      success: true,
      data: swaps.docs,
      pagination: {
        page: swaps.page,
        totalPages: swaps.totalPages,
        totalDocs: swaps.totalDocs,
        hasNextPage: swaps.hasNextPage,
        hasPrevPage: swaps.hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swaps',
      error: error.message
    });
  }
});

// Get single swap by ID
router.get('/:id', async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id)
      .populate('userId', 'username email profilePicture rating')
      .populate('acceptedBy', 'username email profilePicture rating');

    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    res.json({
      success: true,
      data: swap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap',
      error: error.message
    });
  }
});

// Create new swap
router.post('/', 
  authMiddleware,
  [
    body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('category').isIn(['technology', 'language', 'music', 'art', 'sports', 'cooking', 'other']).withMessage('Invalid category'),
    body('skill').trim().isLength({ min: 2, max: 50 }).withMessage('Skill must be between 2 and 50 characters'),
    body('location').trim().isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
    body('preferredTime').optional().isISO8601().withMessage('Invalid date format'),
    body('contactInfo').optional().isLength({ min: 5, max: 200 }).withMessage('Contact info must be between 5 and 200 characters')
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

      const swapData = {
        ...req.body,
        userId: req.user.id,
        status: 'open'
      };

      const swap = new Swap(swapData);
      await swap.save();

      const populatedSwap = await Swap.findById(swap._id)
        .populate('userId', 'username email profilePicture rating');

      res.status(201).json({
        success: true,
        message: 'Swap created successfully',
        data: populatedSwap
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating swap',
        error: error.message
      });
    }
  }
);

// Create swap request between users
router.post('/request', 
  authMiddleware,
  [
    body('recipientId').isMongoId().withMessage('Invalid recipient ID'),
    body('requestedSkill').trim().isLength({ min: 2, max: 100 }).withMessage('Requested skill must be between 2 and 100 characters'),
    body('offeredSkill').trim().isLength({ min: 2, max: 100 }).withMessage('Offered skill must be between 2 and 100 characters'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
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

      const { recipientId, requestedSkill, offeredSkill, message } = req.body;
      const requesterId = req.user.id;

      // Check if user is trying to request from themselves
      if (requesterId === recipientId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot send swap request to yourself'
        });
      }

      // Check if recipient exists
      const recipient = await User.findById(recipientId);
      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: 'Recipient user not found'
        });
      }

      // Check if there's already a pending request between these users
      const existingRequest = await Swap.findOne({
        $or: [
          { requesterId: requesterId, recipientId: recipientId, status: 'pending' },
          { requesterId: recipientId, recipientId: requesterId, status: 'pending' }
        ]
      });

      if (existingRequest) {
        return res.status(400).json({
          success: false,
          message: 'There is already a pending swap request between you and this user'
        });
      }

      // Create the swap request
      const swapRequest = new Swap({
        requesterId: requesterId,
        recipientId: recipientId,
        requestedSkill: requestedSkill,
        offeredSkill: offeredSkill,
        message: message,
        status: 'pending'
      });

      await swapRequest.save();

      const populatedRequest = await Swap.findById(swapRequest._id)
        .populate('requesterId', 'name email profilePicture')
        .populate('recipientId', 'name email profilePicture');

      res.status(201).json({
        success: true,
        message: 'Swap request sent successfully',
        data: populatedRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating swap request',
        error: error.message
      });
    }
  }
);

// Update swap
router.put('/:id', 
  authMiddleware,
  [
    body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('category').optional().isIn(['technology', 'language', 'music', 'art', 'sports', 'cooking', 'other']).withMessage('Invalid category'),
    body('skill').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Skill must be between 2 and 50 characters'),
    body('location').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
    body('preferredTime').optional().isISO8601().withMessage('Invalid date format'),
    body('contactInfo').optional().isLength({ min: 5, max: 200 }).withMessage('Contact info must be between 5 and 200 characters')
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

      const swap = await Swap.findById(req.params.id);
      
      if (!swap) {
        return res.status(404).json({
          success: false,
          message: 'Swap not found'
        });
      }

      // Check if user owns the swap or is admin
      if (swap.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this swap'
        });
      }

      const updatedSwap = await Swap.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('userId', 'username email profilePicture rating');

      res.json({
        success: true,
        message: 'Swap updated successfully',
        data: updatedSwap
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating swap',
        error: error.message
      });
    }
  }
);

// Delete swap
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user owns the swap or is admin
    if (swap.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this swap'
      });
    }

    await Swap.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Swap deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting swap',
      error: error.message
    });
  }
});

// Accept swap request
router.patch('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.userId.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept your own swap request'
      });
    }

    if (swap.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Swap is not available for acceptance'
      });
    }

    swap.acceptedBy = req.user.id;
    swap.status = 'accepted';
    swap.acceptedAt = new Date();
    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('userId', 'username email profilePicture rating')
      .populate('acceptedBy', 'username email profilePicture rating');

    res.json({
      success: true,
      message: 'Swap accepted successfully',
      data: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting swap',
      error: error.message
    });
  }
});

// Complete swap
router.patch('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    // Check if user is involved in the swap
    if (swap.userId.toString() !== req.user.id && swap.acceptedBy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this swap'
      });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Swap must be accepted before completion'
      });
    }

    swap.status = 'completed';
    swap.completedAt = new Date();
    await swap.save();

    const populatedSwap = await Swap.findById(swap._id)
      .populate('userId', 'username email profilePicture rating')
      .populate('acceptedBy', 'username email profilePicture rating');

    res.json({
      success: true,
      message: 'Swap completed successfully',
      data: populatedSwap
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing swap',
      error: error.message
    });
  }
});

// Search swaps
router.get('/search', async (req, res) => {
  try {
    const { q, category, location, status } = req.query;
    
    const filter = {};
    
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { skill: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (status) filter.status = status;

    const swaps = await Swap.find(filter)
      .populate('userId', 'username email profilePicture rating')
      .populate('acceptedBy', 'username email profilePicture rating')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: swaps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching swaps',
      error: error.message
    });
  }
});

module.exports = router; 