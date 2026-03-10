import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenu(false);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <nav className={`navbar-luxury ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-luxury">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <span className="brand-icon">✦</span>
            <span className="brand-text">Grandeur Palace</span>
          </Link>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`navbar-links ${mobileMenu ? 'active' : ''}`}>
            <Link to="/" onClick={closeMobileMenu}>Home</Link>
            <Link to="/rooms" onClick={closeMobileMenu}>Rooms</Link>
            <Link to="/offers" onClick={closeMobileMenu}>Offers</Link>
            <Link to="/gallery" onClick={closeMobileMenu}>Gallery</Link>
            <Link to="/about" onClick={closeMobileMenu}>About</Link>
            <Link to="/contact" onClick={closeMobileMenu}>Contact</Link>

            <div className="navbar-divider"></div>

            {isAuthenticated ? (
              <div className="navbar-user">
                <div className="user-dropdown">
                  <button className="user-btn">
                    <FaUser />
                    <span>{user?.name}</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link 
                      to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} 
                      onClick={closeMobileMenu}
                    >
                      <FaCog /> Dashboard
                    </Link>
                    <button onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn-login" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="btn-register" onClick={closeMobileMenu}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;