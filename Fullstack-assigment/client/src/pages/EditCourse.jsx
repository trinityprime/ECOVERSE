import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import http from "../http";
import { useFormik } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState({
        courseName: "",
        courseStartDate: '',
        courseEndDate: '',
        courseTimeFrom: "",
        courseTimeTo: "",
        location: "",
        organizerDetails: "",
        maxParticipants: 0,
        courseDescription: "",
        termsAndConditions: "",
        courseStatus: "",
        courseImage: "",
    });

    const locationOptions = [
        { value: "North East", label: "North East" },
        { value: "North", label: "North" },
        { value: "East", label: "East" },
        { value: "West", label: "West" },
        { value: "Central", label: "Central" },
    ];

    const courseTypeOptions = [
        { value: 'Workshop', label: 'Workshop on Sustainable Practices' },
        { value: 'Conference', label: 'Conference on Environmental Issues' },
        { value: 'Sports', label: 'Sports Event with an Eco-Focus' },
        { value: 'Market', label: 'Eco-Marketplace' },
        { value: 'Exhibition', label: 'Exhibition on Sustainability' },
        { value: 'Volunteering', label: 'Volunteering Opportunities' },
        { value: 'Charity', label: 'Charity Event with a Sustainability Angle' },
        { value: 'Social', label: 'Social Event Promoting Sustainable Lifestyles' },
        { value: 'Seminar', label: 'Seminar on Environmental Education' },
        { value: 'Festival', label: 'Sustainability Festival' },
        { value: 'Others', label: 'Other Customized Courses' }
    ];

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch course data by ID with error handling
        http.get(`/course/${id}`)
            .then((res) => {
                setCourse(res.data);
                setLoading(false);
            })
            .catch((error) => {
                toast.error("Failed to fetch course details");
                console.error("Error fetching course details:", error);
                setLoading(false);
            });
    }, [id]);

    // Formik initialization
    const formik = useFormik({
        initialValues: course,
        enableReinitialize: true,
        validationSchema: yup.object({
            courseName: yup.string().trim()
                .min(3, 'Course Name must be at least 3 characters')
                .max(100, 'Course Name must be at most 100 characters')
                .required('Course Name is required'),
            courseType: yup.string().trim()
                .required('Please select a course type'),
            courseDescription: yup.string().trim()
                .test(
                    'min-words',
                    'Course Description must be at least 5 words',
                    value => value && value.split(' ').filter(word => word.length > 0).length >= 5
                )
                .max(500, 'Course Description must be at most 500 characters')
                .required('Course Description is required'),
            courseStartDate: yup.date()
                .typeError('Incorrect format for Start Date')
                .min(new Date(2024, 0, 1), 'Start Date must be in the year 2024 or later')
                .max(new Date(2099, 12, 31), 'Start Date must be in the year 2099 or earlier')
                .required('Start Date is required'),
            courseEndDate: yup.date()
                .typeError('Incorrect format for End Date')
                .min(new Date(2024, 0, 1), 'End Date must be in the year 2024 or later')
                .max(new Date(2099, 11, 31), 'End Date must be in the year 2099 or earlier'),
            courseTimeFrom: yup.string().trim()
                .required('Start Time is required'),
            courseTimeTo: yup.string().trim()
                .required('End Time is required'),
            location: yup.string().trim()
                .min(3, 'Location must be at least 3 characters')
                .max(100, 'Location must be at most 100 characters')
                .required('Location is required'),
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
            courseStatus: yup.string().trim()
                .required('Course Status is required'),
            courseImage: "",
        }),
        onSubmit: (data) => {
            // Trim strings before submission
            data.courseName = data.courseName.trim();
            data.location = data.location.trim();
            data.organizerDetails = data.organizerDetails.trim();
            data.courseDescription = data.courseDescription.trim();
            data.termsAndConditions = data.termsAndConditions.trim();

            // Update course data with PUT request
            http
                .put(`/course/${id}`, data)
                .then((res) => {
                    toast.success(`Course ID ${id} has been updated successfully`);
                    setTimeout(() => {
                        navigate(`/course-details/${id}`);
                    }, 1400);

                })
                .catch((error) => {
                    toast.error(`Failed to update course ${id}`);
                    console.error(`Error updating course ${id}:`, error);
                });
        },
    });

    // State for delete confirmation dialog
    const [open, setOpen] = useState(false);

    // Open dialog
    const handleOpen = () => {
        setOpen(true);
    };

    // Close dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Delete course function
    const deleteCourse = () => {
        http
            .delete(`/courses/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    toast.success(`Course ID ${id} has been successfully deleted.`);
                    setTimeout(() => {
                        navigate('/course-details/${id}');
                    }, 1400);
                } else {
                    toast.error(`Course ID ${id} cannot be deleted.`);
                }
            })
            .catch((error) => {
                toast.error(`Failed to delete Course ID ${id}.`);
                console.error("Error deleting course:", error);
            });
    };

    // Function to handle file change (upload)
    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error("Maximum file size is 1MB");
                return;
            }

            let formData = new FormData();
            formData.append("file", file);
            http
                .post("/file/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    // Update formik values with new image filename
                    formik.setFieldValue("courseImage", res.data.filename);
                    // Also update the course state to display the new image
                    setCourse({ ...course, imageFile: res.data.filename });
                })
                .catch((error) => {
                    toast.error("Failed to upload image");
                    console.error("Error uploading image:", error);
                });
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Course
            </Typography>
            {!loading && (
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Course Name"
                                name="courseName"
                                value={formik.values.courseName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.courseName && Boolean(formik.errors.courseName)}
                                helperText={formik.touched.courseName && formik.errors.courseName}
                            />

                            <FormControl fullWidth margin="dense">
                                <InputLabel id="courseType-label">Course Type</InputLabel>
                                <Select
                                    labelId="courseType-label"
                                    id="courseType"
                                    name="courseType"
                                    value={formik.values.courseType}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.courseType && Boolean(formik.errors.courseType)}
                                    label="Course Type"
                                >
                                    <MenuItem value="">Select Course Type</MenuItem>
                                    {courseTypeOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.courseType && formik.errors.courseType && (
                                    <Typography variant="caption" color="error">
                                        {formik.errors.courseType}
                                    </Typography>
                                )}
                            </FormControl>


                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                multiline
                                minRows={2}
                                label="Course Description"
                                name="courseDescription"
                                value={formik.values.courseDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.courseDescription && Boolean(formik.errors.courseDescription)}
                                helperText={formik.touched.courseDescription && formik.errors.courseDescription}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                type="date"
                                label="Start Date"
                                name="courseStartDate"
                                value={formik.values.courseStartDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.courseStartDate && Boolean(formik.errors.courseStartDate)}
                                helperText={formik.touched.courseStartDate && formik.errors.courseStartDate}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth margin="dense" autoComplete="off"
                                type="date"
                                label="End Date"
                                name="courseEndDate"
                                value={formik.values.courseEndDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.courseEndDate && Boolean(formik.errors.courseEndDate)}
                                helperText={formik.touched.courseEndDate && formik.errors.courseEndDate}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                type="time"
                                label="Start Time"
                                name="courseTimeFrom"
                                value={formik.values.courseTimeFrom}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.courseTimeFrom && Boolean(formik.errors.courseTimeFrom)}
                                helperText={formik.touched.courseTimeFrom && formik.errors.courseTimeFrom}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                type="time"
                                label="End Time"
                                name="courseTimeTo"
                                value={formik.values.courseTimeTo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.courseTimeTo && Boolean(formik.errors.courseTimeTo)}
                                helperText={formik.touched.courseTimeTo && formik.errors.courseTimeTo}
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
                                fullWidth
                                margin="dense"
                                autoComplete="off"
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
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Organizer Details"
                                name="organizerDetails"
                                value={formik.values.organizerDetails}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.organizerDetails && Boolean(formik.errors.organizerDetails)}
                                helperText={formik.touched.organizerDetails && formik.errors.organizerDetails}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                multiline
                                minRows={2}
                                label="Terms and Conditions"
                                name="termsAndConditions"
                                value={formik.values.termsAndConditions}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.termsAndConditions && Boolean(formik.errors.termsAndConditions)}
                                helperText={formik.touched.termsAndConditions && formik.errors.termsAndConditions}
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="course-status-label">Course Status</InputLabel>
                                <Select
                                    labelId="course-status-label"
                                    id="course-status"
                                    name="courseStatus"
                                    value={formik.values.courseStatus}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.courseStatus && Boolean(formik.errors.courseStatus)}
                                    label="Course Status"
                                >
                                    <MenuItem value="">Select Course Status</MenuItem>
                                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                                    <MenuItem value="Scheduled">Scheduled</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Postponed">Postponed</MenuItem>
                                </Select>
                                {formik.touched.courseStatus && formik.errors.courseStatus && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                        {formik.errors.courseStatus}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        {/* Image upload and display */}
                        <Grid item xs={12} md={6} lg={4}>
                            <Box sx={{ textAlign: "center" }}>
                                <Button variant="contained" component="label">
                                    Upload Image
                                    <input hidden accept="image/*" type="file" onChange={onFileChange} />
                                </Button>
                                {course.imageFile && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img
                                            alt="course"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${course.imageFile}`}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "200px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                )}
                                {/* Show message if no image available */}
                                {!course.imageFile && (
                                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                                        No image available for this course.
                                    </Typography>
                                )}
                                {/* show new image */}
                                {formik.values.courseImage && (
                                    <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                        <img
                                            alt="course"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${formik.values.courseImage}`}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "200px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit">
                            Update
                        </Button>
                        <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this course?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteCourse}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
}

export default EditCourse;