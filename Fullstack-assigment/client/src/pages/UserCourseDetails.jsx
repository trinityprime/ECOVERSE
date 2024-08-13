import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid, Snackbar, Alert, Button } from "@mui/material";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext"; // Adjust the import path if necessary
import ContactUsImage from '../assets/ContactUs.jpeg';

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
    const { user } = useContext(UserContext); // Get user from UserContext

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/course/${id}`);
                if (response.status === 200) {
                    setCourse(response.data);
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

    const handleSignUpClick = () => {
        if (user) {
            navigate(`/AddSignUp?courseName=${encodeURIComponent(course.courseName)}`);
        } else {
            setOpenSnackbar(true); // Show snackbar if not logged in
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/course/${courseId}`);
            if (response.status === 200) {
                toast.success(`Course ID ${courseId} has been successfully deleted.`);
                navigate('/AdminECManagement');
            } else {
                toast.error(`Failed to delete Course ID ${courseId}.`);
            }
        } catch (error) {
            toast.error(`Failed to delete Course ID ${courseId}.`);
            console.error("Error deleting course:", error);
        }
    };

    const handleExportCourse = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/course/export/${id}`);
            if (response.status === 200) {
                toast.success(`Course ID ${id} has been successfully exported.`);
                setTimeout(() => {
                    navigate('/AdminECManagement');
                }, 1400);
            } else {
                toast.error(`Failed to export Course ID ${id}.`);
            }
        } catch (error) {
            toast.error(`Failed to export Course ID ${id}.`);
            console.error("Error exporting course:", error);
        }
    };

    if (loading) {
        return <p>Loading course details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    width: "100%",
                    height: "250px",  // Increased height for a more prominent header
                    backgroundImage: `url(${ContactUsImage})`,
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
                        background: "rgba(0, 0, 0, 0.4)",  // Darker overlay for better text visibility
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1
                    }}
                />
                <Typography
                    variant="h4"  // Increased font size for the header text
                    align="center"
                    color="white"
                    sx={{ zIndex: 2, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}  // Added text shadow for readability
                >
                    Course Details, ID: {id}
                </Typography>
            </Box>
            <Box sx={{ mx: "auto", p: 3, maxWidth: "900px" }}>  {/* Centering content with auto margins */}
                <ToastContainer />
                {course && (
                    <Box sx={{ p: 2, borderRadius: 2, boxShadow: 3, backgroundColor: "#fff" }}> {/* Added card-like style */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>  {/* Image on the left, taking up half the width on medium screens and up */}
                                {course.imageFile ? (
                                    <Box
                                        className="aspect-ratio-container"
                                        sx={{ marginBottom: 2 }}
                                    >
                                        <img
                                            alt="course"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${course.imageFile}`}
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
                                        No image available for this course.
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>  {/* Text on the right */}
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Course Name:</strong> {course.courseName}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Course Type:</strong> {course.courseType}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Course Dates:</strong> {`${dayjs(course.courseStartDate).format('DD MMMM YYYY')} to ${dayjs(course.courseEndDate).format('DD MMMM YYYY')}`}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Time:</strong> {course.courseTimeFrom} to {course.courseTimeTo}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Location:</strong> {course.location}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Organizer Details:</strong> {course.organizerDetails}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Max Participants:</strong> {course.maxParticipants}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Description:</strong> {course.courseDescription}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Terms and Conditions:</strong> {course.termsAndConditions}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    <strong>Status:</strong> {course.courseStatus}
                                </Typography>
                                {course.courseStatus !== "Completed" && course.courseStatus !== "Cancelled" && (
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
                                        Sign up course
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
                    Please log in to sign up for this course!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default CourseDetails;
