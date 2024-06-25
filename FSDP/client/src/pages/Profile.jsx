import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Button, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (user) {
            fetchUserRole();
            if (user.role === 'admin') {
                fetchUsers();
            }
        }
    }, [user]);

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

    const fetchUsers = async () => {
        try {
            const response = await http.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await http.delete(`/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error(`Error deleting user with ID ${userId}:`, error);
            }
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().min(3).max(100).required('Name is required'),
        email: Yup.string().trim().email('Invalid email format').required('Email is required'),
        phoneNumber: Yup.string().trim().matches(/^\d{8}$/, 'Phone number must be 8 digits').required('Phone number is required'),
        dob: Yup.date().nullable()
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await http.put('/profile', values);
            alert("Profile updated successfully!");
            setEditMode(false); // Exit edit mode
            setUser({ ...user, ...values }); // Update user context with new values
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Typography variant="h5">Loading...</Typography>;
    }

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Profile
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', maxWidth: '800px' }}>
                <Box sx={{ width: '50%', p: 3, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 8, mr: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Profile Information
                    </Typography>
                    {editMode ? (
                        <Formik
                            initialValues={{
                                name: user.name,
                                email: user.email,
                                phoneNumber: user.phoneNumber,
                                dob: user.dob ? dayjs(user.dob).format('YYYY-MM-DD') : ''
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <Box sx={{ mb: 2 }}>
                                        <Field
                                            as={TextField}
                                            name="name"
                                            label="Name"
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            required
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Field
                                            as={TextField}
                                            name="email"
                                            label="Email"
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            required
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Field
                                            as={TextField}
                                            name="phoneNumber"
                                            label="Phone Number"
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            required
                                        />
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Field
                                            as={TextField}
                                            name="dob"
                                            label="Date of Birth"
                                            type="date"
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <>
                            <Typography variant="body1" sx={{ mb: 1 }} align='center' fontSize={20}>
                                {user.name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }} align='center' fontSize={18}>
                                {userRole}
                            </Typography>
                        </>
                    )}
                    <IconButton color="primary" sx={{ padding: '20px' }} onClick={() => setEditMode(!editMode)}>
                        <Edit />
                    </IconButton>
                    <IconButton color="secondary" sx={{ padding: '20px' }} onClick={() => handleDelete(user.id)}>
                        <Delete />
                    </IconButton>
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

            {/* User Management Table (Admin only) */}
            {user.role === 'admin' && (
                <Box sx={{ mt: 4, maxWidth: '800px' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        User Management
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNumber}</TableCell>
                                    <TableCell>
                                        <Link to={`/edituser/${user.id}`} style={{ textDecoration: 'none' }}>
                                            <IconButton color="primary">
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                        <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            )}
        </Box>
    );
}

export default Profile;
