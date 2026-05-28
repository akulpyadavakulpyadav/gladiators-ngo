const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

module.exports = router;
