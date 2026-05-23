const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Using gcId as the primary key as requested
  _id: {
    type: String,
    required: true,
    alias: 'gcId'
  },
  role: {
    type: String,
    enum: ['volunteer', 'ngo', 'company'],
    required: true
  },
  pin: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  // Volunteer specific
  aadhaar: String,
  age: String,
  location: String,
  interests: [String],
  
  // NGO specific
  ngoDarpanId: String,
  headquarters: String,
  website: String,
  domain: String,
  
  // Company specific
  cin: String,
  industrySector: String,
  csrFocus: [String],

  // Point of Contact (NGO & Company)
  pocName: String,
  pocPhone: String,
  pocDesignation: String,
  pocEmail: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);
