import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Divider, Button, IconButton } from '@mui/material';
import { EventAvailable, Pending, CheckCircle as CheckCircleIcon, PauseCircle, Cancel as CancelIcon } from '@mui/icons-material';
import { Edit, PowerSettingsNew } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import http from '../http';
import axios from 'axios';
import dayjs from 'dayjs';

function AdminECManagement() {
    const [events, setEvents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [error, setError] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    // pagination
    const perPage = 5; // Number of items per page
    const [userPage, setUserPage] = useState(1);
    const [coursePage, setCoursePage] = useState(1);
    const [eventPage, setEventPage] = useState(1);
    const paginateUsers = (page) => setUserPage(page);
    const paginateCourses = (page) => setCoursePage(page);
    const paginateEvents = (page) => setEventPage(page);




    // Get role to check if admin
    const fetchUserRole = async () => {
        try {
            const response = await http.get("/user/auth");
            setUserRole(response.data.user.role);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user role:", error);
            setLoading(false);
        }
    };

    // Fetch all users for admin
    const fetchAllUsers = async () => {
        try {
            const response = await http.get('/user');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const handleDeactivateUser = (userId) => {
        if (window.confirm("Are you sure you want to deactivate this user?")) {
            http.put(`/user/${userId}/deactivate`)
                .then(() => {
                    toast.success("User has been deactivated.");
                    window.location.reload();

                })
                .catch((err) => {
                    toast.error(`Failed to deactivate user: ${err.response?.data?.message || err.message}`);
                });
        }
    };
    
    const handleReactivateUser = (userId) => {
        if (window.confirm("Are you sure you want to reactivate this user?")) {
            http.put(`/user/${userId}/reactivate`)
                .then(() => {
                    toast.success("User has been reactivated.");
                    window.location.reload();
                })
                .catch((err) => {
                    toast.error(`Failed to reactivate user: ${err.response?.data?.message || err.message}`);
                });
        }
    };
    

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

    // Fetch events and courses
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3001/event');
                setEvents(response.data);
                setLoadingEvents(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Error fetching events');
                setLoadingEvents(false);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:3001/course');
                setCourses(response.data);
                setLoadingCourses(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setError('Error fetching courses');
                setLoadingCourses(false);
            }
        };

        fetchEvents();
        fetchCourses();
        fetchUserRole();

        if (user?.role === 'admin') {
            fetchAllUsers();
        }
    }, [user]);

    // Function to get status icon and color (courses + events)
    const renderEventStatusIconAndColor = (eventStatus) => {
        switch (eventStatus.toLowerCase()) {
            case "scheduled":
                return { icon: <EventAvailable />, color: "orange" };
            case "ongoing":
                return { icon: <Pending />, color: "blue" };
            case "completed":
                return { icon: <CheckCircleIcon />, color: "green" };
            case "postponed":
                return { icon: <PauseCircle />, color: "orange" };
            case "cancelled":
                return { icon: <CancelIcon />, color: "red" };
            default:
                return { icon: <EventAvailable />, color: "text.secondary" };
        }
    };

    const renderCourseStatusIconAndColor = (courseStatus) => {
        switch (courseStatus.toLowerCase()) {
            case 'scheduled':
                return { icon: <EventAvailable />, color: 'orange' };
            case 'ongoing':
                return { icon: <Pending />, color: 'blue' };
            case 'completed':
                return { icon: <CheckCircleIcon />, color: 'green' };
            case 'postponed':
                return { icon: <PauseCircle />, color: 'orange' };
            case 'cancelled':
                return { icon: <CancelIcon />, color: 'red' };
            default:
                return { icon: <EventAvailable />, color: 'text.secondary' };
        }
    };

    // Calculate total number of pages for events, courses, and users
    const totalEventPages = Math.ceil(events.length / perPage);
    const totalCoursePages = Math.ceil(courses.length / perPage);
    const totalUserPages = Math.ceil(users.length / perPage);

    // Filter events, courses, and users to display based on their respective current pages
    const indexOfLastEvent = eventPage * perPage;
    const indexOfFirstEvent = indexOfLastEvent - perPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const indexOfLastCourse = coursePage * perPage;
    const indexOfFirstCourse = indexOfLastCourse - perPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    const indexOfLastUser = userPage * perPage;
    const indexOfFirstUser = indexOfLastUser - perPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // scrolling
    const eventRef = useRef(null);
    const courseRef = useRef(null);
    const userRef = useRef(null);

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (loadingEvents || loadingCourses) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Navigation Section */}
            <Box
                sx={{
                    width: '240px', // Adjusted width for the sidebar
                    position: 'fixed',
                    top: '120px', // Adjust to accommodate app bar height
                    left: '50px',
                    backgroundColor: '#f0f0f0',
                    p: 2,
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    zIndex: '1000' // Ensure the sidebar is above other content
                }}
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>Admin Navigation</Typography>
                <Divider />
                <Box sx={{ my: 2 }}>
                    <Link to="/AdminECManagement" style={{ textDecoration: "none", color: "inherit" }}>
                        <Typography variant="body1" gutterBottom>
                            Dashboard
                        </Typography>
                    </Link>
                    <Typography
                        variant="body1"
                        gutterBottom
                        onClick={() => scrollToSection(eventRef)}
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                        Event Management
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        onClick={() => scrollToSection(courseRef)}
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                        Course Management
                    </Typography>
                    <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body1" gutterBottom></Typography>
                    </Link>
                    <Typography
                        variant="body1"
                        gutterBottom
                        onClick={() => scrollToSection(userRef)}
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                        Account Management
                    </Typography>
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

            {/* Main Content Section */}
            <Box sx={{ ml: '300px', p: 2, width: 'calc(100% - 240px)' }}>
                {/* User List */}
                <Box sx={{ ml: '-15px', p: 2, width: 'calc(100% - 0px)' }}>
                    {/* User List */}
                    <Box ref={userRef} sx={{ pt: 10 }}>
                        <Typography variant="h5" align="left" gutterBottom>All Users</Typography>
                        <Box sx={{ mb: 3 }}>
                            {/* Header Row */}
                            <Grid container spacing={0} sx={{ backgroundColor: '#f0f0f0', py: 1.5 }}>
                                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>ID</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Name</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Email</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Phone Number</Typography>
                                </Grid>
                                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Role</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Date of Birth</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Actions</Typography>
                                </Grid>
                            </Grid>

                            {/* Data Rows */}
                            {currentUsers.map((user) => (
                                <Card key={user.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={0} alignItems="center">
                                            <Grid item xs={1} sx={{ textAlign: 'center' }}>
                                                <Typography>{user.id}</Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                <Typography>{user.name}</Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                <Typography>{user.email}</Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                <Typography>{user.phoneNumber}</Typography>
                                            </Grid>
                                            <Grid item xs={1} sx={{ textAlign: 'center' }}>
                                                <Typography>{user.role}</Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                <Typography>{dayjs(user.dob).format('DD-MM-YYYY')}</Typography>
                                            </Grid>
                                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                {user.status === 'deactivated' ? (
                                                    <Typography
                                                        color="primary"
                                                        onClick={() => handleReactivateUser(user.id)}
                                                        sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                    >
                                                        REACTIVATE
                                                    </Typography>
                                                ) : (
                                                    <>
                                                        {user.id !== 1 && (
                                                            <IconButton
                                                                color="secondary"
                                                                onClick={() => handleDeactivateUser(user.id)}
                                                            >
                                                                <PowerSettingsNew />
                                                            </IconButton>
                                                        )}
                                                        <Link to={`/edituser/${user.id}`}>
                                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                                <Edit />
                                                            </IconButton>
                                                        </Link>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}


                            {/* USERS TABLE */}
                            <Box mt={2} sx={{ textAlign: 'center' }}>
                                <Button onClick={() => paginateUsers(userPage - 1)} disabled={userPage === 1} sx={{ mr: 1 }}>
                                    Previous
                                </Button>
                                {Array.from({ length: totalUserPages }).map((_, index) => (
                                    <Button key={index} onClick={() => paginateUsers(index + 1)} variant={userPage === index + 1 ? 'contained' : 'outlined'} sx={{ mx: 1 }}>
                                        {index + 1}
                                    </Button>
                                ))}
                                <Button onClick={() => paginateUsers(userPage + 1)} disabled={userPage === totalUserPages} sx={{ ml: 1 }}>
                                    Next
                                </Button>
                            </Box>
                        </Box>
                        <ToastContainer />
                    </Box>
                </Box>

                {/* Event List */}
                <Box ref={eventRef} sx={{ pt: 10 }}>
                    <Typography variant="h5" align="left" gutterBottom>Event List</Typography>
                    <Box sx={{ mb: 5 }}>
                        {/* Header Row */}
                        <Grid container spacing={0} sx={{ backgroundColor: '#f0f0f0', py: 1 }}>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>ID</Typography>
                            </Grid>
                            <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Date</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Event Name</Typography>
                            </Grid>
                            <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Actions</Typography>
                            </Grid>
                        </Grid>

                        {/* Data Rows */}
                        {currentEvents.length === 0 ? (
                            <Grid container spacing={0} sx={{ backgroundColor: '#fff', py: 2 }}>
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1">No events available</Typography>
                                </Grid>
                            </Grid>
                        ) : (
                            currentEvents.map((event) => {
                                const { icon, color } = renderEventStatusIconAndColor(event.eventStatus);

                                return (
                                    <Card key={event.id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Grid container spacing={0} alignItems="center">
                                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                    <Typography>{event.id}</Typography>
                                                </Grid>
                                                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                                    <Typography>{dayjs(event.startDate).format('DD MMMM YYYY')}</Typography>
                                                </Grid>
                                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                    <Typography>{event.eventName}</Typography>
                                                </Grid>
                                                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                                    <Typography sx={{ color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {icon} {event.eventStatus}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                    <Typography sx={{ color: 'limegreen', '&:hover': { textDecoration: 'underline' } }}>
                                                        <Link to={`/event-details/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                            View Details
                                                        </Link>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}


                        {/* Pagination Controls for Events */}
                        <Box mt={2} sx={{ textAlign: 'center' }}>
                            <Button onClick={() => paginateEvents(eventPage - 1)} disabled={eventPage === 1} sx={{ mr: 1 }}>
                                Previous
                            </Button>
                            {Array.from({ length: totalEventPages }).map((_, index) => (
                                <Button key={index} onClick={() => paginateEvents(index + 1)} variant={eventPage === index + 1 ? 'contained' : 'outlined'} sx={{ mx: 1 }}>
                                    {index + 1}
                                </Button>
                            ))}
                            <Button onClick={() => paginateEvents(eventPage + 1)} disabled={eventPage === totalEventPages} sx={{ ml: 1 }}>
                                Next
                            </Button>
                        </Box>
                    </Box>

                </Box>

                {/* Course List */}
                <Box ref={courseRef} sx={{ pt: 10 }}>
                    <Typography variant="h5" align="left" gutterBottom>Course List</Typography>
                    <Box sx={{ mb: 5 }}>
                        {/* Header Row */}
                        <Grid container spacing={0} sx={{ backgroundColor: '#f0f0f0', py: 1 }}>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>ID</Typography>
                            </Grid>
                            <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Start Date</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Course Name</Typography>
                            </Grid>
                            <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Actions</Typography>
                            </Grid>
                        </Grid>

                        {/* Data Rows */}
                        {currentCourses.length === 0 ? (
                            <Grid container spacing={0} sx={{ backgroundColor: '#fff', py: 2 }}>
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1">No courses available</Typography>
                                </Grid>
                            </Grid>
                        ) : (
                            currentCourses.map((course) => {
                                const { icon, color } = renderCourseStatusIconAndColor(course.courseStatus);

                                return (
                                    <Card key={course.id} sx={{ mb: 2 }}>
                                        <CardContent>
                                            <Grid container spacing={0} alignItems="center">
                                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                    <Typography>{course.id}</Typography>
                                                </Grid>
                                                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                                    <Typography>{dayjs(course.startDate).format('DD MMMM YYYY')}</Typography>
                                                </Grid>
                                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                    <Typography>{course.courseName}</Typography>
                                                </Grid>
                                                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                                    <Typography sx={{ color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {icon} {course.courseStatus}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                                    <Typography sx={{ color: 'limegreen', '&:hover': { textDecoration: 'underline' } }}>
                                                        <Link to={`/course-details/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                            View Details
                                                        </Link>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}


                        {/* Pagination Controls for Courses */}
                        <Box mt={2} sx={{ textAlign: 'center' }}>
                            <Button onClick={() => paginateCourses(coursePage - 1)} disabled={coursePage === 1} sx={{ mr: 1 }}>
                                Previous
                            </Button>
                            {Array.from({ length: totalCoursePages }).map((_, index) => (
                                <Button key={index} onClick={() => paginateCourses(index + 1)} variant={coursePage === index + 1 ? 'contained' : 'outlined'} sx={{ mx: 1 }}>
                                    {index + 1}
                                </Button>
                            ))}
                            <Button onClick={() => paginateCourses(coursePage + 1)} disabled={coursePage === totalCoursePages} sx={{ ml: 1 }}>
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>

                {/* Event and Course Creation Form (Add Event and Add Course) */}
                <Box mt={4} sx={{
                    mb: 2, backgroundImage: 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)',
                    borderRadius: 8,
                    padding: 3,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center' // Center align content inside the Box
                }}>
                    <Typography variant="h5" gutterBottom>Welcome to the User, Event and Course Creation Form Section</Typography>
                    <Typography variant="body1" gutterBottom>
                        Click on the buttons below to start registering new users, events or courses.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button>
                            <Link to={`/AddEvent`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                Create New Event
                            </Link>
                        </Button>
                        <Button>
                            <Link to={`/AddCourse`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                Create New Course
                            </Link>
                        </Button>
                        <Button>
                            <Link to={`/AddUser`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                Create New User
                            </Link>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AdminECManagement;