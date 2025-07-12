import { Request, Response } from 'express';
import Swap, { ISwap } from '../models/Swap';
import User from '../models/User';

// Create swap request
export const createSwap = async (req: Request, res: Response) => {
  try {
    const { recipientId, requestedSkill, offeredSkill, message } = req.body;
    const requesterId = req.user?.id;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Check if recipient is banned
    if (recipient.isBanned) {
      return res.status(400).json({ message: 'Cannot send request to banned user' });
    }

    // Check if recipient profile is private
    if (recipient.profileVisibility === 'private') {
      return res.status(403).json({ message: 'Cannot send request to private profile' });
    }

    // Check if there's already a pending swap between these users
    const existingSwap = await Swap.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ],
      status: 'pending'
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'A pending swap request already exists' });
    }

    const swap = await Swap.create({
      requester: requesterId,
      recipient: recipientId,
      requestedSkill,
      offeredSkill,
      message
    });

    const populatedSwap = await Swap.findById(swap._id)
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto');

    res.status(201).json(populatedSwap);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's swap requests (received and sent)
export const getSwapRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const type = req.params.type; // 'received' or 'sent'

    let swaps;
    if (type === 'received') {
      swaps = await Swap.find({ recipient: userId })
        .populate('requester', 'name profilePhoto')
        .populate('recipient', 'name profilePhoto')
        .sort({ createdAt: -1 });
    } else if (type === 'sent') {
      swaps = await Swap.find({ requester: userId })
        .populate('requester', 'name profilePhoto')
        .populate('recipient', 'name profilePhoto')
        .sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ message: 'Invalid type parameter' });
    }

    res.json(swaps);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept swap request
export const acceptSwap = async (req: Request, res: Response) => {
  try {
    const swapId = req.params.id;
    const userId = req.user?.id;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient
    if (swap.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    swap.status = 'accepted';
    await swap.save();

    const populatedSwap = await Swap.findById(swapId)
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto');

    res.json(populatedSwap);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject swap request
export const rejectSwap = async (req: Request, res: Response) => {
  try {
    const swapId = req.params.id;
    const userId = req.user?.id;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the recipient
    if (swap.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    swap.status = 'rejected';
    await swap.save();

    const populatedSwap = await Swap.findById(swapId)
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto');

    res.json(populatedSwap);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel swap request (by requester)
export const cancelSwap = async (req: Request, res: Response) => {
  try {
    const swapId = req.params.id;
    const userId = req.user?.id;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is the requester
    if (swap.requester.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap request is not pending' });
    }

    swap.status = 'cancelled';
    await swap.save();

    const populatedSwap = await Swap.findById(swapId)
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto');

    res.json(populatedSwap);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete swap and add rating/feedback
export const completeSwap = async (req: Request, res: Response) => {
  try {
    const swapId = req.params.id;
    const userId = req.user?.id;
    const { rating, feedback } = req.body;

    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Check if user is involved in the swap
    if (swap.requester.toString() !== userId && swap.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to complete this swap' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({ message: 'Swap must be accepted before completion' });
    }

    swap.status = 'completed';
    swap.completedAt = new Date();
    
    if (rating) {
      swap.rating = rating;
    }
    if (feedback) {
      swap.feedback = feedback;
    }

    await swap.save();

    // Update user stats
    const requester = await User.findById(swap.requester);
    const recipient = await User.findById(swap.recipient);

    if (requester) {
      requester.totalSwaps += 1;
      await requester.save();
    }

    if (recipient) {
      recipient.totalSwaps += 1;
      await recipient.save();
    }

    const populatedSwap = await Swap.findById(swapId)
      .populate('requester', 'name profilePhoto')
      .populate('recipient', 'name profilePhoto');

    res.json(populatedSwap);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 