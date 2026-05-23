const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Generate unique GC ID based on role
const generateGcId = async (role) => {
  const prefix = role === 'volunteer' ? 'VLT' : role === 'ngo' ? 'NGO' : 'CPY';
  let isUnique = false;
  let newId = '';

  while (!isUnique) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    newId = `${prefix}${randomDigits}`;
    const existingUser = await User.findById(newId);
    if (!existingUser) {
      isUnique = true;
    }
  }
  return newId;
};

// @route   POST /api/auth/register
// @desc    Register a user
router.post('/register', async (req, res) => {
  try {
    const { role, ...userData } = req.body;
    
    // Basic validation
    if (!role || !['volunteer', 'ngo', 'company'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    // Role-specific constraints
    if (role === 'volunteer' && !userData.aadhaar) {
      return res.status(400).json({ message: 'Aadhaar is required for volunteers.' });
    }
    if (role === 'ngo' && !userData.ngoDarpanId) {
      return res.status(400).json({ message: 'NGO Darpan ID is required for NGOs.' });
    }
    if (role === 'company' && !userData.cin) {
      return res.status(400).json({ message: 'CIN is required for companies.' });
    }

    // Generate unique primary key
    const gcId = await generateGcId(role);
    
    const newUser = new User({
      _id: gcId,
      role,
      ...userData
    });

    await newUser.save();

    const userObj = newUser.toObject();
    userObj.gcId = userObj._id;

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userObj 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login a user
router.post('/login', async (req, res) => {
  try {
    const { gcId, pin, role } = req.body;

    if (!gcId || !pin || !role) {
      return res.status(400).json({ message: 'Please provide GC-ID, PIN, and role.' });
    }

    const user = await User.findById(gcId.toUpperCase());
    
    if (!user || user.role !== role) {
      return res.status(404).json({ message: 'User not found or role mismatch.' });
    }

    if (user.pin !== pin) {
      return res.status(401).json({ message: 'Invalid PIN.' });
    }

    const userObj = user.toObject();
    userObj.gcId = userObj._id;

    res.status(200).json({ 
      message: 'Login successful', 
      user: userObj 
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { gcId, updatedData } = req.body;
    
    if (!gcId) {
      return res.status(400).json({ message: 'GC-ID is required for profile update.' });
    }

    const user = await User.findByIdAndUpdate(gcId, updatedData, { new: true });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userObj = user.toObject();
    userObj.gcId = userObj._id;

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: userObj 
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server error during profile update.' });
  }
});

module.exports = router;
