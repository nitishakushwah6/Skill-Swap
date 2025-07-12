import { Request, Response } from 'express';
import User, { IUser } from '../models/User';

// Get all users with filtering and pagination
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skill = req.query.skill as string;
    const location = req.query.location as string;
    
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter: any = {
      profileVisibility: 'public',
      isBanned: false
    };
    
    if (skill) {
      filter.$or = [
        { skillsOffered: { $regex: skill, $options: 'i' } },
        { skillsWanted: { $regex: skill, $options: 'i' } }
      ];
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    const users = await User.find(filter)
      .select('-password -email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(filter);
    
    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.profileVisibility === 'private' && req.user?.id !== user.id) {
      return res.status(403).json({ message: 'Profile is private' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { name, location, skillsOffered, skillsWanted, availability, profileVisibility } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is updating their own profile
    if (req.user?.id !== user.id && !req.user?.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        location,
        skillsOffered,
        skillsWanted,
        availability,
        profileVisibility
      },
      { new: true, runValidators: true }
    ).select('-password -email');
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePhoto: photoUrl },
      { new: true }
    ).select('-password -email');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search users by skills
export const searchUsersBySkills = async (req: Request, res: Response) => {
  try {
    const { skill } = req.query;
    
    if (!skill) {
      return res.status(400).json({ message: 'Skill parameter is required' });
    }
    
    const users = await User.find({
      profileVisibility: 'public',
      isBanned: false,
      $or: [
        { skillsOffered: { $regex: skill as string, $options: 'i' } },
        { skillsWanted: { $regex: skill as string, $options: 'i' } }
      ]
    })
    .select('-password -email')
    .limit(20);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 