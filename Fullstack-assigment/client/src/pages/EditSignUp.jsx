import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';

function EditSignUp() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [signUp, setSignUp] = useState({
        Name: "",
        MobileNumber: "",
        Email: "",
        numberOfPax: "",
        specialRequirements: "",
        eventCourseName: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/signup/${id}`).then((res) => {
            setSignUp(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: signUp,
        enableReinitialize: true,
        validationSchema: yup.object({
            Name: yup.string().trim()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name must be at most 100 characters')
                .required('Name is required'),
            MobileNumber: yup.number()
                .required('Mobile number is required'),
            Email: yup.string().email('Invalid email address')
                .required('Email is required'),
            numberOfPax: yup.number()
                .min(1, 'Number of participants must be at least 1')
                .required('Number of participants is required'),
            specialRequirements: yup.string().trim()
                .max(500, 'Special requirements must be at most 500 characters'),
            eventCourseName: yup.string().trim()
                .min(3, 'Event/Course name must be at least 3 characters')
                .max(100, 'Event/Course name must be at most 100 characters')
                .required('Event/Course name is required')
        }),
        onSubmit: (data) => {
            data.Name = data.Name.trim();
            data.specialRequirements = data.specialRequirements.trim();
            data.eventCourseName = data.eventCourseName.trim();
            http.put(`/signup/${id}`, data)
                .then((res) => {
                    navigate("/signups");
                });
        }
    });

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteSignUp = () => {
        http.delete(`/signup/${id}`)
            .then((res) => {
                navigate("/signups");
            });
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Sign Up
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Name"
                            name="Name"
                            value={formik.values.Name}
                            onChange={formik.handleChange}
                            error={formik.touched.Name && Boolean(formik.errors.Name)}
                            helperText={formik.touched.Name && formik.errors.Name}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Mobile Number"
                            name="MobileNumber"
                            type="number"
                            value={formik.values.MobileNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.MobileNumber && Boolean(formik.errors.MobileNumber)}
                            helperText={formik.touched.MobileNumber && formik.errors.MobileNumber}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Email"
                            name="Email"
                            type="email"
                            value={formik.values.Email}
                            onChange={formik.handleChange}
                            error={formik.touched.Email && Boolean(formik.errors.Email)}
                            helperText={formik.touched.Email && formik.errors.Email}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Number of Pax"
                            name="numberOfPax"
                            type="number"
                            value={formik.values.numberOfPax}
                            onChange={formik.handleChange}
                            error={formik.touched.numberOfPax && Boolean(formik.errors.numberOfPax)}
                            helperText={formik.touched.numberOfPax && formik.errors.numberOfPax}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Special Requirements"
                            name="specialRequirements"
                            value={formik.values.specialRequirements}
                            onChange={formik.handleChange}
                            error={formik.touched.specialRequirements && Boolean(formik.errors.specialRequirements)}
                            helperText={formik.touched.specialRequirements && formik.errors.specialRequirements}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event/Course Name"
                            name="eventCourseName"
                            value={formik.values.eventCourseName}
                            onChange={formik.handleChange}
                            error={formik.touched.eventCourseName && Boolean(formik.errors.eventCourseName)}
                            helperText={formik.touched.eventCourseName && formik.errors.eventCourseName}
                            disabled // Add this prop to disable the field
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
                )
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Sign Up
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this sign up?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteSignUp}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EditSignUp;
