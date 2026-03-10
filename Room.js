const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Penthouse', 'Villa']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    default: null
  },
  capacity: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 1 }
  },
  size: {
    type: Number, // in sq ft
    required: true
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  floor: {
    type: Number,
    default: 1
  },
  roomNumber: {
    type: String,
    unique: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  features: [{
    type: String
  }],
  bedType: {
    type: String,
    default: 'King Size'
  },
  view: {
    type: String,
    default: 'City View'
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);