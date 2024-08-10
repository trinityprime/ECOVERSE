import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext'; // Import UserContext to access user data

function EditEvent() {
    const { id } = useParams();
    const [event, setEvent] = useState({
        eventName: "",
        eventPax: "",
        eventAddress: "",
        eventDate: "",
        eventDescription: ""
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Get user data from UserContext

    useEffect(() => {
        http.get(`/userEvent/${id}`).then((res) => {
            console.log(res.data);
            setEvent(res.data);
            setLoading(false);
        });
    }, [id]);

    const formik = useFormik({
        initialValues: event,
        enableReinitialize: true,
        validationSchema: yup.object({
            eventName: yup.string().trim()
                .min(3, 'Event Name must be at least 3 characters')
                .max(100, 'Event Name must be at most 100 characters')
                .required('Event Name is required'),
            eventPax: yup.number()
                .min(1, 'Number of Participants must be at least 1')
                .required('Number of Participants is required'),
            eventAddress: yup.string().trim()
                .min(3, 'Event Address must be at least 3 characters')
                .max(100, 'Event Address must be at most 100 characters')
                .required('Event Address is required'),
            eventDate: yup.date()
                .typeError('Incorrect format for Event Date')
                .min(new Date(2024, 0, 1), 'Event Date must be in the year 2024 or later')
                .max(new Date(2099, 11, 31), 'Event Date must be in the year 2099 or earlier')
                .required('Event Date is required'),
            eventDescription: yup.string().trim()
                .min(3, 'Event Description must be at least 3 characters')
                .max(500, 'Event Description must be at most 500 characters')
                .required('Event Description is required')
        }),
        onSubmit: (data) => {
            data.eventName = data.eventName.trim();
            data.eventDescription = data.eventDescription.trim();
            http.put(`/userEvent/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/UserEvent");
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
    const deleteEvent = () => {
        http.delete(`/userEvent/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/userEvent");
            });
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Event
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event Name"
                            name="eventName"
                            value={formik.values.eventName}
                            onChange={formik.handleChange}
                            error={formik.touched.eventName && Boolean(formik.errors.eventName)}
                            helperText={formik.touched.eventName && formik.errors.eventName}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Number of Participants"
                            name="eventPax"
                            type="number"
                            value={formik.values.eventPax}
                            onChange={formik.handleChange}
                            error={formik.touched.eventPax && Boolean(formik.errors.eventPax)}
                            helperText={formik.touched.eventPax && formik.errors.eventPax}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event Address"
                            name="eventAddress"
                            value={formik.values.eventAddress}
                            onChange={formik.handleChange}
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
                            error={formik.touched.eventDate && Boolean(formik.errors.eventDate)}
                            helperText={formik.touched.eventDate && formik.errors.eventDate}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Event Description"
                            name="eventDescription"
                            value={formik.values.eventDescription}
                            onChange={formik.handleChange}
                            error={formik.touched.eventDescription && Boolean(formik.errors.eventDescription)}
                            helperText={formik.touched.eventDescription && formik.errors.eventDescription}
                        />
                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                                Delete
                            </Button>
                            {user.role === 'admin' && ( // Conditionally render the Approve button
                                <Button variant="contained" sx={{ ml: 2 }} color="success">
                                    <Link
                                        to={`/AddEvent?eventName=${encodeURIComponent(event.eventName)}&maxParticipants=${encodeURIComponent(event.maxParticipants)}&eventDate=${encodeURIComponent(event.eventDate)}&eventDescription=${encodeURIComponent(event.eventDescription)}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        Approve
                                    </Link>
                                </Button>
                            )}
                        </Box>
                    </Box>
                )
            }
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Event
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteEvent}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditEvent;
