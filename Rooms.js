import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Rooms.css';

const Rooms = () => {

  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     ⭐ 30 UNIQUE LUXURY ROOMS
  ================================= */

  useEffect(() => {

    const defaultRooms = [
      { _id:"1", name:"Royal Deluxe Room", price:12000, images:["https://images.unsplash.com/photo-1566665797739-1674de7a421a"] },
      { _id:"2", name:"Executive Suite", price:18000, images:["https://images.unsplash.com/photo-1582719508461-905c673771fd"] },
      { _id:"3", name:"Presidential Suite", price:45000, images:["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"] },
      { _id:"4", name:"Family Comfort Room", price:15000, images:["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"] },
      { _id:"5", name:"Classic Single Room", price:7000, images:["https://images.unsplash.com/photo-1560185127-6ed189bf02f4"] },
      { _id:"6", name:"Ocean View Suite", price:22000, images:["https://images.unsplash.com/photo-1571896349842"] },
      { _id:"7", name:"Luxury Twin Room", price:10000, images:["https://images.unsplash.com/photo-1631049307264"] },
      { _id:"8", name:"Grand Ballroom Suite", price:30000, images:["https://images.unsplash.com/photo-1519167758481"] },
      { _id:"9", name:"Garden View Room", price:13000, images:["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"] },
      { _id:"10", name:"Honeymoon Special Suite", price:26000, images:["https://images.unsplash.com/photo-1505691938895-1758d7feb511"] },

      { _id:"11", name:"Business Executive Room", price:14000, images:["https://images.unsplash.com/photo-1524758631624-e2822e304c36"] },
      { _id:"12", name:"Skyline Penthouse", price:50000, images:["https://images.unsplash.com/photo-1590490360182-c33d57733427"] },
      { _id:"13", name:"Minimal Modern Room", price:8000, images:["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"] },
      { _id:"14", name:"Royal Heritage Suite", price:32000, images:["https://images.unsplash.com/photo-1560448075-bb4caa6b3a4a"] },
      { _id:"15", name:"Luxury Pool Villa", price:60000, images:["https://images.unsplash.com/photo-1600585154340-be6161a56a0c"] },

      { _id:"16", name:"Luxury Garden Suite", price:21000, images:["https://images.unsplash.com/photo-1554995207-c18c203602cb"] },
      { _id:"17", name:"Elite Executive Room", price:14500, images:["https://images.unsplash.com/photo-1540518614846-7eded433c457"] },
      { _id:"18", name:"Royal Heritage Room", price:16000, images:["https://images.unsplash.com/photo-1507089947368-19c1da9775ae"] },
      { _id:"19", name:"Sky Lounge Suite", price:27000, images:["https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf"] },
      { _id:"20", name:"Minimal Zen Room", price:8500, images:["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"] },

      { _id:"21", name:"Grand Family Suite", price:22000, images:["https://images.unsplash.com/photo-1615873968403-89e068629265"] },
      { _id:"22", name:"Golden Palace Suite", price:52000, images:["https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f"] },
      { _id:"23", name:"Ocean Breeze Room", price:13500, images:["https://images.unsplash.com/photo-1560448075-57d0285fc9b4"] },
      { _id:"24", name:"Luxury Spa Suite", price:28000, images:["https://images.unsplash.com/photo-1549298916-b41d501d3772"] },
      { _id:"25", name:"Business Elite Suite", price:24000, images:["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"] },

      { _id:"26", name:"Urban Chic Room", price:10500, images:["https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a"] },
      { _id:"27", name:"Sunset Terrace Suite", price:29000, images:["https://images.unsplash.com/photo-1582582494700-97c1d3bfb60c"] },
      { _id:"28", name:"Premium King Room", price:15500, images:["https://images.unsplash.com/photo-1600210492493-0946911123ea"] },
      { _id:"29", name:"Signature Royal Suite", price:58000, images:["https://images.unsplash.com/photo-1560448075-cc3c1c1a2a44"] },
      { _id:"30", name:"Cozy Classic Double", price:9500, images:["https://images.unsplash.com/photo-1540518614846-7eded433c457"] }
    ];
     
    /* ⭐ SAVE TO LOCAL STORAGE FOR VIEW DETAILS PAGE */
    localStorage.setItem("roomsData", JSON.stringify(defaultRooms));

    setFilteredRooms(defaultRooms);
    setLoading(false);

  }, []);

  /* ===============================
     UI
  ================================= */

  return (
    <div className="rooms-page">
      <div className="container-luxury section-padding">

        {loading ? (
          <div>Loading Rooms...</div>
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map((room,index)=>(
              <motion.div
                key={room._id}
                className="room-card card-luxury"
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{duration:0.4,delay:index*0.05}}
              >
                <div className="room-image">
                  <img src={room.images[0]} alt={room.name}/>
                </div>

                <div className="room-content">
                  <h3>{room.name}</h3>
                  <p className="room-price">₹{room.price.toLocaleString()} / night</p>

                  {/* ⭐ VIEW DETAILS FIXED */}
                  <Link to={`/rooms/${room._id}`} className="btn-view">
                    View Details
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

export default Rooms;