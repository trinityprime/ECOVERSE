import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Grid } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import http from '../http';
import { toast } from 'react-toastify';
import UserContext from '../contexts/UserContext'; // Import UserContext to access user data

function SignUps() {
    const [signUpList, setSignUpList] = useState([]);
    const [visibleSignUps, setVisibleSignUps] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSignUps, setFilteredSignUps] = useState([]);
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

    const getSignUps = () => {
        http.get('/signup')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setSignUpList(res.data);
                    filterSignUps(res.data, searchTerm);
                } else {
                    setSignUpList([]);
                }
            })
            .catch((err) => {
                console.error('Error fetching sign ups:', err);
                showToast('Error fetching sign ups', 'error');
                setSignUpList([]);
            });
    };

    useEffect(() => {
        getSignUps();
        setVisibleSignUps(5);
        setHasMore(true);
    }, []);

    useEffect(() => {
        filterSignUps(signUpList, searchTerm);
    }, [searchTerm, signUpList]);

    const handleViewMore = () => {
        const newVisibleSignUps = visibleSignUps + 5;
        setVisibleSignUps(newVisibleSignUps);
        if (newVisibleSignUps >= filteredSignUps.length) {
            setHasMore(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setVisibleSignUps(5);
        setHasMore(true);
    };

    // Filter sign ups based on user role
    const filterSignUps = (data, search) => {
        let filteredData = data;

        if (user) {
            if (user.role === 'admin') {
                // Admin can see all sign-ups
                filteredData = filteredData.filter(signUp => (
                    signUp.Name.toLowerCase().includes(search.toLowerCase()) ||
                    signUp.Email.toLowerCase().includes(search.toLowerCase()) ||
                    signUp.eventCourseName.toLowerCase().includes(search.toLowerCase())
                ));
            } else {
                // Non-admin can only see their own sign-ups
                filteredData = filteredData
                    .filter(signUp => signUp.userId === user.id)
                    .filter(signUp => (
                        signUp.Name.toLowerCase().includes(search.toLowerCase()) ||
                        signUp.Email.toLowerCase().includes(search.toLowerCase()) ||
                        signUp.eventCourseName.toLowerCase().includes(search.toLowerCase())
                    ));
            }
        } else {
            // If no user is logged in, show all sign-ups
            filteredData = filteredData.filter(signUp => (
                signUp.Name.toLowerCase().includes(search.toLowerCase()) ||
                signUp.Email.toLowerCase().includes(search.toLowerCase()) ||
                signUp.eventCourseName.toLowerCase().includes(search.toLowerCase())
            ));
        }

        setFilteredSignUps(filteredData);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Sign Ups
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                    fullWidth
                    label="Search sign ups"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Mobile Number</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Number of Pax</TableCell>
                            <TableCell>Special Requirements</TableCell>
                            <TableCell>Event/Course Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSignUps.slice(0, visibleSignUps).map((signUp) => (
                            <TableRow key={signUp.id}>
                                <TableCell>{signUp.Name}</TableCell>
                                <TableCell>{signUp.MobileNumber}</TableCell>
                                <TableCell>{signUp.Email}</TableCell>
                                <TableCell>{signUp.numberOfPax}</TableCell>
                                <TableCell>{signUp.specialRequirements}</TableCell>
                                <TableCell>{signUp.eventCourseName}</TableCell>
                                <TableCell>
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                {hasMore && filteredSignUps.length > visibleSignUps && (
                    <Button variant="outlined" onClick={handleViewMore}>
                        View More
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default SignUps;
