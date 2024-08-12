import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Divider, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from 'papaparse';

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [openExportModal, setOpenExportModal] = useState(false);

    const handleExportCourse = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/course/${id}`);
            if (response.status === 200) {
                const courseData = response.data;

                // Prepare data for CSV
                const csvData = [
                    ["Field", "Details"],
                    ["Course Name", courseData.courseName],
                    ["Course Type", courseData.courseType],
                    ["Course Dates", `${dayjs(courseData.courseStartDate).format('DD MMMM YYYY')} to ${dayjs(courseData.courseEndDate).format('DD MMMM YYYY')}`],
                    ["Time", `${courseData.courseTimeFrom} to ${courseData.courseTimeTo}`],
                    ["Location", courseData.location],
                    ["Organizer Details", courseData.organizerDetails],
                    ["Max Participants", courseData.maxParticipants],
                    ["Description", courseData.courseDescription],
                    ["Terms and Conditions", courseData.termsAndConditions],
                    ["Status", courseData.courseStatus]
                ];

                // Convert data to CSV
                const csv = Papa.unparse(csvData);

                // Create a blob and download
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                if (link.download !== undefined) { // feature detection
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `course_${id}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } else {
                toast.error(`Failed to export Course ID ${id}.`);
            }
        } catch (error) {
            toast.error(`Failed to export Course ID ${id}.`);
            console.error("Error exporting course:", error);
        }
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/course/${id}`);
                if (response.status === 200) {
                    setCourse(response.data); // Assuming response.data includes 'participants'
                    setLoading(false);
                } else {
                    setError("Failed to fetch course details");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
                setError("Failed to fetch course details");
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/course/${courseId}`);
            if (response.status === 200) {
                toast.success(`Course ID ${courseId} has been successfully deleted.`);
                // Optionally navigate away after deletion
                navigate('/AdminECManagement');
            } else {
                toast.error(`Failed to delete Course ID ${courseId}.`);
            }
        } catch (error) {
            toast.error(`Failed to delete Course ID ${courseId}.`);
            console.error("Error deleting course:", error);
        }
    };

    if (loading) {
        return <p>Loading course details...</p>; // Display a loading spinner or message
    }

    if (error) {
        return <p>{error}</p>; // Display an error message
    }

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar Navigation (Assuming similar structure as before) */}
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
                    <Link to="/course-management" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="body1" gutterBottom>
                            course Management
                        </Typography>
                    </Link>
                    <Link to="/course-management" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="body1" gutterBottom>
                            Course Management
                        </Typography>
                    </Link>

                    <Link to="/account-management" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="body1" gutterBottom>
                            Account Management
                        </Typography>
                    </Link>
                </Box>
                <Box>
                    <Link to="/logout" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="body1" gutterBottom>
                            Sign-out
                        </Typography>
                    </Link>
                </Box>
            </Box>

            <Box sx={{ ml: "300px", p: 2, width: "calc(100% - 240px)" }}>
                <ToastContainer />
                <Typography variant="h5" align="center" gutterBottom>
                    Course Details, ID: {id}
                </Typography>
                {course && (
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ textAlign: "right" }}>
                                <Button
                                    component={Link}
                                    to={`/edit-course/${id}`}
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
                                {course.imageFile ? (
                                    <Box
                                        className="aspect-ratio-container"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <img
                                            alt="course"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${course.imageFile}`}
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
                                                'course Name': course.courseName,
                                                'course Type': course.courseType,
                                                'Date': dayjs(course.courseDate).format("DD MMMM YYYY"),
                                                'Time': `${course.courseTimeFrom} to ${course.courseTimeTo}`,
                                                'Location': course.location,
                                                'Organizer Details': course.organizerDetails,
                                                'Max Participants': course.maxParticipants,
                                                'Description': course.courseDescription,
                                                'Terms and Conditions': course.termsAndConditions,
                                                'Status': course.courseStatus,
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ ml: 1 }}
                                    onClick={() => setOpenModal(true)}
                                >
                                    View Additional Details
                                </Button>
                            </Grid>
                        </Grid>

                        <Dialog
                            open={openExportModal}
                            onClose={() => setOpenExportModal(false)}
                            aria-labelledby="export-dialog-title"
                            aria-describedby="export-dialog-description"
                        >
                            <DialogTitle id="export-dialog-title">Export course</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="export-dialog-description">
                                    Choose the format you want to export the course details.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        handleExportcourse("csv");
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
                                    Are you sure you want to delete this course? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        handleDeletecourse(id);
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

                        <Dialog
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            aria-labelledby="course-modal-title"
                            aria-describedby="course-modal-description"
                        >
                            <DialogTitle id="course-modal-title">Additional Course Details</DialogTitle>
                            <DialogContent>
                                <Typography variant="body1">
                                    {/* Replace this with additional course details as needed */}
                                    Here you can include more information about the course.
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenModal(false)}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default CourseDetails;
