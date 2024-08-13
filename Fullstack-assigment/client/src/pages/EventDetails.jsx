import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Divider, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";

function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [openExportModal, setOpenExportModal] = useState(false);

    const handleExportEvent = async (format) => {
        try {
            const response = await axios.get(`http://localhost:3001/event/${id}`);
            if (response.status === 200) {
                const eventData = response.data;
                if (format === 'csv') {
                    exportToCSV(eventData);
                }
                toast.success(`Event ID ${id} has been successfully exported in ${format}.`);
            } else {
                toast.error(`Failed to export Event ID ${id}.`);
            }
        } catch (error) {
            toast.error(`Failed to export Event ID ${id} using ${format}.`);
            console.error("Error exporting event:", error);
        }
    };

    const exportToCSV = (eventData) => {
        const csvData = [
            {
                'Event ID': eventData.id,
                'Event Name': eventData.eventName,
                'Event Type': eventData.eventType,
                'Date': dayjs(eventData.eventDate).format("DD MMMM YYYY"),
                'Time': `${eventData.eventTimeFrom} to ${eventData.eventTimeTo}`,
                'Location': eventData.location,
                'Organizer Details': eventData.organizerDetails,
                'Max Participants': eventData.maxParticipants,
                'Description': eventData.eventDescription,
                'Terms and Conditions': eventData.termsAndConditions,
                'Status': eventData.eventStatus,
                'Image': `${import.meta.env.VITE_FILE_BASE_URL}${eventData.imageFile}`
            }
        ];

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `Event_${eventData.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/event/${id}`);
                if (response.status === 200) {
                    setEvent(response.data);
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
                navigate('/AdminECManagement');
            } else {
                toast.error(`Failed to delete Event ID ${eventId}.`);
            }
        } catch (error) {
            toast.error(`Failed to delete Event ID ${eventId}.`);
            console.error("Error deleting event:", error);
        }
    };

    // scrolling
    const eventRef = useRef(null);
    const courseRef = useRef(null);
    const userRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

    if (loading) {
        return <p>Loading event details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Box sx={{ display: "flex" }}>
            <Box
                sx={{
                    width: "240px",
                    position: "fixed",
                    top: "120px",
                    left: "50px",
                    backgroundColor: "#f0f0f0",
                    p: 2,
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    zIndex: "1000",
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Navigation
                </Typography>
                <Divider />
                <Box sx={{ my: 2 }}>
                    <Link to="/AdminECManagement" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="body1" gutterBottom>
                            Dashboard
                        </Typography>
                    </Link>
                    <Link to="/AdminECManagement" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            onClick={() => scrollToSection(eventRef)}
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Event Management
                        </Typography>
                    </Link>
                    <Link to="/AdminECManagement" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            onClick={
                                scrollToSection(courseRef)}
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Course Management
                        </Typography>
                    </Link>

                    <Link to="/AdminECManagement" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography
                            variant="body1"
                            gutterBottom
                            onClick={() => scrollToSection(userRef)}
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            Account Management
                        </Typography>
                    </Link>
                </Box>
                <Box
                    sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                    onClick={logout}
                >
                    <Typography variant="body1" gutterBottom>
                        Sign-out
                    </Typography>
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
                                        />
                                    </Box>
                                ) : (
                                    <Typography>No image is added or available.</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="bold">Field</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight="bold">Details</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries({
                                                'Event Name': event.eventName,
                                                'Event Type': event.eventType,
                                                'Date': dayjs(event.eventDate).format("DD MMMM YYYY"),
                                                'Time': `${event.eventTimeFrom} to ${event.eventTimeTo}`,
                                                'Location': event.location,
                                                'Organizer Details': event.organizerDetails,
                                                'Max Participants': event.maxParticipants,
                                                'Description': event.eventDescription,
                                                'Terms and Conditions': event.termsAndConditions,
                                                'Status': event.eventStatus,
                                            }).map(([field, value]) => (
                                                <TableRow key={field}>
                                                    <TableCell>{field}</TableCell>
                                                    <TableCell>{value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: "center" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenExportModal(true)}
                                >
                                    Export
                                </Button>
                                
                            </Grid>
                        </Grid>

                        <Dialog
                            open={openExportModal}
                            onClose={() => setOpenExportModal(false)}
                            aria-labelledby="export-dialog-title"
                            aria-describedby="export-dialog-description"
                        >
                            <DialogTitle id="export-dialog-title">Export Event</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="export-dialog-description">
                                    Choose the format you want to export the event details.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        handleExportEvent("csv");
                                        setOpenExportModal(false);
                                    }}
                                >
                                    Export as CSV
                                </Button>
                                <Button onClick={() => setOpenExportModal(false)}>Cancel</Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openDeleteConfirmation}
                            onClose={() => setOpenDeleteConfirmation(false)}
                            aria-labelledby="delete-dialog-title"
                            aria-describedby="delete-dialog-description"
                        >
                            <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="delete-dialog-description">
                                    Are you sure you want to delete this event? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        handleDeleteEvent(id);
                                        setOpenDeleteConfirmation(false);
                                    }}
                                    color="secondary"
                                >
                                    Delete
                                </Button>
                                <Button onClick={() => setOpenDeleteConfirmation(false)}>
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>

                        
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default EventDetails;
