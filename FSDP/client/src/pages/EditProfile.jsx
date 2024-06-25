import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function EditProfile() {
    const { id } = useParams(); // Assuming you have a user ID for editing
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        dob: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/user/${id}`)
            .then((res) => {
                setUser(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user:', error);
            });
    }, [id]);

    const formik = useFormik({
        initialValues: user,
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().trim().required('Name is required'),
            email: yup.string().email('Invalid email format').required('Email is required'),
            phoneNumber: yup.string().trim().required('Phone number is required'),
            dob: yup.string().trim().required('Date of birth is required'),
        }),
        onSubmit: (values) => {
            http.put(`/user/${id}`, values)
                .then((res) => {
                    console.log('Profile updated successfully:', res.data);
                    navigate('/profile'); 
                })
                .catch((error) => {
                    console.error('Error updating profile:', error);
                });
        },
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteUser = () => {
        http.delete(`/user/${id}`)
            .then((res) => {
                console.log('User deleted successfully:', res.data);
                navigate('/login'); 
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Profile
            </Typography>
            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
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
                        label="Phone Number"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    />
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Date of Birth"
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dob && Boolean(formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                        <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Profile</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your profile?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteUser}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditProfile;
