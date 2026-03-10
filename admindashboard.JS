import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaBed, 
  FaCalendarCheck, 
  FaDollarSign,
  FaArrowLeft,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRooms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    customers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, roomsRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/users'),
        axios.get('http://localhost:5000/api/rooms'),
        axios.get('http://localhost:5000/api/bookings')
      ]);

      const bookings = bookingsRes.data.data;
      const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      setStats({
        totalCustomers: usersRes.data.data.filter(u => u.role === 'user').length,
        totalRooms: roomsRes.data.data.length,
        totalBookings: bookings.length,
        totalRevenue,
        recentBookings: bookings.slice(0, 10),
        customers: usersRes.data.data.filter(u => u.role === 'user')
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <button onClick={() => navigate('/')} className="back-btn">
            <FaArrowLeft /> Back to Website
          </button>
          <h1>Admin Dashboard</h1>
        </div>
        <div className="header-right">
          <span className="admin-name">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Statistics Cards */}
        <div className="stats-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="stat-card customers"
          >
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-details">
              <h3>{stats.totalCustomers}</h3>
              <p>Registered Customers</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="stat-card rooms"
          >
            <div className="stat-icon">
              <FaBed />
            </div>
            <div className="stat-details">
              <h3>{stats.totalRooms}</h3>
              <p>Total Rooms</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="stat-card bookings"
          >
            <div className="stat-icon">
              <FaCalendarCheck />
            </div>
            <div className="stat-details">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="stat-card revenue"
          >
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-details">
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="dashboard-section"
        >
          <div className="section-header">
            <h2><FaChartLine /> Recent Bookings</h2>
          </div>
          
          <div className="table-responsive">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>#{booking._id.slice(-6).toUpperCase()}</td>
                    <td>{booking.user?.name || 'N/A'}</td>
                    <td>{booking.room?.name || 'N/A'}</td>
                    <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td>₹{booking.totalPrice.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-badge ${booking.paymentStatus}`}>
                        {booking.paymentStatus === 'paid' ? <FaCheckCircle /> : <FaClock />}
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Customer List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="dashboard-section"
        >
          <div className="section-header">
            <h2><FaUsers /> Registered Customers</h2>
          </div>
          
          <div className="table-responsive">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered On</th>
                  <th>Bookings</th>
                </tr>
              </thead>
              <tbody>
                {stats.customers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td>{index + 1}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="booking-count">
                        {stats.recentBookings.filter(b => b.user?._id === customer._id).length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;