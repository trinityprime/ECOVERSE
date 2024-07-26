import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Divider, Button, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
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
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5; // Number of items per page
    const { user, setUser } = useContext(UserContext);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

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

    // Handle user deletion
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await http.delete(`/user/${userId}`);
                toast.success("User deleted successfully!");
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.success("An error occurred while deleting the user.");
            }
        }
    };

    // Handle dialog open/close
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Handle profile deletion
    const handleDeleteProfile = async () => {
        try {
            await http.delete('/profile');
            toast.success("Profile deleted successfully!");
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error("Error deleting profile:", error);
            toast.error("An error occurred while deleting the profile.");
        }
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

    // Calculate total number of pages for events and courses
    const totalEventPages = Math.ceil(events.length / perPage);
    const totalCoursePages = Math.ceil(courses.length / perPage);
    const totalUserPages = Math.ceil(users.length / perPage);

    // Filter events and courses to display based on current page
    const indexOfLastEvent = currentPage * perPage;
    const indexOfFirstEvent = indexOfLastEvent - perPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const currentCourses = courses.slice(indexOfFirstEvent, indexOfLastEvent);
    const currentUsers = users.slice(indexOfFirstEvent, indexOfLastEvent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body1" gutterBottom>Dashboard</Typography>
                    </Link>
                    <Link to="/event-management" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body1" gutterBottom>Event Management</Typography>
                    </Link>
                    <Link to="/course-management" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body1" gutterBottom>Course Management</Typography>
                    </Link>
                    <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body1" gutterBottom>Settings</Typography>
                    </Link>
                    <Link to="/account-management" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body1" gutterBottom>Account Management</Typography>
                    </Link>
                </Box>
                <Box>
                    <Link to="/logout" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="body1" gutterBottom>Sign-out</Typography>
                    </Link>
                </Box>
            </Box>

            {/* Main Content Section */}
            <Box sx={{ ml: '300px', p: 2, width: 'calc(100% - 240px)' }}>
                {/* User List */}
                <Box sx={{ ml: '-15px', p: 2, width: 'calc(100% - 0px)' }}>
                    {/* User List */}
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
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                            <Link to={`/edituser/${user.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                        {/* Pagination Controls for Users */}
                        <Box mt={2} sx={{ textAlign: 'center' }}>
                            {/* Previous page button */}
                            <Button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                sx={{ mr: 1 }}
                            >
                                Previous
                            </Button>

                            {/* Page indicators or numbers */}
                            {Array.from({ length: totalUserPages }).map((_, index) => (
                                <Button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                                    sx={{ mx: 1 }}
                                >
                                    {index + 1}
                                </Button>
                            ))}

                            {/* Next page button */}
                            <Button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalUserPages}
                                sx={{ ml: 1 }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                    <ToastContainer />
                </Box>

                {/* Event List */}
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
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Event Name</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status</Typography>
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
                        currentEvents.map((event) => (
                            <Card key={event.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={0} alignItems="center">
                                        <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                            <Typography>{event.id}</Typography>
                                        </Grid>
                                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                            <Typography>{dayjs(event.eventDate).format('DD MMMM YYYY')}</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Typography>{event.eventName}</Typography>
                                        </Grid>
                                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ color: 'limegreen', '&:hover': { textDecoration: 'underline' } }}>
                                                <Link to={`/event-details/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    View Details
                                                </Link>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    )}


                    {/* Pagination Controls for Events */}
                    <Box mt={2} sx={{ textAlign: 'center' }}>
                        {/* Previous page button */}
                        <Button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            sx={{ mr: 1 }}
                        >
                            Previous
                        </Button>

                        {/* Page indicators or numbers */}
                        {Array.from({ length: totalEventPages }).map((_, index) => (
                            <Button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                                sx={{ mx: 1 }}
                            >
                                {index + 1}
                            </Button>
                        ))}

                        {/* Next page button */}
                        <Button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalEventPages}
                            sx={{ ml: 1 }}
                        >
                            Next
                        </Button>
                        
                    </Box>
                    
                </Box>

                {/* Course List */}
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
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Course Name</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status</Typography>
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
                        currentCourses.map((course) => (
                            <Card key={course.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={0} alignItems="center">
                                        <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                            <Typography>{course.id}</Typography>
                                        </Grid>
                                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                            <Typography>{dayjs(course.startDate).format('DD MMMM YYYY')}</Typography>
                                        </Grid>
                                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                                            <Typography>{course.courseName}</Typography>
                                        </Grid>
                                        <Grid item xs={3} sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ color: 'limegreen', '&:hover': { textDecoration: 'underline' } }}>
                                                <Link to={`/course-details/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                    View Details
                                                </Link>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    )}


                    {/* Pagination Controls for Courses */}
                    <Box mt={2} sx={{ textAlign: 'center' }}>
                        {/* Previous page button */}
                        <Button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            sx={{ mr: 1 }}
                        >
                            Previous
                        </Button>

                        {/* Page indicators or numbers */}
                        {Array.from({ length: totalCoursePages }).map((_, index) => (
                            <Button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                                sx={{ mx: 1 }}
                            >
                                {index + 1}
                            </Button>
                        ))}

                        {/* Next page button */}
                        <Button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalCoursePages}
                            sx={{ ml: 1 }}
                        >
                            Next
                        </Button>
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
                            <Link to={`/addevent`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                Create New Event
                            </Link>
                        </Button>
                        <Button>
                            <Link to={`/addcourse`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                Create New Course
                            </Link>
                        </Button>
                        <Button>
                            <Link to={`/adduser`} style={{ textDecoration: 'none', color: 'inherit' }}>
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