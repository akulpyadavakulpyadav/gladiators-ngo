const express = require('express');
const User = require('../models/User');
const Application = require('../models/Application');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Simple in-memory OTP store
const otpStore = new Map();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


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

// @route   GET /api/auth/ngos
// @desc    Get all NGOs
router.get('/ngos', async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' }).select('-pin');
    res.status(200).json(ngos);
  } catch (error) {
    console.error('Error fetching NGOs:', error);
    res.status(500).json({ message: 'Server error fetching NGOs.' });
  }
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = '123456'; // HARDCODED FOR TESTING
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 minutes expiry

    /* COMMENTED OUT FOR LOCAL TESTING
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Gladiators Connect Registration OTP',
      text: `Your OTP for registration is: ${otp}\nThis code will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    */
    
    console.log(`[TEST MODE] OTP for ${email} is ${otp}`);
    res.status(200).json({ success: true, message: 'OTP sent successfully (Test Mode)' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.status(400).json({ success: false, message: 'No OTP found for this email. Please request a new one.' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp === otp) {
      otpStore.delete(email);
      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error during OTP verification' });
  }
});

// Helper: Check and award badges dynamically
const checkAndAwardBadges = async (user) => {
  if (user.role !== 'volunteer') return user;

  // Find all approved applications for this volunteer
  const apps = await Application.find({ volunteerId: user._id, status: 'Approved' })
    .populate('programId');

  // Filter those where the program status is Completed
  const completedApps = apps.filter(app => app.programId && app.programId.status === 'Completed');
  
  // Sum the hours
  const totalHours = completedApps.reduce((acc, app) => acc + (app.programId.hours || 0), 0);

  // Define our badge tiers
  const badgeTiers = [
    { limit: 5, name: 'Green Horn', level: 'Bronze', description: 'Active contributor supporting community events.' },
    { limit: 15, name: 'Earth Champion', level: 'Silver', description: 'Dedicated champion driving impactful initiatives.' },
    { limit: 30, name: 'Gladiator Hero', level: 'Gold', description: 'Outstanding leader making a significant difference.' },
    { limit: 50, name: 'Eco Vanguard', level: 'Platinum', description: 'Elite volunteer pioneer and community legend.' }
  ];

  let hasNewBadge = false;
  const currentBadges = user.badges || [];

  for (const tier of badgeTiers) {
    if (totalHours >= tier.limit) {
      // Check if user already has this level badge
      const exists = currentBadges.some(b => b.level === tier.level);
      if (!exists) {
        currentBadges.push({
          name: tier.name,
          level: tier.level,
          description: tier.description,
          earnedAt: new Date(),
          notified: false
        });
        hasNewBadge = true;
      }
    }
  }

  if (hasNewBadge) {
    user.badges = currentBadges;
    await user.save();
  }

  return user;
};

// @route   GET /api/auth/volunteer/:gcId/badges
// @desc    Run badge checking logic and return current badges and stats
router.get('/volunteer/:gcId/badges', async (req, res) => {
  try {
    const { gcId } = req.params;
    let user = await User.findById(gcId.toUpperCase());
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Run badge check
    user = await checkAndAwardBadges(user);

    // Calculate stats for return
    const apps = await Application.find({ volunteerId: user._id, status: 'Approved' })
      .populate('programId');
    const completedApps = apps.filter(app => app.programId && app.programId.status === 'Completed');
    const totalHours = completedApps.reduce((acc, app) => acc + (app.programId.hours || 0), 0);
    const eventsCount = completedApps.length;

    res.status(200).json({
      badges: user.badges || [],
      totalHours,
      eventsCount
    });
  } catch (error) {
    console.error('Error fetching volunteer badges:', error);
    res.status(500).json({ message: 'Server error fetching badges.' });
  }
});

// @route   PUT /api/auth/volunteer/:gcId/badges/mark-notified
// @desc    Mark all new badges as notified
router.put('/volunteer/:gcId/badges/mark-notified', async (req, res) => {
  try {
    const { gcId } = req.params;
    const user = await User.findById(gcId.toUpperCase());
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.badges && user.badges.length > 0) {
      user.badges.forEach(b => {
        b.notified = true;
      });
      user.markModified('badges');
      await user.save();
    }

    res.status(200).json({ success: true, badges: user.badges });
  } catch (error) {
    console.error('Error marking badges notified:', error);
    res.status(500).json({ message: 'Server error marking badges as notified.' });
  }
});

module.exports = router;
