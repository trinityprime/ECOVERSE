import React, { useEffect,useContext } from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import UserContext from '../contexts/UserContext';
function AddSignUp() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eventName = queryParams.get('eventName') || "";

    const formik = useFormik({
        initialValues: {
            Name: user ? user.name : "",
            MobileNumber: user ? user.phoneNumber:"",
            Email: user ? user.email : "",
            numberOfPax: "",
            specialRequirements: "",
            eventCourseName: eventName,
            agreeTerms: false
        },
        validationSchema: yup.object({
            Name: yup.string().trim().min(3, 'Must be at least 3 characters').max(100, 'Must be 100 characters or less').required('Name is required'),
            MobileNumber: yup.number().required('Mobile number is required'),
            Email: yup.string().email('Invalid email address').required('Email is required'),
            numberOfPax: yup.number().min(1, 'Must be at least 1').required('Number of participants is required'),
            specialRequirements: yup.string().trim().max(500, 'Must be 500 characters or less'),
            eventCourseName: yup.string().trim().min(3, 'Must be at least 3 characters').max(100, 'Must be 100 characters or less').required('Event/Course name is required'),
            agreeTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('You must accept the terms and conditions')
        }),
        onSubmit: (data) => {
            data.Name = data.Name.trim();
            data.specialRequirements = data.specialRequirements.trim();
            data.eventCourseName = data.eventCourseName.trim();
            http.post("/signup", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/success");
                });
        }
    });

    return (
        <Box display="flex" justifyContent="space-between" p={4}>
            <Box width="40%">
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Sign up for an event or course. Our team will review your registration.
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="agreeTerms"
                                checked={formik.values.agreeTerms}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                color="primary"
                            />
                        }
                        label="I have read and agree to the Terms of Service and Privacy Policy."
                    />
                </Box>
                <Button
                    variant="contained"
                    type="submit"
                    onClick={formik.handleSubmit}
                    sx={{ mt: 2, backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
                >
                    Submit
                </Button>
            </Box>
            <Box width="50%">
                <Box component="form">
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Event Name"
                        name="eventName"
                        value={formik.values.eventCourseName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventCourseName && Boolean(formik.errors.eventCourseName)}
                        helperText={formik.touched.eventCourseName && formik.errors.eventCourseName}
                        InputProps={{
                            readOnly: true
                        }}

                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Name"
                        name="Name"
                        value={formik.values.Name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
                        error={formik.touched.numberOfPax && Boolean(formik.errors.numberOfPax)}
                        helperText={formik.touched.numberOfPax && formik.errors.numberOfPax}
                    />
                    <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                        *Please specify any special requirements or needs for the event/course:
                    </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        multiline
                        minRows={5}
                        label="Special Requirements"
                        name="specialRequirements"
                        value={formik.values.specialRequirements}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.specialRequirements && Boolean(formik.errors.specialRequirements)}
                        helperText={formik.touched.specialRequirements && formik.errors.specialRequirements}
                    />

                </Box>
            </Box>
        </Box>
    );
}

export default AddSignUp;
