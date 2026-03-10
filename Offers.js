import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTag, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './Offers.css';

const Offers = () => {

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(fetchOffers, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ CORRECT PLACE (INSIDE COMPONENT)
  const fetchOffers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/offers');

      if (response?.data?.data?.length) {
        setOffers(response.data.data);
      } else {
        // 👑 DEFAULT LUXURY OFFERS (ADDED)
        setOffers([
          {
            _id: "1",
            title: "Royal Weekend Escape",
            description: "Luxury suite stay with spa and breakfast included.",
            discount: 30,
            code: "ROYAL30",
            validFrom: new Date(),
            validTo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
            minBookingAmount: 20000
          },
          {
            _id: "2",
            title: "Honeymoon Special",
            description: "Romantic candlelight dinner with premium suite.",
            discount: 40,
            code: "LOVE40",
            validFrom: new Date(),
            validTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
            minBookingAmount: 30000
          },
          {
            _id: "3",
            title: "Early Bird Deal",
            description: "Book early and enjoy exclusive savings.",
            discount: 20,
            code: "EARLY20",
            validFrom: new Date(),
            validTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
            minBookingAmount: 15000
          }
        ]);
      }

    } catch (error) {
      console.error('Error fetching offers:', error);

      setOffers([
        {
          _id: "fallback",
          title: "Luxury Stay Offer",
          description: "Exclusive luxury room discount.",
          discount: 25,
          code: "LUX25",
          validFrom: new Date(),
          validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
          minBookingAmount: 18000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (endDate) => {
    const difference = new Date(endDate) - new Date();
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      return days > 0 ? `${days} days left` : `${hours} hours left`;
    }
    return 'Expired';
  };

  return (
    <div className="offers-page">
      <section className="offers-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }}>
            <FaTag className="header-icon" />
            <h1>Special Offers</h1>
            <p>Exclusive deals for unforgettable stays</p>
          </motion.div>
        </div>
      </section>

      <div className="container-luxury section-padding">
        {loading ? (
          <div className="offers-grid">
            {[1,2,3].map(i=>(
              <div key={i} className="offer-card skeleton" style={{height:'500px'}}></div>
            ))}
          </div>
        ) : (offers?.length || 0) === 0 ? (
          <div className="no-offers">
            <FaTag />
            <h3>No active offers at the moment</h3>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map((offer,index)=>(
              <motion.div key={offer._id||index} className="offer-card card-luxury">
                <div className="offer-badge">{offer.discount}% OFF</div>
                <div className="offer-image">
                  <img src={offer.image} alt={offer.title}/>
                </div>

                <div className="offer-content">
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>

                  <div className="detail-item">
                    <FaClock/>
                    <span>{calculateTimeLeft(offer.validTo)}</span>
                  </div>

                  <div className="offer-code">{offer.code}</div>

                  <Link to="/rooms" className="btn-luxury btn-block">
                    Book Now & Save
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;