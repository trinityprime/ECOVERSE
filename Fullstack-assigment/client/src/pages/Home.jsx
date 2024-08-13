import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Example images array
const images = [
  'https://via.placeholder.com/400x300?text=Image+1',
  'https://via.placeholder.com/400x300?text=Image+2',
  'https://via.placeholder.com/400x300?text=Image+3',
  'https://via.placeholder.com/400x300?text=Image+4',
  'https://via.placeholder.com/400x300?text=Image+5',
  'https://via.placeholder.com/400x300?text=Image+6',
  'https://via.placeholder.com/400x300?text=Image+7',
  'https://via.placeholder.com/400x300?text=Image+8',
  'https://via.placeholder.com/400x300?text=Image+9',
  'https://via.placeholder.com/400x300?text=Image+10'
];

const styles = {
  carouselContainer: {
    position: 'relative',
    width: '60%',  // Adjusted width
    maxWidth: '800px',  // Adjusted max-width
    margin: '20px auto',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    backgroundColor: '#f5f5dc', // Beige color
  },
  carouselImages: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
  },
  carouselItem: {
    minWidth: '100%', // Adjusted to show one image at a time
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
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
  carouselHeading: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
  },
};

function Home() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const imagesPerPage = 2;
  const totalImages = images.length;
  const totalPages = Math.ceil(totalImages / imagesPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage(prevPage => {
        let newPage = prevPage + direction;
        if (newPage >= totalPages) {
          newPage = totalPages - 1;
          setDirection(-1);
        } else if (newPage < 0) {
          newPage = 0;
          setDirection(1);
        }
        return newPage;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [direction, totalPages]);

  const startIndex = currentPage * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  return (
    <>
      {location.pathname === '/' && (<div className='hero-container'> <div className="text-container"> <h1 className="title">Welcome to EcoVerse</h1> <p className="description">Empowering our community with sustainable living practices.</p> <p>Click here to find out more!</p> <Link to="/AboutUs" style={{ textDecoration: 'none', color: 'inherit' }}> <button className="explore-button">About Us</button> </Link> </div> </div>)}
      <div style={styles.carouselContainer}>
        <div style={styles.carouselHeading}>Recent Events and Courses</div>
        <div style={{ ...styles.carouselImages, transform: `translateX(-${currentPage * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} style={styles.carouselItem}>
              <img src={image} alt={`Slide ${index + 1}`} style={styles.carouselItemImage} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
