import React from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddEvent() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            eventName: "",
            eventPax: "",
            eventAddress: "",
            eventDate: "",
            eventDescription: "",
            agreeTerms: false
        },
        validationSchema: yup.object({
            eventName: yup.string().trim().min(3, 'Must be at least 3 characters').max(100, 'Must be 100 characters or less').required('Event name is required'),
            eventPax: yup.number().min(1, 'Must be at least 1').required('Number of participants is required'),
            eventAddress: yup.string().trim().min(3, 'Must be at least 3 characters').max(100, 'Must be 100 characters or less').required('Event address is required'),
            eventDate: yup.date().required('Event date is required'),
            eventDescription: yup.string().trim().min(3, 'Must be at least 3 characters').max(500, 'Must be 500 characters or less').required('Event description is required'),
            agreeTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('You must accept the terms and conditions')
        }),
        onSubmit: (data) => {
            data.eventName = data.eventName.trim();
            data.eventDescription = data.eventDescription.trim();
            http.post("/userEvent", data)
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
                    Suggest an event of your interest. Our team will view your ideas.
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
                    Submit event
                </Button>
            </Box>
            <Box width="50%">
                <Box component="form">
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Event name"
                        name="eventName"
                        value={formik.values.eventName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventName && Boolean(formik.errors.eventName)}
                        helperText={formik.touched.eventName && formik.errors.eventName}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Event Pax"
                        name="eventPax"
                        type="number"
                        value={formik.values.eventPax}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventPax && Boolean(formik.errors.eventPax)}
                        helperText={formik.touched.eventPax && formik.errors.eventPax}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Event address"
                        name="eventAddress"
                        value={formik.values.eventAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventAddress && Boolean(formik.errors.eventAddress)}
                        helperText={formik.touched.eventAddress && formik.errors.eventAddress}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Event Date"
                        name="eventDate"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={formik.values.eventDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                        helperText={formik.touched.eventDate && formik.errors.eventDate}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        multiline
                        minRows={2}
                        label="Event description"
                        name="eventDescription"
                        value={formik.values.eventDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                        helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default AddEvent;
