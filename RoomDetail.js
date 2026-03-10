import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './RoomDetail.css';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [booking, setBooking] = useState({
    checkIn: '', checkOut: '', guests: { adults: 2, children: 0 },
    offerCode: '', specialRequests: '', paymentMethod: 'Credit Card'
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [nights, setNights] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (booking.checkIn && booking.checkOut) {
      const n = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));
      setNights(n > 0 ? n : 0);
    }
  }, [booking.checkIn, booking.checkOut]);

  const fetchRoom = async () => {
    try {
      const { data } = await axios.get(`/api/rooms/${id}`);
      setRoom(data.room);
    } catch {
      toast.error('Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    if (name === 'adults' || name === 'children') {
      setBooking(prev => ({ ...prev, guests: { ...prev.guests, [name]: Number(value) } }));
    } else {
      setBooking(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateOffer = async () => {
    if (!booking.offerCode) return;
    try {
      const total = room.price * nights;
      const { data } = await axios.post('/api/offers/validate', { code: booking.offerCode, amount: total });
      if (data.success) {
        setDiscount(data.discount);
        toast.success(`Offer applied! You save ₹${data.discount.toLocaleString('en-IN')}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid offer code');
      setDiscount(0);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please login to book a room');
      navigate('/login');
      return;
    }
    if (!booking.checkIn || !booking.checkOut || nights < 1) {
      toast.error('Please select valid dates');
      return;
    }
    setBookingLoading(true);
    try {
      const { data } = await axios.post('/api/bookings', {
        roomId: id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        offerCode: booking.offerCode,
        specialRequests: booking.specialRequests,
        paymentMethod: booking.paymentMethod
      });
      if (data.success) {
        toast.success('Booking confirmed! 🎉');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const total = room ? room.price * nights : 0;
  const finalTotal = total - discount;
  const today = new Date().toISOString().split('T')[0];

  if (loading) return <div className="loading-screen"><div className="loader"></div></div>;
  if (!room) return null;

  return (
    <div className="room-detail">
      {/* Back Button */}
      <div className="back-bar">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Rooms
          </button>
        </div>
      </div>

      <div className="container">
        <div className="room-detail-grid">
          {/* Left Column */}
          <div className="room-detail-left">
            {/* Image Gallery */}
            <div className="detail-gallery">
              <div className="detail-main-img">
                <img src={room.images?.[activeImg]} alt={room.name} />
                <div className="detail-img-overlay">
                  <span className="detail-badge">{room.type}</span>
                </div>
              </div>
              {room.images?.length > 1 && (
                <div className="detail-thumbnails">
                  {room.images.map((img, i) => (
                    <button
                      key={i}
                      className={`thumbnail ${i === activeImg ? 'active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={img} alt={`View ${i+1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Info */}
            <div className="room-detail-info">
              <div className="detail-meta">
                <span className="stars">{'★'.repeat(Math.floor(room.rating))}</span>
                <span className="room-rating">{room.rating} · Room {room.roomNumber} · Floor {room.floor}</span>
              </div>
              <h1 className="detail-title">{room.name}</h1>
              <p className="detail-view">📍 {room.view}</p>
              <p className="detail-desc">{room.description}</p>

              {/* Key Details */}
              <div className="detail-specs">
                <div className="spec-item">
                  <span className="spec-icon">🛏️</span>
                  <span className="spec-label">Bed Type</span>
                  <span className="spec-value">{room.bedType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">📐</span>
                  <span className="spec-label">Room Size</span>
                  <span className="spec-value">{room.size} sq ft</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">👥</span>
                  <span className="spec-label">Capacity</span>
                  <span className="spec-value">{room.capacity?.adults} Adults, {room.capacity?.children} Children</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">🏢</span>
                  <span className="spec-label">Floor</span>
                  <span className="spec-value">Floor {room.floor}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="detail-section">
                <h3 className="detail-section-title">Amenities</h3>
                <div className="amenities-grid">
                  {room.amenities?.map((a, i) => (
                    <div key={i} className="amenity-item">
                      <span className="amenity-check">✓</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {room.features?.length > 0 && (
                <div className="detail-section">
                  <h3 className="detail-section-title">Special Features</h3>
                  <div className="features-list">
                    {room.features.map((f, i) => (
                      <span key={i} className="feature-chip">✦ {f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="room-detail-right">
            <div className="booking-card">
              <div className="booking-card-header">
                <div className="booking-price">
                  <span className="b-price">₹{room.price?.toLocaleString('en-IN')}</span>
                  <span className="b-per">/ night</span>
                </div>
                <div className="booking-rating">
                  <span>★ {room.rating}</span>
                </div>
              </div>

              <form onSubmit={handleBook} className="booking-form">
                <div className="booking-dates">
                  <div className="date-field">
                    <label className="form-label">Check-in</label>
                    <input type="date" name="checkIn" value={booking.checkIn} onChange={handleBookingChange} className="form-control" min={today} required />
                  </div>
                  <div className="date-field">
                    <label className="form-label">Check-out</label>
                    <input type="date" name="checkOut" value={booking.checkOut} onChange={handleBookingChange} className="form-control" min={booking.checkIn || today} required />
                  </div>
                </div>

                <div className="guests-row">
                  <div className="form-group">
                    <label className="form-label">Adults</label>
                    <select name="adults" value={booking.guests.adults} onChange={handleBookingChange} className="form-control">
                      {[...Array(room.capacity?.adults || 4)].map((_, i) => (
                        <option key={i} value={i+1}>{i+1} Adult{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Children</label>
                    <select name="children" value={booking.guests.children} onChange={handleBookingChange} className="form-control">
                      {[...Array((room.capacity?.children || 2) + 1)].map((_, i) => (
                        <option key={i} value={i}>{i} Child{i !== 1 ? 'ren' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select name="paymentMethod" value={booking.paymentMethod} onChange={handleBookingChange} className="form-control">
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Net Banking</option>
                    <option>UPI</option>
                    <option>Cash</option>
                  </select>
                </div>

                <div className="offer-field">
                  <label className="form-label">Offer Code</label>
                  <div className="offer-input-row">
                    <input
                      type="text"
                      name="offerCode"
                      value={booking.offerCode}
                      onChange={handleBookingChange}
                      className="form-control"
                      placeholder="Enter code..."
                      style={{ textTransform: 'uppercase' }}
                    />
                    <button type="button" onClick={validateOffer} className="apply-btn">Apply</button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={booking.specialRequests}
                    onChange={handleBookingChange}
                    className="form-control"
                    rows="3"
                    placeholder="Any special requests..."
                  />
                </div>

                {nights > 0 && (
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>₹{room.price?.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="price-row discount">
                        <span>Offer Discount</span>
                        <span>−₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="price-row total">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-book-now" disabled={bookingLoading}>
                  {bookingLoading ? <span className="btn-spinner"></span> : (user ? 'Confirm Booking' : 'Login to Book')}
                </button>
              </form>

              <p className="booking-note">No charges until check-in · Free cancellation available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;