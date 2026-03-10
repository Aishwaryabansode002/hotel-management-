const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Offer = require('../models/Offer');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name type images price')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, offerCode, specialRequests, paymentMethod } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    if (!room.isAvailable) return res.status(400).json({ success: false, message: 'Room is not available' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < 1) return res.status(400).json({ success: false, message: 'Invalid dates' });

    let totalAmount = room.price * nights;
    let discountAmount = 0;

    // Apply offer code
    if (offerCode) {
      const offer = await Offer.findOne({ code: offerCode.toUpperCase(), isActive: true });
      if (offer && new Date() <= offer.validUntil) {
        if (offer.discountType === 'percentage') {
          discountAmount = (totalAmount * offer.discountValue) / 100;
          if (offer.maxDiscount) discountAmount = Math.min(discountAmount, offer.maxDiscount);
        } else {
          discountAmount = offer.discountValue;
        }
        totalAmount = Math.max(totalAmount - discountAmount, 0);
        offer.usedCount += 1;
        await offer.save();
      }
    }

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalAmount,
      discountAmount,
      offerCode: offerCode || '',
      specialRequests,
      paymentMethod,
      nights
    });

    await booking.populate('room', 'name type images price');

    res.status(201).json({ success: true, message: 'Booking confirmed!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (['Checked-In', 'Checked-Out'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/bookings/all (Admin)
// @desc    Get all bookings
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room', 'name type price')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/bookings/:id/status (Admin)
// @desc    Update booking status
// @access  Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('room', 'name');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Status updated!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;