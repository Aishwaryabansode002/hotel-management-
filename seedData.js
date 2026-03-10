const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Room = require('./models/Room');
const Offer = require('./models/Offer');
const Gallery = require('./models/Gallery');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-management');

const rooms = [
  {
    name: 'Classic Standard Room',
    type: 'Standard',
    description: 'A well-appointed standard room featuring modern decor, comfortable furnishings, and all essential amenities for a pleasant stay.',
    price: 8999,
    size: 320,
    bedType: 'Queen Size',
    view: 'Garden View',
    floor: 2,
    roomNumber: '201',
    capacity: { adults: 2, children: 1 },
    amenities: ['Free WiFi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Safe', 'Hair Dryer', 'Room Service'],
    features: ['Garden View', 'Work Desk', 'Closet'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    ],
    rating: 4.2
  },
  {
    name: 'Superior Double Room',
    type: 'Standard',
    description: 'Spacious double room with premium bedding, city views, and upgraded bathroom with rain shower.',
    price: 12999,
    size: 380,
    bedType: 'King Size',
    view: 'City View',
    floor: 3,
    roomNumber: '301',
    capacity: { adults: 2, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Safe', 'Bathtub', 'Rain Shower', 'Room Service', 'Balcony'],
    features: ['City View', 'Balcony', 'Lounge Chair'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'
    ],
    rating: 4.4
  },
  {
    name: 'Deluxe City View Room',
    type: 'Deluxe',
    description: 'Elegantly furnished deluxe room with panoramic city views, premium amenities, and exclusive access to the executive lounge.',
    price: 18999,
    size: 450,
    bedType: 'King Size',
    view: 'Panoramic City View',
    floor: 6,
    roomNumber: '601',
    capacity: { adults: 2, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '55" Smart TV', 'Mini Bar', 'Safe', 'Jacuzzi', 'Espresso Machine', 'Executive Lounge Access', 'Butler Service'],
    features: ['Panoramic View', 'Executive Lounge', 'Turndown Service'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
      'https://images.unsplash.com/photo-1631049421450-348ccd7f8949?w=800&q=80'
    ],
    rating: 4.6
  },
  {
    name: 'Deluxe Pool View Room',
    type: 'Deluxe',
    description: 'Beautiful deluxe room overlooking our stunning infinity pool with direct access to pool deck.',
    price: 21999,
    size: 480,
    bedType: 'King Size',
    view: 'Pool View',
    floor: 2,
    roomNumber: '202',
    capacity: { adults: 2, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '55" Smart TV', 'Mini Bar', 'Safe', 'Rain Shower', 'Bathtub', 'Pool Access', 'Outdoor Sitting'],
    features: ['Pool View', 'Private Balcony', 'Pool Access'],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
    ],
    rating: 4.7
  },
  {
    name: 'Junior Suite',
    type: 'Suite',
    description: 'Sophisticated junior suite with separate living area, premium furnishings, and stunning views.',
    price: 28999,
    size: 600,
    bedType: 'King Size',
    view: 'Sea View',
    floor: 8,
    roomNumber: '801',
    capacity: { adults: 2, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Full Mini Bar', 'In-room Safe', 'Jacuzzi', 'Espresso Machine', 'Living Area', 'Butler Service', 'Executive Lounge'],
    features: ['Separate Living Room', 'Sea View', 'Premium Minibar'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80'
    ],
    rating: 4.8
  },
  {
    name: 'Luxury Suite',
    type: 'Suite',
    description: 'Lavish suite with separate bedroom, living room, dining area, and premium amenities for the discerning traveler.',
    price: 42999,
    size: 900,
    bedType: 'King Size',
    view: 'Ocean View',
    floor: 10,
    roomNumber: '1001',
    capacity: { adults: 3, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Full Bar', 'In-room Safe', 'Jacuzzi', 'Steam Room', 'Living Room', 'Dining Area', 'Private Butler', 'Complimentary Breakfast'],
    features: ['Dining Area', 'Ocean View', 'Steam Room', 'Complimentary Breakfast'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
      'https://images.unsplash.com/photo-1592229505726-ca121723b8ef?w=800&q=80'
    ],
    rating: 4.9
  },
  {
    name: 'Family Suite',
    type: 'Suite',
    description: 'Spacious family suite with two bedrooms, children\'s play area, and family-friendly amenities.',
    price: 35999,
    size: 1100,
    bedType: 'King + Twin Beds',
    view: 'Garden & Pool View',
    floor: 4,
    roomNumber: '401',
    capacity: { adults: 4, children: 3 },
    amenities: ['Free WiFi', 'Air Conditioning', 'Smart TV (x2)', 'Kitchen', 'In-room Safe', 'Bathtub', 'Kids Play Area', 'Family Dining', 'Cribs Available'],
    features: ['2 Bedrooms', 'Kids Play Area', 'Kitchen', 'Family Dining'],
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'
    ],
    rating: 4.7
  },
  {
    name: 'Garden Villa',
    type: 'Villa',
    description: 'Private garden villa with personal plunge pool, lush greenery, and exclusive butler service.',
    price: 55999,
    size: 1400,
    bedType: 'King Size + Sofa Bed',
    view: 'Private Garden',
    floor: 1,
    roomNumber: 'V101',
    capacity: { adults: 4, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Full Kitchen', 'Private Plunge Pool', 'Jacuzzi', 'BBQ Area', 'Dedicated Butler', 'Private Garden', 'Golf Cart Transfer'],
    features: ['Private Pool', 'Private Garden', 'Full Kitchen', 'BBQ Grill'],
    images: [
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80',
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80'
    ],
    rating: 5.0
  },
  {
    name: 'Beach Villa',
    type: 'Villa',
    description: 'Stunning beachfront villa with direct beach access, private pool, and breathtaking ocean panoramas.',
    price: 75000,
    size: 1800,
    bedType: 'King Size',
    view: 'Direct Beach & Ocean',
    floor: 1,
    roomNumber: 'V102',
    capacity: { adults: 4, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '85" Smart TV', 'Full Kitchen', 'Private Beach Access', 'Infinity Pool', 'Outdoor Shower', 'Dedicated Butler', 'Private Sunbeds', 'Kayaking Equipment'],
    features: ['Private Beach', 'Infinity Pool', 'Outdoor Kitchen', 'Water Sports'],
    images: [
      'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'
    ],
    rating: 5.0
  },
  {
    name: 'Presidential Suite',
    type: 'Presidential',
    description: 'The pinnacle of luxury — our flagship presidential suite with panoramic views, butler service, and the most exclusive amenities.',
    price: 120000,
    size: 2200,
    bedType: 'California King',
    view: '360° Panoramic View',
    floor: 15,
    roomNumber: '1501',
    capacity: { adults: 4, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '100" Smart TV', 'Full Bar', 'Grand Piano', 'Private Gym', 'Spa Room', 'Private Jacuzzi', 'Dedicated Butler Team', 'Complimentary Meals', 'Airport Transfer', 'Limo Service'],
    features: ['Private Gym', 'Spa Room', 'Grand Piano', 'Panoramic View', 'Complimentary Meals'],
    images: [
      'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
      'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?w=800&q=80'
    ],
    rating: 5.0
  },
  {
    name: 'Executive Business Room',
    type: 'Deluxe',
    description: 'Designed for the business traveler, this room features a premium work setup, high-speed WiFi, and direct access to business lounge.',
    price: 16999,
    size: 420,
    bedType: 'Queen Size',
    view: 'City Business District',
    floor: 7,
    roomNumber: '701',
    capacity: { adults: 2, children: 0 },
    amenities: ['1Gbps WiFi', 'Air Conditioning', '55" Smart TV', 'Work Station', 'Printer', 'Safe', 'Espresso Machine', 'Business Lounge Access', 'Evening Cocktails'],
    features: ['Premium Work Station', 'Business Lounge', 'Printer/Scanner', 'Evening Cocktails'],
    images: [
      'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
    ],
    rating: 4.5
  },
  {
    name: 'Honeymoon Suite',
    type: 'Suite',
    description: 'Romantic suite with rose petal turndown, champagne on arrival, private jacuzzi with ocean views, perfect for couples.',
    price: 38999,
    size: 750,
    bedType: 'California King',
    view: 'Romantic Ocean View',
    floor: 12,
    roomNumber: '1201',
    capacity: { adults: 2, children: 0 },
    amenities: ['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Champagne on Arrival', 'Rose Petal Turndown', 'Jacuzzi', 'Couple Spa Package', 'Candlelight Dinner', 'Pillow Menu', 'Private Balcony'],
    features: ['Romantic Setup', 'Champagne', 'Couple Spa', 'Candlelight Dinner'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'
    ],
    rating: 4.9
  },
  {
    name: 'Penthouse Level A',
    type: 'Penthouse',
    description: 'Exclusive penthouse spanning an entire floor with private terrace, infinity hot tub, and unobstructed 360° views.',
    price: 95000,
    size: 3000,
    bedType: 'Super King Size',
    view: '360° Rooftop Panorama',
    floor: 20,
    roomNumber: 'PH-A',
    capacity: { adults: 6, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', 'Multiple Smart TVs', 'Full Gourmet Kitchen', 'Private Terrace', 'Hot Tub', 'Private Sauna', 'Home Theater', 'Dedicated Chef', 'Security Personnel', 'Helipad Access'],
    features: ['Private Terrace', 'Hot Tub', 'Sauna', 'Home Theater', 'Private Chef'],
    images: [
      'https://images.unsplash.com/photo-1617104678098-de229db51175?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
    ],
    rating: 5.0
  },
  {
    name: 'Sky Loft Suite',
    type: 'Suite',
    description: 'Dramatic double-height loft suite with spiral staircase, private library, and spectacular skyline views.',
    price: 52999,
    size: 1300,
    bedType: 'King Size (Upper Level)',
    view: 'Skyline View',
    floor: 14,
    roomNumber: '1401',
    capacity: { adults: 3, children: 1 },
    amenities: ['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Library', 'Private Bar', 'Jacuzzi', 'Spiral Staircase', 'Upper Lounge', 'Butler Service', 'Complimentary Breakfast'],
    features: ['Duplex Layout', 'Private Library', 'Spiral Staircase', 'Sky Lounge'],
    images: [
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&q=80'
    ],
    rating: 4.9
  },
  {
    name: 'Heritage Deluxe Room',
    type: 'Deluxe',
    description: 'Inspired by royal Mughal architecture, this heritage room blends classic elegance with modern comforts.',
    price: 22999,
    size: 500,
    bedType: 'King Size',
    view: 'Heritage Garden',
    floor: 5,
    roomNumber: '501',
    capacity: { adults: 2, children: 2 },
    amenities: ['Free WiFi', 'Air Conditioning', '55" Smart TV', 'Antique Furniture', 'Clawfoot Bathtub', 'In-room Safe', 'Traditional Tea Set', 'Butler Service', 'Heritage Garden View'],
    features: ['Antique Decor', 'Clawfoot Bathtub', 'Heritage Garden', 'Cultural Experience'],
    images: [
      'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'
    ],
    rating: 4.6
  }
];

const offers = [
  {
    title: 'Early Bird Discount',
    description: 'Book 30 days in advance and save 30% on your stay. Valid for all room types.',
    code: 'EARLY30',
    discountType: 'percentage',
    discountValue: 30,
    maxDiscount: 15000,
    minBookingAmount: 10000,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Weekend Getaway Special',
    description: 'Enjoy 20% off on weekend stays (Fri-Sun). Includes complimentary breakfast for 2.',
    code: 'WEEKEND20',
    discountType: 'percentage',
    discountValue: 20,
    maxDiscount: 10000,
    minBookingAmount: 8000,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Honeymoon Package',
    description: 'Celebrate your love with 25% off + rose petal turndown + candlelight dinner + spa for 2.',
    code: 'HONEYMOON25',
    discountType: 'percentage',
    discountValue: 25,
    maxDiscount: 20000,
    minBookingAmount: 25000,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
    validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Corporate Deal',
    description: 'Special corporate rates with 15% off for business travelers. Includes high-speed WiFi & breakfast.',
    code: 'CORP15',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscount: 8000,
    minBookingAmount: 12000,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Festive Season Offer',
    description: 'Celebrate the festive season with flat ₹5000 off on stays of 3+ nights. Limited time offer!',
    code: 'FESTIVE5000',
    discountType: 'fixed',
    discountValue: 5000,
    minBookingAmount: 20000,
    image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&q=80',
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  }
];

const galleryImages = [
  { title: 'Luxury Suite Interior', category: 'Rooms', imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80' },
  { title: 'Presidential Suite', category: 'Rooms', imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80' },
  { title: 'Grand Hotel Lobby', category: 'Lobby', imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80' },
  { title: 'Rooftop Infinity Pool', category: 'Pool', imageUrl: 'https://images.unsplash.com/photo-1575429198097-0a5bf9702f30?w=800&q=80' },
  { title: 'Fine Dining Restaurant', category: 'Restaurant', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
  { title: 'Luxury Spa', category: 'Spa', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80' },
  { title: 'Deluxe Room', category: 'Rooms', imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80' },
  { title: 'Hotel Exterior', category: 'Exterior', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80' },
  { title: 'Conference Hall', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80' },
  { title: 'Bar & Lounge', category: 'Restaurant', imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80' },
  { title: 'Fitness Center', category: 'Other', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
  { title: 'Grand Ballroom', category: 'Events', imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80' },
  { title: 'Garden Terrace', category: 'Exterior', imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80' },
  { title: 'Breakfast Buffet', category: 'Restaurant', imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80' },
  { title: 'Ocean View Suite', category: 'Rooms', imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80' }
];

const seedDB = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await Room.deleteMany({});
    await Offer.deleteMany({});
    await Gallery.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@grandeur.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@grandeur.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@grandeur.com / admin123');
    }

    // Seed rooms
    await Room.insertMany(rooms);
    console.log(`✅ ${rooms.length} rooms added`);

    // Seed offers
    await Offer.insertMany(offers);
    console.log(`✅ ${offers.length} offers added`);

    // Seed gallery
    await Gallery.insertMany(galleryImages);
    console.log(`✅ ${galleryImages.length} gallery images added`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('🔑 Admin Login: admin@grandeur.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();