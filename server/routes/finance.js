const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const Donation = require('../models/Donation');
const ExpenseLog = require('../models/ExpenseLog');
const FinanceReport = require('../models/FinanceReport');

// 0. Finance Reports
router.post('/reports', async (req, res) => {
  try {
    const { ngoId, campaignId, title, rows, bills } = req.body;
    if (!ngoId || !title || !rows) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Calculate totalAmount
    const totalAmount = rows.reduce((acc, row) => acc + Number(row.expense || 0), 0);
    
    const newReport = new FinanceReport({ ngoId, campaignId: campaignId || null, title, rows, totalAmount, bills });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: 'Error generating finance report' });
  }
});

router.get('/reports/:ngoId', async (req, res) => {
  try {
    const reports = await FinanceReport.find({ ngoId: req.params.ngoId }).sort({ createdAt: -1 }).populate('campaignId', 'title');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching finance reports' });
  }
});

router.delete('/reports/:id', async (req, res) => {
  try {
    const report = await FinanceReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting report' });
  }
});

router.put('/reports/:id', async (req, res) => {
  try {
    const { title, campaignId, rows, totalAmount, bills } = req.body;
    const report = await FinanceReport.findByIdAndUpdate(
      req.params.id,
      { title, campaignId, rows, totalAmount, bills },
      { new: true }
    );
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Error updating report' });
  }
});

// 1. Campaigns
router.post('/campaigns', async (req, res) => {
  try {
    const { ngoId, title, description, targetAmount, endDate } = req.body;
    if (!ngoId) return res.status(400).json({ error: 'ngoId is required' });
    const newCampaign = new Program({ ngoId, title, description, targetAmount, endDate });
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ error: 'Error creating campaign' });
  }
});

router.get('/campaigns/:ngoId', async (req, res) => {
  try {
    const campaigns = await Program.find({ ngoId: req.params.ngoId }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching campaigns' });
  }
});

// Complete a campaign
router.put('/campaigns/:id/complete', async (req, res) => {
  try {
    const campaign = await Program.findByIdAndUpdate(req.params.id, { status: 'Completed' }, { new: true });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Error completing campaign' });
  }
});

// Generate/submit a finance report for a campaign
router.post('/campaigns/:id/report', async (req, res) => {
  try {
    const { reportUrl } = req.body;
    const campaign = await Program.findByIdAndUpdate(req.params.id, { 
      hasFinanceReport: true, 
      financeReportUrl: reportUrl || 'generated_report.pdf' 
    }, { new: true });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Error generating finance report' });
  }
});

// Get campaigns pending finance report
router.get('/campaigns/:ngoId/pending-reports', async (req, res) => {
  try {
    const campaigns = await Program.find({ 
      ngoId: req.params.ngoId, 
      status: 'Completed', 
      hasFinanceReport: false 
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending reports' });
  }
});

// 2. Donations
router.post('/donations', async (req, res) => {
  try {
    const { ngoId, donorId, campaignId, amount, donorName } = req.body;
    if (!ngoId || !donorId || !amount) return res.status(400).json({ error: 'Missing required fields' });
    
    const newDonation = new Donation({ ngoId, donorId, campaignId, amount, donorName });
    await newDonation.save();
    
    if (campaignId) {
      await Program.findByIdAndUpdate(campaignId, { $inc: { raisedAmount: amount } });
    }
    
    res.status(201).json(newDonation);
  } catch (error) {
    res.status(500).json({ error: 'Error logging donation' });
  }
});

router.get('/donations/:ngoId', async (req, res) => {
  try {
    const donations = await Donation.find({ ngoId: req.params.ngoId }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching donations' });
  }
});

// 3. Expenses
router.post('/expenses', async (req, res) => {
  try {
    const { ngoId, campaignId, title, amountSpent, category, description, proofUrl } = req.body;
    if (!ngoId || !title || !amountSpent || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newExpense = new ExpenseLog({ ngoId, campaignId, title, amountSpent, category, description, proofUrl });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Error logging expense' });
  }
});

router.get('/expenses/:ngoId', async (req, res) => {
  try {
    const expenses = await ExpenseLog.find({ ngoId: req.params.ngoId }).sort({ createdAt: -1 }).populate('campaignId', 'title');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
});

module.exports = router;
