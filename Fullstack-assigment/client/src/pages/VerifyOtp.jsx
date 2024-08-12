import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../http'; 
const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    try {
      await http.post('/otp/verify', { otp, email });
      navigate('/reset-password'); 
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Verify OTP</Typography>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button onClick={handleVerifyOtp} variant="contained" color="primary">
        Verify OTP
      </Button>
    </Container>
  );
};

export default VerifyOtp;
