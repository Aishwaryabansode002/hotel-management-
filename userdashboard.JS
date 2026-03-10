import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaUser, 
  FaCalendarAlt, 
  FaBed,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserBookings();
  }, [isAuthenticated, navigate]);

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <FaCheckCircle className="status-icon confirmed" />;
      case 'pending': return <FaClock className="status-icon pending" />;
      case 'cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      case 'completed': return <FaCheckCircle className="status-icon completed" />;
      default: return null;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading your bookings...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-btn">
            <FaArrowLeft /> Back to Website
          </button>
          <h1>My Dashboard</h1>
        </div>
        <div className="header-right">
          <span className="user-name">
            <FaUser /> {user?.name}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="user-info-card"
        >
          <div className="user-avatar">
            <FaUser />
          </div>
          <div className="user-details">
            <h2>{user?.name}</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Member Since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </motion.div>

        {/* Bookings Summary */}
        <div className="bookings-summary">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="summary-card total"
          >
            <div className="summary-icon">
              <FaCalendarAlt />
            </div>
            <div className="summary-details">
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="summary-card pending"
          >
            <div className="summary-icon">
              <FaClock />
            </div>
            <div className="summary-details">
              <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
              <p>Pending</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="summary-card confirmed"
          >
            <div className="summary-icon">
              <FaCheckCircle />
            </div>
            <div className="summary-details">
              <h3>{bookings.filter(b => b.status === 'confirmed').length}</h3>
              <p>Confirmed</p>
            </div>
          </motion.div>
        </div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bookings-section"
        >
          <div className="section-header">
            <h2><FaBed /> My Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <FaBed />
              <h3>No Bookings Yet</h3>
              <p>Start by browsing our amazing rooms!</p>
              <button onClick={() => navigate('/rooms')} className="btn-luxury">
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="booking-card"
                >
                  <div className="booking-header">
                    <div className="booking-id">
                      #{booking._id.slice(-6).toUpperCase()}
                    </div>
                    <div className={`booking-status ${getStatusClass(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </div>
                  </div>

                  {booking.room?.images && (
                    <div className="booking-image">
                      <img 
                        src={booking.room.images[0] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400'} 
                        alt={booking.room.name}
                      />
                    </div>
                  )}

                  <div className="booking-details">
                    <h3>{booking.room?.name || 'Room'}</h3>
                    <p className="room-type">{booking.room?.roomType}</p>

                    <div className="booking-info">
                      <div className="info-item">
                        <FaCalendarAlt />
                        <div>
                          <span className="label">Check In</span>
                          <span className="value">{new Date(booking.checkIn).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <FaCalendarAlt />
                        <div>
                          <span className="label">Check Out</span>
                          <span className="value">{new Date(booking.checkOut).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <FaDollarSign />
                        <div>
                          <span className="label">Total Amount</span>
                          <span className="value price">₹{booking.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="info-item">
                        <FaClock />
                        <div>
                          <span className="label">Payment</span>
                          <span className={`value payment-${booking.paymentStatus}`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <div className="special-requests">
                        <strong>Special Requests:</strong>
                        <p>{booking.specialRequests}</p>
                      </div>
                    )}

                    <div className="booking-date">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;