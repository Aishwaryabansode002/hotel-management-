const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/offers
// @desc    Get all active offers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true, validUntil: { $gte: new Date() } })
      .sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/offers/validate
// @desc    Validate an offer code
// @access  Private
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, amount } = req.body;
    const offer = await Offer.findOne({ code: code.toUpperCase(), isActive: true });

    if (!offer) return res.status(404).json({ success: false, message: 'Invalid offer code' });
    if (new Date() > offer.validUntil) return res.status(400).json({ success: false, message: 'Offer has expired' });
    if (offer.usedCount >= offer.usageLimit) return res.status(400).json({ success: false, message: 'Offer limit reached' });
    if (amount < offer.minBookingAmount) {
      return res.status(400).json({ success: false, message: `Minimum booking amount: ₹${offer.minBookingAmount}` });
    }

    let discount = offer.discountType === 'percentage'
      ? (amount * offer.discountValue) / 100
      : offer.discountValue;
    if (offer.maxDiscount) discount = Math.min(discount, offer.maxDiscount);

    res.json({ success: true, offer, discount, finalAmount: amount - discount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/offers (Admin)
// @desc    Create offer
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, message: 'Offer created!', offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/offers/:id (Admin)
// @desc    Update offer
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.json({ success: true, message: 'Offer updated!', offer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/offers/:id (Admin)
// @desc    Delete offer
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Offer deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/offers/all (Admin)
// @desc    Get all offers including expired
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;