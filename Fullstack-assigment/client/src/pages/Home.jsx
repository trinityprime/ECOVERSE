import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';
function Home() {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' && (
        <div className='hero-container'>
          <div className="text-container">
            <h1 className="title">Welcome to EcoVerse</h1>
            <p className="description">Empowering our community with sustainable living practices.</p>
            <p>Click here to find out more!</p>
            <Link to="/AboutUs" style={{ textDecoration: 'none', color: 'inherit' }}>
              <button className="explore-button">About Us</button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;

