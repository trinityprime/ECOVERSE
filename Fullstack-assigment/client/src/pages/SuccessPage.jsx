import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SuccessPage() {
    const navigate = useNavigate();

    return (
        <Box textAlign="center" mt={4}>
            <Typography variant="h4" gutterBottom>
                Event Submitted Successfully!
            </Typography>
            <Typography variant="body1" mb={4}>
                Thank you for your submission. Our team will review your course/event.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                Return to Home
            </Button>
        </Box>
    );
}

export default SuccessPage;
