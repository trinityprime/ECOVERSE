import React, { useState } from 'react';

const RequestOtp = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      

      if (response.ok) {
        setMessage('OTP has been sent to your email.');
      } else {
        setMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Request OTP</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button onClick={handleRequestOtp} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Request OTP'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RequestOtp;
