const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/gallery
// @desc    Get all gallery images
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;

    const images = await Gallery.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: images.length, images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/gallery (Admin)
// @desc    Add gallery image
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const image = await Gallery.create(req.body);
    res.status(201).json({ success: true, message: 'Image added!', image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/gallery/:id (Admin)
// @desc    Update gallery image
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, message: 'Image updated!', image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/gallery/:id (Admin)
// @desc    Delete gallery image
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;