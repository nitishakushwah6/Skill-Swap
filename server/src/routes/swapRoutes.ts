import express from 'express';
import { 
  createSwap, 
  getSwapRequests, 
  acceptSwap, 
  rejectSwap, 
  cancelSwap, 
  completeSwap 
} from '../controllers/swapController';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create new swap request
router.post('/', createSwap);

// Get user's swap requests (received or sent)
router.get('/:type', getSwapRequests);

// Accept swap request
router.put('/:id/accept', acceptSwap);

// Reject swap request
router.put('/:id/reject', rejectSwap);

// Cancel swap request
router.put('/:id/cancel', cancelSwap);

// Complete swap
router.put('/:id/complete', completeSwap);

export default router; 