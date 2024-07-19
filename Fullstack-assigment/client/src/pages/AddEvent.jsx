import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddEvent() {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    // Define options for location and event type
    const locationOptions = [
        { value: "North East", label: "North East" },
        { value: "North", label: "North" },
        { value: "East", label: "East" },
        { value: "West", label: "West" },
        { value: "Central", label: "Central" },
    ];

    const eventTypeOptions = [
        { value: "Workshop", label: "Workshop" },
        { value: "Conference", label: "Conference" },
        { value: "Sports Event", label: "Sports Event" },
        { value: "Eco-Marketplace", label: "Eco-Marketplace" },
        { value: "Exhibition", label: "Exhibition" },
        { value: "Volunteering", label: "Volunteering" },
        { value: "Charity Event", label: "Charity Event" },
        { value: "Social Event", label: "Social Event" },
        { value: "Seminar", label: "Seminar" },
        { value: "Sustainability Festival", label: "Sustainability Festival" },
        { value: "Others", label: "Other" },
    ];


    const formik = useFormik({
        initialValues: {
            eventName: '',
            eventType: '',
            eventDescription: '',
            eventDate: '',
            eventTimeFrom: '',
            eventTimeTo: '',
            location: '',
            maxParticipants: '',
            organizerDetails: '',
            termsAndConditions: '',
            eventStatus: ''
        },
        validationSchema: yup.object({
            eventName: yup.string().trim()
                .min(3, 'Event Name must be at least 3 characters')
                .max(100, 'Event Name must be at most 100 characters')
                .required('Event Name is required'),
            eventType: yup.string().trim()
                .min(3, 'Event Type must be at least 3 characters')
                .max(50, 'Event Type must be at most 50 characters')
                .required('Event Type is required'),
            eventDescription: yup.string().trim()
                .test(
                    'min-words',
                    'Event Description must be at least 5 words',
                    value => value && value.split(' ').filter(word => word.length > 0).length >= 5
                )
                .max(500, 'Event Description must be at most 500 characters')
                .required('Event Description is required'),
            eventStartDate: yup.date()
                .typeError('Incorrect format for Event Date')
                .min(new Date(2024, 0, 1), 'Event Date must be in the year 2024 or later')
                .max(new Date(2099, 11, 31), 'Event Date must be in the year 2099 or earlier')
                .required('Event Date is required'),
            eventTimeFrom: yup.string().trim()
                .required('Start Time is required'),
            eventTimeTo: yup.string().trim()
                .required('End Time is required'),
            location: yup.string().trim()
                .required('Location is required!'),
            maxParticipants: yup.number()
                .integer('Max Participants must be an integer')
                .positive('Max Participants must be positive')
                .required('Max Participants is required'),
            organizerDetails: yup.string().trim()
                .min(3, 'Organizer Details must be at least 3 characters')
                .max(500, 'Organizer Details must be at most 500 characters')
                .required('Organizer Details are required'),
            termsAndConditions: yup.string().trim()
                .min(3, 'Terms and Conditions must be at least 3 characters')
                .max(1000, 'Terms and Conditions must be at most 1000 characters')
                .required('Terms and Conditions are required'),
            eventStatus: yup.string().trim()
                .required('Event Status is required!')
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }
            data.eventName = data.eventName.trim();
            data.eventType = data.eventType.trim();
            data.eventDescription = data.eventDescription.trim();
            data.location = data.location.trim();
            data.organizerDetails = data.organizerDetails.trim();
            data.termsAndConditions = data.termsAndConditions.trim();

            http.post("/event", data)
                .then((res) => {
                    console.log(res.data);
                    toast.success('Event created successfully!');
                    setTimeout(() => {
                        navigate('/AdminECManagement');
                    }, 1400);
                })
                .catch((error) => {
                    console.error('Error creating event:', error);
                    toast.error('Failed to create event. Please try again later.');
                });
        }
    });

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);

            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    toast.error('Failed to upload file. Please try again later.');
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Event
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Event Name"
                            name="eventName"
                            value={formik.values.eventName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventName && Boolean(formik.errors.eventName)}
                            helperText={formik.touched.eventName && formik.errors.eventName}
                        />

                        <FormControl fullWidth margin="dense">
                            <InputLabel id="eventType-label">Event Type</InputLabel>
                            <Select
                                labelId="eventType-label"
                                id="eventType"
                                name="eventType"
                                value={formik.values.eventType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventType && Boolean(formik.errors.eventType)}
                                label="Event Type"
                            >
                                <MenuItem value="">Select Event Type</MenuItem>
                                {eventTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.touched.eventType && formik.errors.eventType && (
                                <Typography variant="caption" color="error">
                                    {formik.errors.eventType}
                                </Typography>
                            )}
                        </FormControl>


                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Event Description"
                            name="eventDescription"
                            value={formik.values.eventDescription}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                            helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            type="date"
                            label="Event Date"
                            name="eventDate"
                            value={formik.values.eventDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                            helperText={formik.touched.eventDate && formik.errors.eventDate}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            type="time"
                            label="Start Time"
                            name="eventTimeFrom"
                            value={formik.values.eventTimeFrom}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventTimeFrom && Boolean(formik.errors.eventTimeFrom)}
                            helperText={formik.touched.eventTimeFrom && formik.errors.eventTimeFrom}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            type="time"
                            label="End Time"
                            name="eventTimeTo"
                            value={formik.values.eventTimeTo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.eventTimeTo && Boolean(formik.errors.eventTimeTo)}
                            helperText={formik.touched.eventTimeTo && formik.errors.eventTimeTo}
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="location-label">Location</InputLabel>
                            <Select
                                labelId="location-label"
                                id="location"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                label="Location"
                            >
                                <MenuItem value="">Select Location</MenuItem>
                                {locationOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            type="number"
                            label="Max Participants"
                            name="maxParticipants"
                            value={formik.values.maxParticipants}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.maxParticipants && Boolean(formik.errors.maxParticipants)}
                            helperText={formik.touched.maxParticipants && formik.errors.maxParticipants}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Organizer Details"
                            name="organizerDetails"
                            value={formik.values.organizerDetails}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.organizerDetails && Boolean(formik.errors.organizerDetails)}
                            helperText={formik.touched.organizerDetails && formik.errors.organizerDetails}
                        />
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            multiline minRows={2}
                            label="Terms and Conditions"
                            name="termsAndConditions"
                            value={formik.values.termsAndConditions}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.termsAndConditions && Boolean(formik.errors.termsAndConditions)}
                            helperText={formik.touched.termsAndConditions && formik.errors.termsAndConditions}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="event-status-label">Event Status</InputLabel>
                            <Select
                                labelId="event-status-label"
                                id="event-status"
                                name="eventStatus"
                                value={formik.values.eventStatus}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.eventStatus && Boolean(formik.errors.eventStatus)}
                                label="Event Status"
                            >
                                <MenuItem value="">Select Event Status</MenuItem>
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Scheduled">Scheduled</MenuItem>
                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                                <MenuItem value="Postponed">Postponed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                            </Button>
                            {imageFile && (
                                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                    <img alt="event" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add Event
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default AddEvent;