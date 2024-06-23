import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import UserContext from '../contexts/UserContext';
import http from '../http';

function Profile() {
    const { user } = useContext(UserContext);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        try {
            const response = await http.get("/user/auth");
            setUserRole(response.data.user.role);
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Profile
            </Typography>
            <Typography variant="body1">
                Name: {user.name}
            </Typography>
            <Typography variant="body1">
                Email: {user.email}
            </Typography>
            <Typography variant="body1">
                Role: {userRole}
            </Typography>
        </Box>
    );
}

export default Profile;
