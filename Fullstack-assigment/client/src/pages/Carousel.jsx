import React, { useContext, useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import Carousel from 'react-material-ui-carousel'; // Make sure you have installed this package
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext'; // Adjust the import path if necessary

const carouselItems = [
  {
    imageFile: 'path-to-your-image1.jpg', // Replace with actual image path
    alt: 'Event/Course 1',
  },
  {
    imageFile: 'path-to-your-image2.jpg', // Replace with actual image path
    alt: 'Event/Course 2',
  },
  // Add more items as needed
];

function CustomCarousel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleViewAllClick = () => {
    if (user) {
      navigate('/Events'); // Redirect to Events page if logged in
    } else {
      setOpenSnackbar(true); // Show the snackbar if not logged in
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5dc', // Dark beige background
        padding: '60px',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Recent Events and Courses
      </Typography>
      <Carousel
        navButtonsAlwaysVisible
        indicators={true}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {carouselItems.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '20px',
            }}
          >
            <img src={item.imageFile} alt={item.alt} style={{ width: '100%', height: 'auto' }} />
          </Box>
        ))}
      </Carousel>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: '20px' }}
        onClick={handleViewAllClick}
      >
        View All Events and Courses
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          Please log in first to have access and view all events and courses.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CustomCarousel;
