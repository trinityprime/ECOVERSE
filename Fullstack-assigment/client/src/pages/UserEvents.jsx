import React, { useEffect, useState } from 'react';
import { Box, Typography, Input, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';

function Events() {
    const [eventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getEvent = () => {
        http.get('/userEvent').then((res) => {
            setEventList(res.data);
        });
    };

    const searchEvent = () => {
        http.get(`/userEvent?search=${search}`).then((res) => {
            setEventList(res.data);
        });
    };

    useEffect(() => {
        getEvent();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvent();
        }
    };

    const onClickSearch = () => {
        searchEvent();
    };

    const onClickClear = () => {
        setSearch('');
        getEvent();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                All Event added by user
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search by event name, address, date, etc."
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
                <Link to="/AddUserEvent" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        Add
                    </Button>
                </Link>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Event Name</TableCell>
                            <TableCell>Participants</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventList.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.eventName}</TableCell>
                                <TableCell>{event.eventPax}</TableCell>
                                <TableCell>{event.eventAddress}</TableCell>
                                <TableCell>{dayjs(event.eventDate).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>{event.eventDescription}</TableCell>
                                <TableCell>
                                    <Link to={`/EditUserEvent/${event.id}`}>
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

export default Events;
