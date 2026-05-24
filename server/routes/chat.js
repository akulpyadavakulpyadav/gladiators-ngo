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

module.exports = router;
