const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  ngoId: {
    type: String,
    required: true,
    ref: 'User'
  },
  donorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  donorName: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);
