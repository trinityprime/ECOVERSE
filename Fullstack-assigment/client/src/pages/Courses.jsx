import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Grid, Card , CardContent, Input, IconButton, Select, MenuItem, FormControl, InputLabel, Divider, Button
} from '@mui/material';
import {
    AccountCircle, AccessTime, Search, Clear, Event as EventIcon, LocationOn, People,
    EventAvailable, Pending, PauseCircle, Cancel as CancelIcon, CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState({});
    const [skills, setSkills] = useState({});
    const [sortBy, setSortBy] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [monthFilter, setMonthFilter] = useState('');

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getCourses = async () => {
        try {
            const response = await axios.get('http://localhost:3001/course');
            console.log('Response data:', response.data); // Log the response data

            if (Array.isArray(response.data)) {
                setCourses(response.data);
                processCategoriesAndSkills(response.data);
                setFilteredCourses(response.data);
            } else {
                throw new Error('Unexpected response data format');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Error fetching courses');
            setLoading(false);
        }
    };

    const searchCourses = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/course?search=${search}`);
            console.log('Search response data:', response.data);
            setCourses(response.data);
            processCategoriesAndSkills(response.data);
            setFilteredCourses(response.data);
        } catch (error) {
            console.error('Error searching courses:', error);
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [search, sortBy, locationFilter, monthFilter]);

    const processCategoriesAndSkills = (coursesData) => {
        const categoryCounts = coursesData.reduce((acc, course) => {
            const category = course.courseType;
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {});

        const allSkills = coursesData.flatMap(course => course.skills || []);
        const skillCounts = allSkills.reduce((acc, skill) => {
            acc[skill] = (acc[skill] || 0) + 1;
            return acc;
        }, {});

        setCategories(categoryCounts);
        setSkills(skillCounts);
    };

    const applyFilters = () => {
        let filteredResults = [...courses];

        if (search.trim() !== '') {
            filteredResults = filteredResults.filter(course =>
                course.courseName.toLowerCase().includes(search.trim().toLowerCase())
            );
        }

        if (sortBy !== '') {
            filteredResults = filteredResults.filter(course =>
                course.courseStatus.toLowerCase() === sortBy.toLowerCase()
            );
        }

        if (locationFilter !== '') {
            filteredResults = filteredResults.filter(course =>
                course.location.toLowerCase() === locationFilter.toLowerCase()
            );
        }

        if (monthFilter !== '') {
            filteredResults = filteredResults.filter(course =>
                dayjs(course.courseStartDate).month() === parseInt(monthFilter)
            );
        }

        console.log('Filtered results:', filteredResults);
        setFilteredCourses(filteredResults);
    };

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchCourses();
        }
    };

    const onClickSearch = () => {
        searchCourses();
    };

    const onClickClear = () => {
        setSearch('');
        getCourses();
    };

    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleLocationFilterChange = (e) => {
        setLocationFilter(e.target.value);
    };

    const handleMonthFilterChange = (e) => {
        setMonthFilter(e.target.value);
    };

    const renderCourseStatusIconAndColor = (courseStatus) => {
        switch (courseStatus.toLowerCase()) {
            case 'scheduled':
                return { icon: <EventAvailable />, color: 'orange' };
            case 'ongoing':
                return { icon: <Pending />, color: 'blue' };
            case 'completed':
                return { icon: <CheckCircleIcon />, color: 'green' };
            case 'postponed':
                return { icon: <PauseCircle />, color: 'orange' };
            case 'cancelled':
                return { icon: <CancelIcon />, color: 'red' };
            default:
                return { icon: <EventAvailable />, color: 'text.secondary' };
        }
    };

    if (loading) {
        return <p>Loading courses...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Courses
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search for courses..."
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="body2" sx={{ mr: 2 }}>
                    <span style={{ fontWeight: 'bold' }}>{filteredCourses.length}</span> results found
                </Typography>

                <Box sx={{ flexGrow: 15 }} />

                <FormControl sx={{ mr: 5 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        onChange={handleSortByChange}
                        style={{ minWidth: 150 }}
                        label="Sort By"
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="scheduled">Scheduled</MenuItem>
                        <MenuItem value="ongoing">Ongoing</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="postponed">Postponed</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ mr: 5 }}>
                    <InputLabel>Location</InputLabel>
                    <Select
                        value={locationFilter}
                        onChange={handleLocationFilterChange}
                        style={{ minWidth: 150 }}
                        label="Location"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="North East">North East</MenuItem>
                        <MenuItem value="North">North</MenuItem>
                        <MenuItem value="East">East</MenuItem>
                        <MenuItem value="Central">Central</MenuItem>
                        <MenuItem value="West">West</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ mr: 2 }}>
                    <InputLabel>Month</InputLabel>
                    <Select
                        value={monthFilter}
                        onChange={handleMonthFilterChange}
                        style={{ minWidth: 150 }}
                        label="Month"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value={0}>January</MenuItem>
                        <MenuItem value={1}>February</MenuItem>
                        <MenuItem value={2}>March</MenuItem>
                        <MenuItem value={3}>April</MenuItem>
                        <MenuItem value={4}>May</MenuItem>
                        <MenuItem value={5}>June</MenuItem>
                        <MenuItem value={6}>July</MenuItem>
                        <MenuItem value={7}>August</MenuItem>
                        <MenuItem value={8}>September</MenuItem>
                        <MenuItem value={9}>October</MenuItem>
                        <MenuItem value={10}>November</MenuItem>
                        <MenuItem value={11}>December</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {filteredCourses.length === 0 ? (
                <Typography>No courses found. Please try again by changing the filters.</Typography>
            ) : (
                <Box sx={{ display: 'flex', mb: 4 }}>
                    <Box sx={{ minWidth: 200, mr: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Top Categories
                        </Typography>
                        {Object.keys(categories).map((category, index) => (
                            <Typography key={index} variant="body2" gutterBottom>
                                <span style={{ fontWeight: 'bold' }}>{category}</span> - {categories[category]}
                            </Typography>
                        ))}

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>
                            Top Skills
                        </Typography>
                        {Object.keys(skills).map((skill, index) => (
                            <Typography key={index} variant="body2" gutterBottom>
                                <span style={{ fontWeight: 'bold' }}>{skill}</span> - {skills[skill]}
                            </Typography>
                        ))}
                    </Box>

                    <Grid container spacing={3}>
                        {filteredCourses.map((course) => (
                            <Grid item xs={12} md={6} lg={4} key={course.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {course.courseName}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            {console.log('imageFile:', course.imageFile)}
                                            {course.imageFile ? (
                                                <Box className="aspect-ratio-container" sx={{ marginBottom: 2 }}>
                                                    <img
                                                        alt="course"
                                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${course.imageFile}`}
                                                        style={{
                                                            maxWidth: "100%", // ensures the image scales down to fit the container
                                                            maxHeight: "400px", // adjust the height as needed
                                                            objectFit: "contain" // maintains aspect ratio
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" sx={{ marginTop: 3, marginBottom: 3, textAlign: 'center', fontStyle: 'italic' }}>
                                                    No image is available or added for this event.
                                                </Typography>
                                            )}
                                        </Box>


                                        <Box sx={{ marginTop: 3, marginBottom: 3, borderRadius: '5px', padding: '3px 8px', background: '#f0f0f0', marginRight: '10px' }}>
                                            {course.courseType}
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }} color="text.secondary">
                                            <AccountCircle sx={{ mr: 1, mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Organizer Details:
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    {course.organizerDetails}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <EventIcon sx={{ mr: 1 }} />
                                            <Typography>
                                                {`${dayjs(course.courseStartDate).format('DD MMMM YYYY')} to `}
                                                <span style={{ display: 'block', wordBreak: 'break-word' }}>
                                                    {dayjs(course.courseEndDate).format('DD MMMM YYYY')}
                                                </span>
                                            </Typography>

                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {course.courseTimeFrom} to {course.courseTimeTo}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <LocationOn sx={{ mr: 1 }} />
                                            <Typography>
                                                {course.location}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                            <People sx={{ mr: 1 }} />
                                            <Typography>
                                                Max Participants: {course.maxParticipants}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                            {course.courseDescription}
                                        </Typography>

                                        <Divider />

                                        {course.termsAndConditions && (
                                            <Typography sx={{ whiteSpace: 'pre-wrap', mb: 1, color: 'red', fontSize: '13px' }}>
                                                {course.termsAndConditions}
                                            </Typography>
                                        )}

                                        <Typography sx={{ whiteSpace: 'pre-wrap', fontStyle: 'italic' }} color={renderCourseStatusIconAndColor(course.courseStatus).color}>
                                            Course Status: {course.courseStatus}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            {renderCourseStatusIconAndColor(course.courseStatus).icon}
                                            <Typography sx={{ whiteSpace: 'pre-wrap', fontWeight: 'bold', color: renderCourseStatusIconAndColor(course.courseStatus).color, ml: 1 }}>
                                                {course.courseStatus.charAt(0).toUpperCase() + course.courseStatus.slice(1)}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{ color: 'limegreen', '&:hover': { textDecoration: 'underline' } }}>
                                            <Link to={`/UserCourseDetails/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                View Details
                                            </Link>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

export default Courses;
