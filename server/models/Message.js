const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User'
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for fast querying of chat history between two users
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
