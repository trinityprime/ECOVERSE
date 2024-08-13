import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../http'; // Adjust the import based on your file structure

const RequestOtp = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    try {
      await http.post('/otp/request', { email });
      navigate('/verify-otp'); 
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Request OTP</Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button onClick={handleRequestOtp} variant="contained" color="primary">
        Request OTP
      </Button>
    </Container>
  );
};

export default RequestOtp;
