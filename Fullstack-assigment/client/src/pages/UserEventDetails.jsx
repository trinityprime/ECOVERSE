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

            <Box sx={{ ml: "300px", p: 2, width: "calc(100% - 240px)" }}>
                <ToastContainer />
                {event && (
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
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
                                                maxHeight: "400px",
                                                objectFit: "contain"
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <div style={{ marginBottom: "1rem" }}>
                                        <Typography variant="body1" color="textSecondary">
                                            No image available for this event.
                                        </Typography>
                                    </div>
                                )}
                                <Typography variant="body1">
                                    <strong>Event Name:</strong> {event.eventName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Event Type:</strong> {event.eventType}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Date:</strong>{" "}
                                    {dayjs(event.eventDate).format("DD MMMM YYYY")}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Time:</strong> {event.eventTimeFrom} to{" "}
                                    {event.eventTimeTo}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Location:</strong> {event.location}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Organizer Details:</strong> {event.organizerDetails}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Max Participants:</strong> {event.maxParticipants}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Description:</strong> {event.eventDescription}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Terms and Conditions:</strong>{" "}
                                    {event.termsAndConditions}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Status:</strong> {event.eventStatus}
                                </Typography>
                            </Grid>

                            {event.eventStatus !== "Completed" && event.eventStatus !== "Cancelled" && (
                                <Grid item xs={12}>
                                    <Button
                                        onClick={handleSignUpClick}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#4caf50',
                                            color: '#fff',
                                            '&:hover': {
                                                backgroundColor: '#45a049',
                                            },
                                            padding: '10px 20px',
                                            textTransform: 'none',
                                            fontSize: '16px',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        Sign up event
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="info">
                    Please log in to sign up for this event!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EventDetails;
