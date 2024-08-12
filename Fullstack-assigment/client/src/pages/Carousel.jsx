import React, { useContext, useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import Carousel from 'react-material-ui-carousel'; // Make sure you have installed this package
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext'; // Adjust the import path if necessary

// Generate 7 random carousel items
const carouselItems = Array.from({ length: 7 }, (_, index) => ({
  imageFile: `https://picsum.photos/800/400?random=${index + 1}`, // Placeholder images
  alt: `Event/Course ${index + 1}`,
}));

function CustomCarousel() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false); // Track if events section is open
  const [isCoursesOpen, setIsCoursesOpen] = useState(false); // Track if courses section is open

  const handleViewAllEventsClick = () => {
    if (isEventsOpen) {
      navigate('/'); // Navigate to home or another page
    } else {
      navigate('/Events'); // Navigate to Events page
    }
    setIsEventsOpen(!isEventsOpen); // Toggle the state
  };

  const handleViewAllCoursesClick = () => {
    if (isCoursesOpen) {
      navigate('/'); // Navigate to home or another page
    } else {
      navigate('/Courses'); // Navigate to Courses page
    }
    setIsCoursesOpen(!isCoursesOpen); // Toggle the state
  };

  const handleRegisterClick = () => {
    if (user) {
      // Proceed with registration
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
            <img src={item.imageFile} alt={item.alt} />
          </Box>
        ))}
      </Carousel>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewAllEventsClick}
        >
          {isEventsOpen ? 'Close Events' : 'View All Events'}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleViewAllCoursesClick}
        >
          {isCoursesOpen ? 'Close Courses' : 'View All Courses'}
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          Please log in first to register for events and courses.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CustomCarousel;
