import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TableContainer, Paper } from '@mui/material';
import { PowerSettingsNew } from '@mui/icons-material';
import { Edit } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import TextField from '@mui/material/TextField';

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [signUpList, setSignUpList] = useState([]);
    const [visibleSignUps, setVisibleSignUps] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSignUps, setFilteredSignUps] = useState([]);
    const [reportList, setReportList] = useState([]);
    const [visibleReports, setVisibleReports] = useState(5);


    useEffect(() => {
        fetchUserRole();
        if (user?.role === 'admin') {
            fetchAllUsers();
        }
    }, [user]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().min(3).max(100).required('Name is required'),
        email: Yup.string().trim().email('Invalid email format').required('Email is required'),
        phoneNumber: Yup.string().trim().matches(/^\d{8}$/, 'Phone number must be 8 digits').required('Phone number is required'),
        dob: Yup.date().nullable()
    });

    // get role to check if admin using useEffect
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

    // for admin user table info
    const fetchAllUsers = async () => {
        try {
            const response = await http.get('/user');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // for current profile update
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

    const handleDeactivateAccount = async () => {
        try {
            await http.put('/user/deactivate');
            toast.success("Your account has been deactivated.");
            navigate("/login")
        } catch (err) {
            toast.error(`Failed to deactivate account: ${err.response?.data?.message || err.message}`);
        }
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


    const getReports = () => {
        http.get('/report')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setReportList(res.data);
                } else {
                    setReportList([]);
                }
            })
            .catch((err) => {
                console.error('Error fetching reports:', err);
                showToast('Error fetching reports', 'error');
                setReportList([]);
            });
    };

    useEffect(() => {
        getReports();
        setVisibleReports(5);
        setHasMore(true);
    }, []);

    useEffect(() => {
        if (location.state) {
            if (location.state.addedReport) {
                showToast('Report added successfully');
                navigate(location.pathname, { replace: true, state: {} });
            } else if (location.state.updatedReport) {
                showToast('Report updated successfully');
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [location, navigate]);

    const renderIncidentType = (type) => {
        switch (type) {
            case 'Environmental Incident':
                return 'Environmental Incident';
            case 'Resources Management':
                return 'Resources Management';
            default:
                return 'Others';
        }
    };

    // Filter reports based on user role
    const filteredReports = reportList.filter(report => {
        // Admin can see all reports; non-admin can only see their own reports

        if (user.role === 'admin') {
            return true;
        } else {
            return report.userId === user.id;
        }
    }).filter(report => (
        dayjs(report.createdAt).format(global.datetimeFormat).toLowerCase().includes(searchTerm.toLowerCase()) ||
        renderIncidentType(report.incidentType).toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase())
    ));


    if (loading) {
        return <CircularProgress />;
    }

    // ---------------------------------------------------------------------------------------------//

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                        </>
                    )}

                </Box>
                <Box sx={{ width: '50%', p: 3, bgcolor: 'background.paper', boxShadow: 1, ml: 2 }}>
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
                        <IconButton color="warning" sx={{ padding: '20px' }} onClick={handleClickOpen}>
                            {/* Change to warning color for deactivation */}
                            <PowerSettingsNew />
                        </IconButton>

                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Deactivate Account</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to deactivate your account? You will not be able to access it until it is reactivated.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="inherit" variant="contained">
                                    Cancel
                                </Button>
                                <Button onClick={handleDeactivateAccount} color="warning" variant="contained">
                                    Deactivate
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <ToastContainer />
                </Box>
            </Box>
            <div>
                <Box>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        Sign Ups
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
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
                                        <TableCell>{signUp.MobileNumber}</TableCell>
                                        <TableCell>{signUp.Email}</TableCell>
                                        <TableCell>{signUp.numberOfPax}</TableCell>
                                        <TableCell>{signUp.specialRequirements}</TableCell>
                                        <TableCell>{signUp.eventCourseName}</TableCell>
                                        <TableCell>
                                            <Link to={`/EditSignUp/${signUp.id}`}>
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
                        {hasMore && filteredSignUps.length > visibleSignUps && (
                            <Button variant="outlined" onClick={handleViewMore}>
                                View More
                            </Button>
                        )}
                    </Box>
                </Box>
            </div>

            <div>
                <Box>
                    <Typography variant="h5" sx={{ my: 2 }}>
                        Reports
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Type of Incident</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReports.slice(0, visibleReports).map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{dayjs(report.updatedAt || report.createdAt).format(global.datetimeFormat)}</TableCell>
                                        <TableCell>{report.user ? report.user.name : 'Unknown'}</TableCell>
                                        <TableCell>{report.title}</TableCell>
                                        <TableCell>{renderIncidentType(report.incidentType)}</TableCell>
                                        <TableCell>{report.description}</TableCell>
                                        <TableCell>
                                            <Link to={`/editreport/${report.id}`}>
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
                </Box>
            </div>
        </Box>
    )
}


export default Profile;