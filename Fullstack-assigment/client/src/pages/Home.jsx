import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Example images array
const images = [
  'https://via.placeholder.com/600x400?text=Image+1',
  'https://via.placeholder.com/600x400?text=Image+2',
  'https://via.placeholder.com/600x400?text=Image+3',
  'https://via.placeholder.com/600x400?text=Image+4',
  'https://via.placeholder.com/600x400?text=Image+5',
  'https://via.placeholder.com/600x400?text=Image+6',
  'https://via.placeholder.com/600x400?text=Image+7',
  'https://via.placeholder.com/600x400?text=Image+8',
  'https://via.placeholder.com/600x400?text=Image+9',
  'https://via.placeholder.com/600x400?text=Image+10'
];

const styles = {
  carouselContainer: {
    position: 'relative',
    width: '80%',
    maxWidth: '1200px',
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px', // Space between hero and carousel
  },
  carouselImages: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
  },
  carouselItem: {
    minWidth: '50%',
    boxSizing: 'border-box',
  },
  carouselItemImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    zIndex: 10,
    borderRadius: '50%',
    transform: 'translateY(-50%)',
  },
  buttonLeft: {
    left: '10px',
  },
  buttonRight: {
    right: '10px',
  },
  heroContainer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2em',
    margin: '0.5em 0',
  },
  description: {
    fontSize: '1.2em',
    margin: '0.5em 0',
  },
  exploreButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

function Home() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);

  const imagesPerPage = 2;
  const totalPages = Math.ceil(images.length / imagesPerPage);

  const handlePrev = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages - 1 ? prevPage + 1 : 0));
  };

  const startIndex = currentPage * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

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
        <button style={{ ...styles.carouselButton, ...styles.buttonLeft }} onClick={handlePrev}>◀</button>
        <button style={{ ...styles.carouselButton, ...styles.buttonRight }} onClick={handleNext}>▶</button>
      </div>
    </>
  );
}

export default Home;
