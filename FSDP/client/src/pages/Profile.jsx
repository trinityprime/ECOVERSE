import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import UserContext from '../contexts/UserContext';
import http from '../http';
import dayjs from 'dayjs';

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
            <Typography variant="h5" sx={{ mb: 2 }}>
                Profile
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', maxWidth: '800px' }}>
                <Box sx={{ width: '50%', p: 3, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 8, mr: 2 }}>
                    <Link to={`/editprofile/${user.id}`}>
                        <IconButton color="primary" sx={{ padding: '4px' }}>
                            <Edit />
                        </IconButton>
                    </Link>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Insert Profile
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }} align='center' fontSize={20}>
                        {user.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }} align='center' fontSize={18}>
                        {userRole}
                    </Typography>
                </Box>
                <Box sx={{ width: '50%', p: 3, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 8, ml: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Contact Details
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }} fontSize={16}>
                        <strong>EMAIL ADDRESS:</strong> {user.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>PHONE NUMBER:</strong> {user.phoneNumber}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>DATE OF BIRTH:</strong> {dayjs(user.dob).format('DD-MM-YYYY')}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Profile;
