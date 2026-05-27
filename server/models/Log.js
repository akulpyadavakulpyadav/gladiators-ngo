const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  ngoId: { type: String, required: true },
  title: { type: String, required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
