const express = require('express');
const Application = require('../models/Application');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/applications
// @desc    Volunteer applies to a program
router.post('/', async (req, res) => {
  try {
    const { programId, ngoId, volunteerId, roleApplied } = req.body;
    
    if (!programId || !ngoId || !volunteerId || !roleApplied) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if already applied
    const existing = await Application.findOne({ programId, volunteerId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this program' });
    }

    const newApp = new Application({
      programId,
      ngoId,
      volunteerId,
      roleApplied
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/ngo/:ngoId
// @desc    NGO fetches applications for their programs
router.get('/ngo/:ngoId', async (req, res) => {
  try {
    const { ngoId } = req.params;
    
    const applications = await Application.find({ ngoId })
      .populate('volunteerId', 'name profilePhoto location interests age')
      .populate('programId', 'title')
      .sort({ createdAt: -1 });
      
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    NGO updates application status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved' or 'Rejected'
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) return res.status(404).json({ message: 'Application not found' });
    
    res.status(200).json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/volunteer/public/:gcId
// @desc    Fetch public volunteer profile (hide sensitive info)
router.get('/volunteer/public/:gcId', async (req, res) => {
  try {
    const { gcId } = req.params;
    const volunteer = await User.findById(gcId)
      .select('name profilePhoto location interests age');
      
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
    
    res.status(200).json(volunteer);
  } catch (error) {
    console.error('Error fetching volunteer public profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
