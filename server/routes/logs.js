const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

// Get all logs for an NGO
router.get('/ngo/:id', async (req, res) => {
  try {
    const logs = await Log.find({ ngoId: req.params.id }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new log
router.post('/', async (req, res) => {
  try {
    const newLog = new Log(req.body);
    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing log
router.put('/:id', async (req, res) => {
  try {
    const updatedLog = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a log
router.delete('/:id', async (req, res) => {
  try {
    await Log.findByIdAndDelete(req.params.id);
    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
