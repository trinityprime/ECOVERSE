import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputMask from 'react-input-mask';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import dayjs from 'dayjs';
import http from '../http';

function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const checkEmailExists = async (email) => {
        try {
            const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            return result.exists; 
        } catch (error) {
            console.error('Error checking email:', error);
            return false; 
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            dob: "",
            role: "",
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required')
                .matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
            phoneNumber: yup.string().trim()
                .required('Phone number is required')
                .matches(/^\d{8}$/, "Phone number must be 8 digits"),
            dob: yup.string().trim()
                .required("Date of birth is required")
                .matches(/^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Invalid date format (dd/mm/yyyy)'),
            role: yup.string()
                .required('Role is required')
                .notOneOf([''], 'Please select a role')
        }),
        onSubmit: async (values) => {
            try {
                const data = {
                    name: values.name.trim(),
                    email: values.email.trim().toLowerCase(),
                    password: values.password.trim(),
                    phoneNumber: values.phoneNumber.replace(/\s/g, ''),
                    dob: dayjs(values.dob, 'DD/MM/YYYY').toISOString(),
                    role: values.role,
                };
                const response = await http.post("/user/register", data);
                toast.success(response.data.message);
                console.log(response.data);
                navigate("/login");
            } catch (err) {
                toast.error(err.response.data.message || 'Registration failed');
            }
        }
    });

    const handlePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Register
            </Typography>

            <Box component="form" sx={{ maxWidth: '500px' }} onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />

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
                    name="password" type={showPassword ? 'text' : 'password'}
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

                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Confirm Password"
                    name="confirmPassword" type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />

                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Phone Number"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />

                <InputMask
                    mask="99/99/9999"
                    value={formik.values.dob}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    {() => (
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Date of Birth (dd/mm/yyyy)"
                            name="dob"
                            error={formik.touched.dob && Boolean(formik.errors.dob)}
                            helperText={formik.touched.dob && formik.errors.dob}
                        />
                    )}
                </InputMask>

                <FormControl fullWidth sx={{ my: 1 }} error={formik.touched.role && Boolean(formik.errors.role)}>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Role"
                    >
                        <MenuItem value="">Select role</MenuItem>
                        <MenuItem value="volunteer">Volunteer</MenuItem>
                        <MenuItem value="organization">Organization</MenuItem>
                    </Select>
                    {formik.touched.role && formik.errors.role && (
                        <Typography color="error" variant="body2">
                            {formik.errors.role}
                        </Typography>
                    )}
                </FormControl>

                <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
                    Register
                </Button>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default Register;
