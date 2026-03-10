import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="brand-icon">✦</span>
                <div>
                  <div className="footer-name">Grandeur Palace</div>
                  <div className="footer-tagline">Luxury Hotel & Resort</div>
                </div>
              </div>
              <p className="footer-desc">
                Experience the pinnacle of luxury hospitality where every detail is crafted to perfection. Your extraordinary journey begins here.
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon" aria-label="Facebook">f</a>
                <a href="#" className="social-icon" aria-label="Instagram">◎</a>
                <a href="#" className="social-icon" aria-label="Twitter">𝕏</a>
                <a href="#" className="social-icon" aria-label="LinkedIn">in</a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Explore</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/rooms">Our Rooms</Link></li>
                <li><Link to="/offers">Special Offers</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li><a href="#">Fine Dining</a></li>
                <li><a href="#">Spa & Wellness</a></li>
                <li><a href="#">Conference Rooms</a></li>
                <li><a href="#">Airport Transfer</a></li>
                <li><a href="#">Concierge</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Contact</h4>
              <div className="footer-contact">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>123 Palace Road, Marina District<br />Mumbai 400001, India</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>reservations@grandeurpalace.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🕐</span>
                  <span>24/7 Front Desk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>© 2024 Grandeur Palace Hotel & Resort. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;