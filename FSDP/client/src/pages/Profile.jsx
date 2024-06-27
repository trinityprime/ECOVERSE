import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import http from '../http';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import TextField from '@mui/material/TextField';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [users, setUsers] = useState([]);
    const [setEditingUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserRole();
        if (user?.role === 'admin') {
            fetchAllUsers();
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

    const fetchAllUsers = async () => {
        try {
            const response = await http.get('/user');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await http.delete(`/user/${userId}`);
                alert("User deleted successfully!");
                setUsers(users.filter(u => u.id !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("An error occurred while deleting the user.");
            }
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            try {
                await http.delete('/profile');
                alert("Profile deleted successfully!");
                setUser(null);
                navigate('/login');
            } catch (error) {
                console.error("Error deleting profile:", error);
                alert("An error occurred while deleting the profile.");
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
            toast.success("Profile updated successfully!");
            setEditMode(false);
            setUser({ ...user, ...values });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating the profile.");
        } finally {
            setSubmitting(false);
        }
    };



    if (loading) {
        return <CircularProgress />;
    }

    // ---------------------------------------------------------------------------------------------//

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ToastContainer />
            <Typography variant="h5" sx={{ mb: 2 }}>
                Profile
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', maxWidth: '800px' }}>
                <Box sx={{ width: '50%', p: 3, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 8, mr: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
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
                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} >
                                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <>
                            <Typography variant="body1" sx={{ mb: 1 }} align='center' fontSize={30}>
                                {user.name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }} align='center' fontSize={25}>
                                {userRole}
                            </Typography>

                            <div align='center'>
                                {user.role === 'admin' && (
                                    <Button variant="contained" onClick={() => navigate('/adduser')}>
                                        Add User
                                    </Button>

                                )}
                            </div>
                        </>

                    )}

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
                    <div align='center'>
                        <IconButton color="primary" sx={{ padding: '20px' }} onClick={() => setEditMode(!editMode)}>
                            <Edit />
                        </IconButton>
                        <IconButton color="secondary" sx={{ padding: '20px' }} onClick={handleDeleteProfile}>
                            <Delete />
                        </IconButton>
                    </div>
                </Box>

            </Box>
            {userRole === 'admin' && (
                <Box sx={{ mt: 4, width: '100%', maxWidth: '800px' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        All Users
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Date of Birth</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNumber}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{dayjs(user.dob).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell>
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
