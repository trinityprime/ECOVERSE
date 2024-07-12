import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Divider, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from "@mui/material";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [openExportModal, setOpenExportModal] = useState(false);

    const handleExportEvent = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3001/event/export/${id}`
            );
            if (response.status === 200) {
                toast.success(`Event ID ${id} has been successfully exported.`);
                setTimeout(() => {
                    navigate('/AdminECManagement');
                }, 1400);
                // Handle exported data or download here if necessary
            } else {
                toast.error(`Failed to export Event ID ${id}.`);
            }
        } catch (error) {
            toast.error(`Failed to export Event ID ${id}.`);
            console.error("Error exporting event:", error);
        }
    };


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

    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/event/${eventId}`);
            if (response.status === 200) {
                toast.success(`Event ID ${eventId} has been successfully deleted.`);
                // Optionally navigate away after deletion
                navigate('/AdminECManagement');
            } else {
                toast.error(`Failed to delete Event ID ${eventId}.`);
            }
        } catch (error) {
            toast.error(`Failed to delete Event ID ${eventId}.`);
            console.error("Error deleting event:", error);
        }
    };
    

    if (loading) {
        return <p>Loading event details...</p>; // Display a loading spinner or message
    }

    if (error) {
        return <p>{error}</p>; // Display an error message
    }

    return (
        <Box sx={{ display: "flex" }}>
            
            <Box sx={{ ml: "300px", p: 2, width: "calc(100% - 240px)" }}>
                <ToastContainer />
                <Typography variant="h5" align="center" gutterBottom>
                    Event Details, ID: {id}
                </Typography>
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
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile
                                                }`}
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
                            <Typography sx={{ color: 'limegreen', '&:hover': { textDecoration: 'underline' } }}>
                                <Link
                                    to={`/AddSignUpEvent?eventName=${encodeURIComponent(event.eventName)}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    Sign up event
                                </Link>
                            </Typography>
                            
                        </Grid>
                    </Box>
                )}

                
            </Box>
        </Box>
    );
}


export default EventDetails;