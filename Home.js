import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, offersRes] = await Promise.all([
        axios.get("http://localhost:5000/api/rooms?featured=true"),
        axios.get("http://localhost:5000/api/offers"),
      ]);

      setFeaturedRooms(roomsRes.data.data.slice(0, 3));
      setOffers(offersRes.data.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <span className="hero-subtitle">Welcome to Luxury</span>

          <h1 className="hero-title">Grandeur Palace</h1>

          <p className="hero-desc">
            Experience the epitome of elegance and sophistication in the heart
            of the city
          </p>

          <div className="hero-actions">
            <Link to="/rooms" className="btn-luxury">
              Explore Rooms
            </Link>

            <Link to="/offers" className="btn-outline-white">
              View Offers
            </Link>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ROOMS SECTION */}
      <section className="section-rooms">
        <div className="container-luxury">

          <div className="rooms-grid">
            {loading ? (
              <p className="rooms-placeholder">Loading rooms...</p>
            ) : (
              featuredRooms.map((room) => (
                <motion.div
                  key={room._id}
                  className="room-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >

                  {/* ROOM IMAGE */}
                  <div className="room-img-wrap">
                    <img
                      className="room-img"
                      src={
                        room.images && room.images.length > 0
                          ? room.images[0]
                          : "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800"
                      }
                      alt={room.name}
                    />

                    <div className="room-overlay">
                      <Link
                        to={`/rooms/${room._id}`}
                        className="view-room-btn"
                      >
                        View Room
                      </Link>
                    </div>

                    <div className="room-badge">{room.roomType}</div>
                  </div>

                  {/* ROOM INFO */}
                  <div className="room-info">

                    <div className="room-meta">
                      <div className="room-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < Math.round(room.rating || 0) ? "#c9a84c" : "#ddd"}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="room-name">{room.name}</h3>

                    <p className="room-desc">
                      {room.description
                        ? room.description.substring(0, 90)
                        : "Luxury accommodation"}
                      ...
                    </p>

                    <div className="room-features">
                      <span>{room.capacity} Guests</span>
                      <span>{room.size} sq ft</span>
                    </div>

                    <div className="room-footer">
                      <div className="room-price">
                        <span className="price-from">From</span>
                        <span className="price">
                          ₹{room.price?.toLocaleString()}
                        </span>
                        <span className="price-per">/night</span>
                      </div>

                      <Link
                        to={`/rooms/${room._id}`}
                        className="btn-book"
                      >
                        Book
                      </Link>
                    </div>

                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="section-cta">
            <Link to="/rooms" className="btn-luxury">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;