import React, { useEffect, useState } from 'react';
import { Box, Typography, Input, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search, Clear, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import http from '../http';

function SignUps() {
    const [signUpList, setSignUpList] = useState([]);
    const [filteredSignUpList, setFilteredSignUpList] = useState([]);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getSignUp = () => {
        const url = '/signup';
        console.log(`Fetching sign ups with URL: ${url}`);
        http.get(url)
            .then((res) => {
                console.log('Fetched sign ups:', res.data);
                if (Array.isArray(res.data)) {
                    setSignUpList(res.data);
                    filterSignUps(res.data, filterType, search); // Filter after fetching
                } else {
                    setSignUpList([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching sign ups:', error);
                setSignUpList([]);
            });
    };

    const filterSignUps = (data, filterType, search) => {
        let filteredData = data;

        // Apply filterType
        if (filterType !== 'All') {
            filteredData = filteredData.filter(signUp => signUp.type === filterType);
        }

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase();
            filteredData = filteredData.filter(signUp => 
                signUp.Name.toLowerCase().includes(searchLower) ||
                signUp.Email.toLowerCase().includes(searchLower) ||
                signUp.eventCourseName.toLowerCase().includes(searchLower)
            );
        }

        setFilteredSignUpList(filteredData);
    };

    useEffect(() => {
        getSignUp();
    }, [filterType]);

    useEffect(() => {
        filterSignUps(signUpList, filterType, search);
    }, [search, filterType, signUpList]);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            filterSignUps(signUpList, filterType, search);
        }
    };

    const onClickSearch = () => {
        filterSignUps(signUpList, filterType, search);
    };

    const onClickClear = () => {
        setSearch('');
        filterSignUps(signUpList, filterType, '');
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Sign Ups
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search by name, email, event/course name, etc."
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                    sx={{ flex: 1, mr: 2 }}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                        value={filterType}
                        onChange={handleFilterChange}
                        label="Filter"
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Event">Event</MenuItem>
                        <MenuItem value="Course">Course</MenuItem>
                    </Select>
                </FormControl>
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
                        {filteredSignUpList.map((signUp) => (
                            <TableRow key={signUp.id}>
                                <TableCell>{signUp.Name}</TableCell>
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
        </Box>
    );
}

export default SignUps;
