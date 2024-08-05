import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material';
import http from '../http'; // Ensure this is correctly set up to handle HTTP requests
import UserContext from '../contexts/UserContext'; // Ensure this context provides user data

function UserSignUps() {
    const { user } = useContext(UserContext); // Get user data from context
    const [signUps, setSignUps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSignUps = async () => {
            try {
                // Ensure user.id exists and pass it as a query parameter
                const userId = user?.id;
                if (userId) {
                    console.log('Fetching sign-ups for user ID:', userId); // Debug log
                    const response = await http.get('/signups', {
                        params: { userId }
                    });
                    console.log('Sign-ups fetched:', response.data); // Debug log
                    setSignUps(response.data);
                } else {
                    console.warn('No user ID available');
                }
            } catch (error) {
                console.error('Error fetching sign-ups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSignUps();
    }, [user]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ p: 3, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 8 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                My Sign-Ups
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Event/Course Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Number of Pax</TableCell>
                        <TableCell>Special Requirements</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {signUps.length > 0 ? (
                        signUps.map((signUp) => (
                            <TableRow key={signUp.id}>
                                <TableCell>{signUp.eventCourseName}</TableCell>
                                <TableCell>{new Date(signUp.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{signUp.numberOfPax}</TableCell>
                                <TableCell>{signUp.specialRequirements}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4}>No sign-ups found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );
}

export default UserSignUps;
