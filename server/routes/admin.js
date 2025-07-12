const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Swap = require('../models/Swap');
const Rating = require('../models/Rating');
const { adminMiddleware } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get admin dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSwaps = await Swap.countDocuments();
    const totalRatings = await Rating.countDocuments();
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email createdAt role');
    
    const recentSwaps = await Swap.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt userId');
    
    const swapStats = await Swap.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSwaps,
        totalRatings,
        recentUsers,
        recentSwaps,
        swapStats,
        userStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Get all users with pagination and filtering
router.get('/users', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      role, 
      status 
    } = req.query;

    const filter = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) filter.role = role;
    if (status) filter.status = status;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }
    };

    const users = await User.paginate(filter, options);
    
    res.json({
      success: true,
      data: users.docs,
      pagination: {
        page: users.page,
        totalPages: users.totalPages,
        totalDocs: users.totalDocs,
        hasNextPage: users.hasNextPage,
        hasPrevPage: users.hasPrevPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's swaps
    const swaps = await Swap.find({ userId: req.params.id })
      .populate('acceptedBy', 'username email')
      .sort({ createdAt: -1 });

    // Get user's ratings
    const ratings = await Rating.find({ 
      $or: [
        { fromUser: req.params.id },
        { toUser: req.params.id }
      ]
    })
    .populate('fromUser', 'username')
    .populate('toUser', 'username')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        swaps,
        ratings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
});

// Update user role
router.patch('/users/:id/role', 
  [
    body('role').isIn(['user', 'admin', 'moderator']).withMessage('Invalid role')
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

      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent admin from changing their own role
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change your own role'
        });
      }

      user.role = req.body.role;
      await user.save();

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user role',
        error: error.message
      });
    }
  }
);

// Ban/Unban user
router.patch('/users/:id/status', 
  [
    body('status').isIn(['active', 'banned']).withMessage('Invalid status')
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

      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent admin from banning themselves
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot ban yourself'
        });
      }

      user.status = req.body.status;
      user.bannedAt = req.body.status === 'banned' ? new Date() : null;
      await user.save();

      res.json({
        success: true,
        message: `User ${req.body.status === 'banned' ? 'banned' : 'unbanned'} successfully`,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user status',
        error: error.message
      });
    }
  }
);

// Get all swaps with admin controls
router.get('/swaps', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      category,
      search 
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skill: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'userId',
        select: 'username email role status'
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

// Delete swap (admin override)
router.delete('/swaps/:id', async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    await Swap.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Swap deleted successfully by admin'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting swap',
      error: error.message
    });
  }
});

// Get all ratings
router.get('/ratings', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      rating,
      search 
    } = req.query;

    const filter = {};
    
    if (rating) filter.rating = parseInt(rating);
    if (search) {
      filter.$or = [
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'fromUser', select: 'username email' },
        { path: 'toUser', select: 'username email' }
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

// Delete rating (admin override)
router.delete('/ratings/:id', async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    await Rating.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Rating deleted successfully by admin'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting rating',
      error: error.message
    });
  }
});

// Get platform analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // User growth
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({ createdAt: { $gte: daysAgo } });
    
    // Swap statistics
    const totalSwaps = await Swap.countDocuments();
    const newSwaps = await Swap.countDocuments({ createdAt: { $gte: daysAgo } });
    const completedSwaps = await Swap.countDocuments({ status: 'completed' });
    const openSwaps = await Swap.countDocuments({ status: 'open' });
    
    // Rating statistics
    const totalRatings = await Rating.countDocuments();
    const avgRating = await Rating.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    // Category distribution
    const categoryStats = await Swap.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Daily activity for the last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const swapsCount = await Swap.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      const usersCount = await User.countDocuments({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });
      
      dailyActivity.push({
        date: startOfDay.toISOString().split('T')[0],
        swaps: swapsCount,
        users: usersCount
      });
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          newUsers,
          totalSwaps,
          newSwaps,
          completedSwaps,
          openSwaps,
          totalRatings,
          avgRating: avgRating[0]?.avgRating || 0
        },
        categoryStats,
        dailyActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

// Send platform announcement
router.post('/announcements', 
  [
    body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
    body('type').isIn(['info', 'warning', 'success', 'error']).withMessage('Invalid announcement type')
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

      // Here you would typically save to a database and/or send notifications
      // For now, we'll just return success
      const announcement = {
        id: Date.now().toString(),
        title: req.body.title,
        message: req.body.message,
        type: req.body.type,
        createdBy: req.user.id,
        createdAt: new Date(),
        isActive: true
      };

      res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: announcement
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating announcement',
        error: error.message
      });
    }
  }
);

// Get system logs (placeholder)
router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, level, startDate, endDate } = req.query;
    
    // This would typically query a logging system
    // For now, return placeholder data
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'Server started successfully',
        timestamp: new Date(),
        userId: null
      },
      {
        id: 2,
        level: 'warn',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 3600000),
        userId: null
      }
    ];

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        totalPages: 1,
        totalDocs: logs.length,
        hasNextPage: false,
        hasPrevPage: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching logs',
      error: error.message
    });
  }
});

module.exports = router; 