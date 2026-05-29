const mongoose = require('mongoose');

const financeReportSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now
  },
  rows: [{
    particulars: {
      type: String,
      required: true
    },
    expense: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  bills: [{
    type: String // Base64 strings for the bills/receipts
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('FinanceReport', financeReportSchema);
