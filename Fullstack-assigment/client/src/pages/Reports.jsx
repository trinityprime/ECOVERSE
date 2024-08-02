import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { toast } from 'react-toastify';
import NavigationBox from './NavigationBox';
import UserContext from '../contexts/UserContext';

function Reports() {
    const [reportList, setReportList] = useState([]);
    const [visibleReports, setVisibleReports] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);

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

    const getReports = () => {
        http.get('/report', {
            params: {
                includeAllUsers: user.isAdmin // Request all reports if user is admin
            }
        })
        .then((res) => {
            if (Array.isArray(res.data)) {
                // Filter reports for non-admin users
                const filteredReports = user.isAdmin ? res.data : res.data.filter(report => report.userId === user.id);
                setReportList(filteredReports);
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
    }, [user.isAdmin, user.id]);

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

    const handleViewMore = () => {
        const newVisibleReports = visibleReports + 5;
        setVisibleReports(newVisibleReports);
        if (newVisibleReports >= filteredReports.length) {
            setHasMore(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setVisibleReports(5);
        setHasMore(true);
    };

    const handleDeleteReport = (reportId) => {
        http.delete(`/report/${reportId}`)
            .then(() => {
                showToast('Report deleted successfully');
                getReports();
            })
            .catch((err) => {
                console.error('Error deleting report:', err);
                showToast('Error deleting report', 'error');
            });
    };

    const filteredReports = reportList.filter(report => (
        dayjs(report.createdAt).format(global.datetimeFormat).toLowerCase().includes(searchTerm.toLowerCase()) ||
        renderIncidentType(report.incidentType).toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.user && report.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ));

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '250px', mr: 2 }}>
                <NavigationBox />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h2" sx={{ my: 4 }}>
                    Incident Report List
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 0 }}>
                    <Box sx={{ flexGrow: 1 }} />
                    <Link to="/addreport" style={{ textDecoration: 'none' }}>
                        <Button variant='contained'>
                            Add Report
                        </Button>
                    </Link>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Search reports"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Box>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="incident report table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                {user.isAdmin && <TableCell>Name</TableCell>}
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
                                    {user.isAdmin && <TableCell>{report.user ? report.user.name : 'Unknown'}</TableCell>}
                                    <TableCell>{report.title}</TableCell>
                                    <TableCell>{renderIncidentType(report.incidentType)}</TableCell>
                                    <TableCell>{report.description}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" component={Link} to={`/editreport/${report.id}`}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteReport(report.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    {hasMore && filteredReports.length > visibleReports && (
                        <Button variant="outlined" onClick={handleViewMore}>
                            View More
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Reports;