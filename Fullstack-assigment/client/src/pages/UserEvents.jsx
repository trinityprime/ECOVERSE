import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { toast } from 'react-toastify';
import UserContext from '../contexts/UserContext'; // Import UserContext to access user data

function Events() {
    const [eventList, setEventList] = useState([]);
    const [visibleEvents, setVisibleEvents] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext); // Get user data from UserContext

    const showToast = (message, type = 'success') => {
        toast.dismiss();
        toast[type](message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const getEvents = () => {
        http.get('/userEvent')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setEventList(res.data);
                } else {
                    setEventList([]);
                }
            })
            .catch((err) => {
                console.error('Error fetching events:', err);
                showToast('Error fetching events', 'error');
                setEventList([]);
            });
    };

    useEffect(() => {
        getEvents();
        setVisibleEvents(5);
        setHasMore(true);
    }, []);

    useEffect(() => {
        if (location.state) {
            if (location.state.addedEvent) {
                showToast('Event added successfully');
                navigate(location.pathname, { replace: true, state: {} });
            } else if (location.state.updatedEvent) {
                showToast('Event updated successfully');
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location, navigate]);

    const handleViewMore = () => {
        const newVisibleEvents = visibleEvents + 5;
        setVisibleEvents(newVisibleEvents);
        if (newVisibleEvents >= filteredEvents.length) {
            setHasMore(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setVisibleEvents(5);
        setHasMore(true);
    };

    // Filter events based on user role
    const filteredEvents = eventList.filter(event => {
        // Admin can see all events; non-admin can only see their own events
        if (user.role === 'admin') {
            return true;
        } else {
            return event.userId === user.id;
        }
    }).filter(event => (
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dayjs(event.eventDate).format(global.datetimeFormat).toLowerCase().includes(searchTerm.toLowerCase())
    ));

    return (
        <Box>
            <Typography variant="h2" sx={{ my: 4 }}>
                Your Own Added Event
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 0 }}>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/AddUserEvent" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add Event
                    </Button>
                </Link>
            </Box>

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    label="Search events"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="user event table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Event Name</TableCell>
                            <TableCell>Participants</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEvents.slice(0, visibleEvents).map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.eventName}</TableCell>
                                <TableCell>{event.eventPax}</TableCell>
                                <TableCell>{event.eventAddress}</TableCell>
                                <TableCell>{dayjs(event.eventDate).format(global.datetimeFormat)}</TableCell>
                                <TableCell>{event.eventDescription}</TableCell>
                                <TableCell>
                                    <Link to={`/EditUserEvent/${event.id}`}>
                                        <IconButton color="primary">
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {hasMore && filteredEvents.length > visibleEvents && (
                    <Button variant="outlined" onClick={handleViewMore}>
                        View More
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default Events;
