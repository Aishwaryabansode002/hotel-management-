import React from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaStar, FaHeart } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Header Section */}
      <section className="about-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>About Us</h1>
            <p>A Legacy of Luxury & Excellence</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section section-padding">
        <div className="container-luxury">
          <div className="story-grid">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="story-image"
            >
              <img 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800" 
                alt="Grandeur Palace" 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="story-content"
            >
              <h2>Our Story</h2>
              <div className="gold-divider"></div>
              <p>
                Since 1975, Grandeur Palace has been synonymous with luxury, elegance, and 
                exceptional hospitality. What began as a vision to create an oasis of refinement 
                in the heart of the city has blossomed into one of the world's most prestigious hotels.
              </p>
              <p>
                For over five decades, we have been dedicated to providing our guests with 
                unforgettable experiences, combining timeless elegance with modern luxury. 
                Our commitment to excellence has earned us numerous accolades and the loyalty 
                of discerning travelers from around the globe.
              </p>
              <p>
                Every detail at Grandeur Palace reflects our passion for perfection—from our 
                meticulously designed rooms to our world-class amenities and personalized service. 
                We don't just offer accommodation; we create memories that last a lifetime.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section section-padding">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            <h2>Our Values</h2>
            <div className="gold-divider"></div>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </motion.div>

          <div className="values-grid">
            {[
              {
                icon: <FaStar />,
                title: 'Excellence',
                description: 'We pursue perfection in every detail, ensuring each guest experience exceeds expectations.'
              },
              {
                icon: <FaHeart />,
                title: 'Hospitality',
                description: 'Genuine warmth and care are at the heart of our service philosophy.'
              },
              {
                icon: <FaAward />,
                title: 'Integrity',
                description: 'We uphold the highest standards of honesty and ethical conduct in all our operations.'
              },
              {
                icon: <FaUsers />,
                title: 'Community',
                description: 'We are committed to supporting our local community and environment.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="value-card"
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-padding">
        <div className="container-luxury">
          <div className="stats-grid">
            {[
              { number: '50+', label: 'Years of Excellence' },
              { number: '500+', label: 'Luxury Rooms' },
              { number: '100K+', label: 'Happy Guests' },
              { number: '150+', label: 'Awards Won' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="stat-item"
              >
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section section-padding">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            <h2>Our Leadership</h2>
            <div className="gold-divider"></div>
            <p className="section-subtitle">Meet the team behind the excellence</p>
          </motion.div>

          <div className="team-grid">
            {[
              {
                name: 'James Anderson',
                role: 'General Manager',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
              },
              {
                name: 'Sarah Mitchell',
                role: 'Director of Operations',
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
              },
              {
                name: 'Michael Chen',
                role: 'Executive Chef',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="team-card"
              >
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;