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
            <Box
                sx={{
                    width: "240px", // Adjusted width for the sidebar
                    position: "fixed",
                    top: "120px", // Adjust to accommodate app bar height
                    left: "50px",
                    backgroundColor: "#f0f0f0",
                    p: 2,
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    zIndex: "1000", // Ensure the sidebar is above other content
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Navigation
                </Typography>
                <Divider />
                <Box sx={{ my: 2 }}>
                    <Link
                        to="/dashboard"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body1" gutterBottom>
                            Dashboard
                        </Typography>
                    </Link>
                    <Link
                        to="/event-management"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body1" gutterBottom>
                            Event Management
                        </Typography>
                    </Link>
                    <Link
                        to="/course-management"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body1" gutterBottom>
                            Course Management
                        </Typography>
                    </Link>
                    <Link
                        to="/settings"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body1" gutterBottom>
                            Settings
                        </Typography>
                    </Link>
                    <Link
                        to="/account-management"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body1" gutterBottom>
                            Account Management
                        </Typography>
                    </Link>
                </Box>
                <Box>
                    <Link
                        to="/logout"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <Typography variant="body1" gutterBottom>
                            Sign-out
                        </Typography>
                    </Link>
                </Box>
            </Box>

            <Box sx={{ ml: "300px", p: 2, width: "calc(100% - 240px)" }}>
                <ToastContainer />
                <Typography variant="h5" align="center" gutterBottom>
                    Event Details, ID: {id}
                </Typography>
                {event && (
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: "right" }}>
                                <Button
                                    component={Link}
                                    to={`/edit-event/${id}`}
                                    variant="contained"
                                    color="primary"
                                    sx={{ mr: 1 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setOpenDeleteConfirmation(true)}
                                >
                                    Delete
                                </Button>
                            </Grid>
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
                                                maxWidth: "100%", // ensures the image scales down to fit the container
                                                maxHeight: "400px", // adjust the height as needed
                                                objectFit: "contain" // maintains aspect ratio
                                            }}
                                            onError={(e) => {
                                                console.error("Error loading image:", e);
                                                e.target.src = "/path/to/placeholder-image.jpg"; // Optional: set a placeholder image in case of an error
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
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "limegreen", color: "white" }}
                                    onClick={() => setOpenExportModal(true)}
                                >
                                    Export
                                </Button>
                            </Grid>

                            <Grid item xs={6} sx={{ textAlign: "right" }}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "blue", color: "white" }}
                                    onClick={() => setOpenModal(true)}
                                >
                                    View Additional Details
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {/* Additional Details Modal */}
                {event && (
                    <Modal open={openModal} onClose={() => setOpenModal(false)}>
                        <Box sx={{ ...modalStyle, width: 400 }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Additional Details
                            </Typography>
                            <Typography variant="body1">
                                <strong>Participants:</strong>
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {event.participants &&
                                            event.participants.map((participant) => (
                                                <TableRow key={participant.id}>
                                                    <TableCell>{participant.id}</TableCell>
                                                    <TableCell>{participant.name}</TableCell>
                                                    <TableCell>{participant.email}</TableCell>
                                                </TableRow>
                                            ))}
                                        {/* Hardcoded Row Example */}
                                        <TableRow>
                                            <TableCell>999</TableCell>
                                            <TableCell>John Doe</TableCell>
                                            <TableCell>john.doe@gmail.com</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>666</TableCell>
                                            <TableCell>some random demon</TableCell>
                                            <TableCell>imunderyourbed@yahoo.com</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Modal>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteConfirmation}
                    onClose={() => setOpenDeleteConfirmation(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Confirm Deletion"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this event?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setOpenDeleteConfirmation(false)}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleDeleteEvent(id);
                                setOpenDeleteConfirmation(false);
                            }}
                            color="secondary"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Export Modal */}
                <Modal
                    open={openExportModal}
                    onClose={() => setOpenExportModal(false)}
                    aria-labelledby="export-modal-title"
                    aria-describedby="export-modal-description"
                >
                    <Box sx={modalStyle}>
                        <DialogTitle id="export-modal-title">Export Event?</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="export-modal-description">
                                Are you sure you want to export this event?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenExportModal(false)} color="primary">
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    handleExportEvent();
                                    setOpenExportModal(false);
                                }}
                                color="secondary"
                            >
                                Export
                            </Button>
                        </DialogActions>
                    </Box>
                </Modal>
            </Box>
        </Box>
    );
}

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    outline: "none",
};

export default EventDetails;