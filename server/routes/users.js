const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with pagination and search
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skill = req.query.skill || '';
  const location = req.query.location || '';

  const skip = (page - 1) * limit;

  // Build query
  let query = { status: 'active' };

  if (search) {
    query.$text = { $search: search };
  }

  if (skill) {
    query.$or = [
      { skills: { $regex: skill, $options: 'i' } },
      { wantedSkills: { $regex: skill, $options: 'i' } }
    ];
  }

  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }

  // Execute query
  const users = await User.find(query)
    .select('-password -preferences')
    .sort({ rating: -1, totalSwaps: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  });
}));

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -preferences');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('location').optional().trim().isLength({ max: 100 }),
  body('skills').optional().isArray(),
  body('wantedSkills').optional().isArray()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { name, bio, location, skills, wantedSkills } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (bio !== undefined) updateData.bio = bio;
  if (location !== undefined) updateData.location = location;
  if (skills) updateData.skills = skills;
  if (wantedSkills) updateData.wantedSkills = wantedSkills;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
}));

// @route   POST /api/users/profile-photo
// @desc    Upload profile photo
// @access  Private
router.post('/profile-photo', authMiddleware, asyncHandler(async (req, res) => {
  // Implement file upload logic here
  // For now, just return success message
  res.json({
    success: true,
    message: 'Profile photo uploaded successfully'
  });
}));

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authMiddleware, asyncHandler(async (req, res) => {
  const stats = await User.getStats();
  
  res.json({
    success: true,
    data: stats[0] || {}
  });
}));

// @route   GET /api/users/search
// @desc    Search users by skills
// @access  Public
router.get('/search/skills', optionalAuth, asyncHandler(async (req, res) => {
  const { skill } = req.query;
  
  if (!skill) {
    return res.status(400).json({
      success: false,
      message: 'Skill parameter is required'
    });
  }

  const users = await User.findBySkill(skill)
    .select('-password -preferences')
    .limit(20);

  res.json({
    success: true,
    data: users
  });
}));

module.exports = router; 