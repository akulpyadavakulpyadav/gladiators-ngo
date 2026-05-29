const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Program'
  },
  ngoId: {
    type: String,
    required: true,
    ref: 'User'
  },
  volunteerId: {
    type: String,
    required: true,
    ref: 'User'
  },
  roleApplied: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  attendance: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
