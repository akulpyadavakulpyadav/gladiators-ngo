const mongoose = require('mongoose');

const expenseLogSchema = new mongoose.Schema({
  ngoId: {
    type: String,
    required: true,
    ref: 'User'
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  title: {
    type: String,
    required: true
  },
  amountSpent: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  proofUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExpenseLog', expenseLogSchema);
