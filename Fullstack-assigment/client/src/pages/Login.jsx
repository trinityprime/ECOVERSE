import React, { useContext, useState } from 'react';
import { Box, Typography, TextField, Button, Link, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().trim()
        .email('Enter a valid email')
        .max(50, 'Email must be at most 50 characters')
        .required('Email is required'),
      password: yup.string().trim()
        .min(8, 'Password must be at least 8 characters')
        .max(50, 'Password must be at most 50 characters')
        .required('Password is required')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "Password must contain at least 1 letter and 1 number"),
    }),
    
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();

      http.post("/user/login", data)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);

          if (res.data.user.status === 'deactivated') {
            toast.error("Your account is deactivated.");
            return; // Prevent further code execution
          }

          const userRole = res.data.user.role;
          if (userRole === 'admin') {
            navigate("/AdminECManagement");
          } else if (userRole === 'volunteer' || userRole === 'organization') {
            navigate("/profile");
          } else {
            console.error('Unknown user role:', userRole);
            navigate("/default");
          }
        })
        .catch((err) => {
          console.error('Login error: Account is deactivated!'); 
          const errorMessage = err.response?.data?.message || 'Login failed';
          toast.error(errorMessage);
        });
    },
  });

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Login
      </Typography>
      <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth margin="dense" autoComplete="off"
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handlePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }}
          type="submit">
          Login
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body3">
            Don't have an account? <Link href="/register">Register here</Link>
          </Typography>
          <br></br>
          <Typography variant="body3">
            Forgot your password? <Link href="/request-otp">Reset it here</Link>
          </Typography>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  )
}

export default Login;