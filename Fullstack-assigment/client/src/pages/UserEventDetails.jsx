import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid, Snackbar, Alert, Button } from "@mui/material";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext"; // Adjust the import path if necessary
import headerImage from '../assets/ContactUs.jpeg'; // Adjust the path if needed

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext); // Get user from UserContext
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/event/${id}`);
                if (response.status === 200) {
                    setEvent(response.data); // Assuming response.data includes 'participants'
                    setLoading(false);
                } else {
                    setError("Failed to fetch event details");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
                setError("Failed to fetch event details");
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleSignUpClick = () => {
        if (user) {
            navigate(`/AddSignUpEvent?eventName=${encodeURIComponent(event.eventName)}`);
        } else {
            setOpenSnackbar(true); // Show snackbar if not logged in
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (loading) {
        return <p>Loading event details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Box>
            {/* Header Section */}
            <Box
                sx={{
                    width: "100%",
                    height: "200px",
                    backgroundImage: `url(${headerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mb: 2,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1
                    }}
                />
                <Typography
                    variant="h5"
                    align="center"
                    color="white"
                    sx={{ zIndex: 2 }}
                >
                    Event Details, ID: {id}
                </Typography>
            </Box>

            <Box sx={{ mx: "auto", p: 3, maxWidth: "900px" }}> {/* Centering content with auto margins */}
                <ToastContainer />
                {event && (
                    <Box sx={{ p: 2, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff" }}> {/* Added card-like style */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>  {/* Image on the left, taking up half the width on medium screens and up */}
                                {event.imageFile ? (
                                    <Box
                                        className="aspect-ratio-container"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <img
                                            alt="event"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile}`}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "450px",  // Increased image height
                                                objectFit: "cover",  // Fill the area while preserving aspect ratio
                                                borderRadius: "8px",  // Added border radius for smoother edges
                                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"  // Added slight shadow
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                                        No image available for this event.
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>  {/* Text on the right */}
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Event Name:</strong> {event.eventName}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Event Type:</strong> {event.eventType}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Date:</strong> {dayjs(event.eventDate).format('DD MMMM YYYY')}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Time:</strong> {event.eventTimeFrom} to {event.eventTimeTo}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Location:</strong> {event.location}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Organizer Details:</strong> {event.organizerDetails}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Max Participants:</strong> {event.maxParticipants}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Description:</strong> {event.eventDescription}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Terms and Conditions:</strong> {event.termsAndConditions}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Status:</strong> {event.eventStatus}
                                </Typography>
                                {event.eventStatus !== "Completed" && event.eventStatus !== "Cancelled" && (
                                    <Button
                                        onClick={handleSignUpClick}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#4caf50',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#45a049',
                                            },
                                            padding: '12px 24px',  // More padding for the button
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            boxShadow: 'none',
                                            transition: 'background-color 0.3s ease',  // Smooth transition on hover
                                            mt: 2,  // Added margin on top for spacing
                                        }}
                                    >
                                        Sign up event
                                    </Button>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Positioned snackbar at the top-center
            >
                <Alert onClose={handleCloseSnackbar} severity="info">
                    Please log in to sign up for this event!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EventDetails;
