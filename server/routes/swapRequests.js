const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const SwapRequest = require('../models/SwapRequest');
const { authMiddleware } = require('../middleware/auth');

// Get all swap requests for current user (both sent and received)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type = 'all', // 'sent', 'received', 'all'
      status 
    } = req.query;

    let query = {};
    let filter = {};
    
    if (status) filter.status = status;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'requesterId', select: 'name email profilePicture' },
        { path: 'recipientId', select: 'name email profilePicture' }
      ]
    };

    let requests;
    
    switch (type) {
      case 'sent':
        filter.requesterId = req.user.id;
        requests = await SwapRequest.paginate(filter, options);
        break;
      case 'received':
        filter.recipientId = req.user.id;
        requests = await SwapRequest.paginate(filter, options);
        break;
      default: // 'all'
        filter.$or = [
          { requesterId: req.user.id },
          { recipientId: req.user.id }
        ];
        requests = await SwapRequest.paginate(filter, options);
    }
    
    res.json({
      success: true,
      data: requests.docs,
      pagination: {
        page: requests.page,
        totalPages: requests.totalPages,
        totalDocs: requests.totalDocs,
        hasNextPage: requests.hasNextPage,
        hasPrevPage: requests.hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap requests',
      error: error.message
    });
  }
});

// Get single swap request by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id)
      .populate('requesterId', 'name email profilePicture')
      .populate('recipientId', 'name email profilePicture');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in this request
    if (request.requesterId._id.toString() !== req.user.id && 
        request.recipientId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this swap request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching swap request',
      error: error.message
    });
  }
});

// Create new swap request
router.post('/', 
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

      // Check if there's already a pending request between these users
      const existingRequest = await SwapRequest.findOne({
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
      const swapRequest = new SwapRequest({
        requesterId: requesterId,
        recipientId: recipientId,
        requestedSkill: requestedSkill,
        offeredSkill: offeredSkill,
        message: message,
        status: 'pending'
      });

      await swapRequest.save();

      const populatedRequest = await SwapRequest.findById(swapRequest._id)
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

// Accept swap request (only recipient can accept)
router.patch('/:id/accept', authMiddleware, async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (request.recipientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can accept swap requests'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only accept pending requests'
      });
    }

    await request.accept();

    const populatedRequest = await SwapRequest.findById(request._id)
      .populate('requesterId', 'name email profilePicture')
      .populate('recipientId', 'name email profilePicture');

    res.json({
      success: true,
      message: 'Swap request accepted successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error accepting swap request',
      error: error.message
    });
  }
});

// Reject swap request (only recipient can reject)
router.patch('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is the recipient
    if (request.recipientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the recipient can reject swap requests'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only reject pending requests'
      });
    }

    await request.reject();

    const populatedRequest = await SwapRequest.findById(request._id)
      .populate('requesterId', 'name email profilePicture')
      .populate('recipientId', 'name email profilePicture');

    res.json({
      success: true,
      message: 'Swap request rejected successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting swap request',
      error: error.message
    });
  }
});

// Complete swap (both users can complete)
router.patch('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in the swap
    if (request.requesterId.toString() !== req.user.id && 
        request.recipientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this swap'
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete accepted swaps'
      });
    }

    await request.complete();

    const populatedRequest = await SwapRequest.findById(request._id)
      .populate('requesterId', 'name email profilePicture')
      .populate('recipientId', 'name email profilePicture');

    res.json({
      success: true,
      message: 'Swap completed successfully',
      data: populatedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing swap',
      error: error.message
    });
  }
});

// Cancel swap request (both users can cancel)
router.patch('/:id/cancel', 
  authMiddleware,
  [
    body('reason').optional().trim().isLength({ min: 5, max: 500 }).withMessage('Reason must be between 5 and 500 characters')
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

      const request = await SwapRequest.findById(req.params.id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Swap request not found'
        });
      }

      // Check if user is involved in the swap
      if (request.requesterId.toString() !== req.user.id && 
          request.recipientId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this swap'
        });
      }

      if (request.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel completed swaps'
        });
      }

      await request.cancel(req.user.id, req.body.reason);

      const populatedRequest = await SwapRequest.findById(request._id)
        .populate('requesterId', 'name email profilePicture')
        .populate('recipientId', 'name email profilePicture');

      res.json({
        success: true,
        message: 'Swap request cancelled successfully',
        data: populatedRequest
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error cancelling swap request',
        error: error.message
      });
    }
  }
);

// Delete swap request (only requester can delete pending requests)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Only requester can delete pending requests
    if (request.requesterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the requester can delete swap requests'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending requests'
      });
    }

    await SwapRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Swap request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting swap request',
      error: error.message
    });
  }
});

module.exports = router; 