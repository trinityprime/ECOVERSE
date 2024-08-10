import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Divider, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            const response = await axios.get(
                `http://localhost:3001/course/export/${id}`
            );
            if (response.status === 200) {
                toast.success(`Course ID ${id} has been successfully exported.`);
                setTimeout(() => {
                    navigate('/AdminECManagement');
                }, 1400);
                // Handle exported data or download here if necessary
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


            {/* Main Content */}
            <Box sx={{ ml: "300px", p: 2, width: "calc(100% - 240px)" }}>
                <ToastContainer />
                <Typography variant="h5" align="center" gutterBottom>
                    Course Details, ID: {id}
                </Typography>
                {course && (
                    <Box>
                        <Grid container spacing={2}>

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
                                    <div style={{ marginBottom: "1rem" }}>
                                        <Typography variant="body1" color="textSecondary">
                                            No image available for this course.
                                        </Typography>
                                    </div>
                                )}
                                <Typography variant="body1">
                                    <strong>Course Name:</strong> {course.courseName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Course Type:</strong> {course.courseType}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Course Dates: </strong>
                                    {`${dayjs(course.courseStartDate).format('DD MMMM YYYY')} to ${dayjs(course.courseEndDate).format('DD MMMM YYYY')}`}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Time:</strong> {course.courseTimeFrom} to{" "}
                                    {course.courseTimeTo}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Location:</strong> {course.location}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Organizer Details:</strong> {course.organizerDetails}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Max Participants:</strong> {course.maxParticipants}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Description:</strong> {course.courseDescription}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Terms and Conditions:</strong>{" "}
                                    {course.termsAndConditions}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Status:</strong> {course.courseStatus}
                                </Typography>
                            </Grid>
                            {course.courseStatus !== "Completed" && (
                                <Grid item xs={12}>
                                    <Typography sx={{ color: 'limegreen', '&:hover': { textDecoration: 'underline' } }}>
                                        <Link
                                            to={`/AddSignUp?courseName=${encodeURIComponent(course.courseName)}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            Sign up course
                                        </Link>
                                    </Typography>
                                </Grid>
                            )}




                        </Grid>
                    </Box>
                )}
            </Box>
        </Box>
    );
}



export default CourseDetails;