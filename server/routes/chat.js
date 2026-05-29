const express = require('express');
const User = require('../models/User');
const Message = require('../models/Message');
const router = express.Router();

// @route   GET /api/chat/ngos
// @desc    Get all registered NGOs to populate the contacts sidebar
router.get('/ngos', async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' })
      .select('_id name profilePhoto domain headquarters email')
      .sort({ name: 1 });
    res.status(200).json(ngos);
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    res.status(500).json({ message: 'Server error fetching NGOs.' });
  }
});

// @route   GET /api/chat/messages
// @desc    Get chat history between two users
// @query   senderId, receiverId
router.get('/messages', async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Both senderId and receiverId are required.' });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 }); // Oldest first

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error fetching messages.' });
  }
});

// @route   GET /api/chat/inbox/:userId
// @desc    Get all messages for a specific user
router.get('/inbox/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.params.userId })
      .populate('senderId', 'name profilePhoto')
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching inbox messages:', error);
    res.status(500).json({ message: 'Server error fetching inbox messages.' });
  }
});

// @route   PUT /api/chat/inbox/read/:userId
// @desc    Mark all messages for a user as read
router.put('/inbox/read/:userId', async (req, res) => {
  try {
    await Message.updateMany(
      { receiverId: req.params.userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'Inbox messages marked as read.' });
  } catch (error) {
    console.error('Error marking inbox read:', error);
    res.status(500).json({ message: 'Server error marking inbox read.' });
  }
});

// @route   POST /api/chat/messages
// @desc    Send a new message
router.post('/messages', async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'senderId, receiverId, and content are required.' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      content
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Server error saving message.' });
  }
});

// @route   GET /api/chat/unread-counts
// @desc    Get count of unread messages per sender
// @query   receiverId
router.get('/unread-counts', async (req, res) => {
  try {
    const { receiverId } = req.query;
    if (!receiverId) return res.status(400).json({ message: 'receiverId is required.' });

    const unreadMessages = await Message.aggregate([
      { $match: { receiverId, read: false } },
      { $group: { _id: '$senderId', count: { $sum: 1 } } }
    ]);

    // Convert array of { _id: senderId, count } to a nice object map
    const countsMap = unreadMessages.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json(countsMap);
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    res.status(500).json({ message: 'Server error fetching unread counts.' });
  }
});

// @route   PUT /api/chat/mark-read
// @desc    Mark all messages from a specific sender as read
router.put('/mark-read', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'senderId and receiverId are required.' });
    }

    await Message.updateMany(
      { senderId, receiverId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Messages marked as read.' });
  } catch (error) {
    console.error('Error marking messages read:', error);
    res.status(500).json({ message: 'Server error marking messages read.' });
  }
});

module.exports = router;
