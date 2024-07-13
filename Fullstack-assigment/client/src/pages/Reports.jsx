import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { toast } from 'react-toastify';
import NavigationBox from './NavigationBox';

function Reports() {
    const [reportList, setReportList] = useState([]);
    const [visibleReports, setVisibleReports] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

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

    const filteredReports = reportList.filter(report =>
        dayjs(report.createdAt).format(global.datetimeFormat).toLowerCase().includes(searchTerm.toLowerCase()) ||
        renderIncidentType(report.incidentType).toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
