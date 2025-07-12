import express from 'express';
import { 
  getUsers, 
  getUserProfile, 
  updateUserProfile, 
  uploadProfilePhoto, 
  searchUsersBySkills 
} from '../controllers/userController';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

// Public routes
router.get('/', getUsers);
router.get('/search', searchUsersBySkills);
router.get('/:id', getUserProfile);

// Protected routes
router.put('/:id', auth, updateUserProfile);
router.post('/:id/photo', auth, upload.single('profilePhoto'), uploadProfilePhoto);

export default router; 