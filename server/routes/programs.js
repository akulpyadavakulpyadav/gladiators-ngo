const express = require('express');
const Program = require('../models/Program');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/programs
// @desc    NGO broadcasts a new program/need
router.post('/', async (req, res) => {
  try {
    const { ngoId, title, description, rolesNeeded, location } = req.body;
    
    if (!ngoId || !title || !description || !rolesNeeded || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProgram = new Program({
      ngoId,
      title,
      description,
      rolesNeeded,
      location
    });

    await newProgram.save();
    res.status(201).json(newProgram);
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/programs
// @desc    Get all active programs (for volunteers)
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find({ status: 'Active' })
      .populate('ngoId', 'name domain location profilePhoto headquarters about')
      .sort({ createdAt: -1 });
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/programs/ngo/:ngoId
// @desc    Get all programs for a specific NGO
router.get('/ngo/:ngoId', async (req, res) => {
  try {
    const { ngoId } = req.params;
    const programs = await Program.find({ ngoId }).sort({ createdAt: -1 });
    res.status(200).json(programs);
  } catch (error) {
    console.error('Error fetching NGO programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/programs/:id/end
// @desc    NGO ends a program and logs hours
router.put('/:id/end', async (req, res) => {
  try {
    const { id } = req.params;
    const { hours } = req.body;
    
    if (hours === undefined || isNaN(hours) || hours <= 0) {
      return res.status(400).json({ message: 'Valid hours are required to end a campaign' });
    }

    const program = await Program.findByIdAndUpdate(
      id,
      { status: 'Completed', hours: Number(hours) },
      { new: true }
    );

    if (!program) return res.status(404).json({ message: 'Program not found' });
    
    res.status(200).json(program);
  } catch (error) {
    console.error('Error ending program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/programs/:id
// @desc    Delete a program
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findByIdAndDelete(id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(200).json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
