import React, { useEffect, useState } from 'react';
import { Box, Typography, Input, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search, Clear, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import http from '../http';

function SignUps() {
    const [signUpList, setSignUpList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getSignUp = () => {
        http.get('/signup')
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setSignUpList(res.data);
                } else {
                    setSignUpList([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching sign ups:', error);
                setSignUpList([]);
            });
    };

    const searchSignUp = () => {
        http.get(`/signup?search=${search}`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setSignUpList(res.data);
                } else {
                    setSignUpList([]);
                }
            })
            .catch((error) => {
                console.error('Error searching sign ups:', error);
                setSignUpList([]);
            });
    };

    useEffect(() => {
        getSignUp();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchSignUp();
        }
    };

    const onClickSearch = () => {
        searchSignUp();
    };

    const onClickClear = () => {
        setSearch('');
        getSignUp();
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
                <Link to="/AddSignUp" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
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
                        {signUpList.map((signUp) => (
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
