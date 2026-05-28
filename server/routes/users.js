const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
const Campaign = require('../models/Campaign');
const Program = require('../models/Program');

// Search NGOs (Charity Search Engine)
router.get('/ngos/search', async (req, res) => {
  try {
    const { location, domain } = req.query;
    
    // Base query for NGOs
    let query = { role: 'ngo' };
    
    if (location) {
      // Simple text match for location (can be improved with regex)
      query.headquarters = new RegExp(location, 'i');
    }
    
    if (domain) {
      query.domain = new RegExp(domain, 'i');
    }

    // Select only public/non-sensitive fields
    const ngos = await User.find(query).select(
      'name email phone profilePhoto ngoDarpanId headquarters website domain about mediaGallery pocName pocDesignation'
    ).sort({ createdAt: -1 });

    res.json(ngos);
  } catch (error) {
    console.error('Error searching NGOs:', error);
    res.status(500).json({ error: 'Server error while searching NGOs' });
  }
});

// Get True Impact Stats for NGO
router.get('/ngos/:ngoId/stats', async (req, res) => {
  try {
    const { ngoId } = req.params;
    
    const volunteers = await Application.countDocuments({ ngoId, status: 'Approved' });
    const campaigns = await Campaign.countDocuments({ ngoId });
    
    const completedPrograms = await Program.find({ ngoId, status: 'Completed' });
    const hours = completedPrograms.reduce((acc, prog) => acc + (prog.hours || 0), 0);
    
    res.json({ volunteers, campaigns, hours });
  } catch (error) {
    console.error('Error fetching NGO stats:', error);
    res.status(500).json({ error: 'Server error while fetching NGO stats' });
  }
});

module.exports = router;
