import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Input,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
} from "@mui/material";
import {
    AccountCircle,
    AccessTime,
    Search,
    Clear,
    EventAvailable,
    LocationOn,
    People,
    Pending,
    PauseCircle,
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

function Events() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState({});
    const [skills, setSkills] = useState({});
    const [sortBy, setSortBy] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:3001/event");
            const eventsData = response.data;
            setEvents(eventsData);
            setFilteredEvents(eventsData); // Initialize filtered events with all events
            processCategoriesAndSkills(eventsData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching events:", error);
            setError("Error fetching events");
            setLoading(false);
        }
    };

    const processCategoriesAndSkills = (eventsData) => {
        const categoryCounts = eventsData.reduce((acc, event) => {
            const category = event.eventType;
            if (!acc[category]) acc[category] = 0;
            acc[category]++;
            return acc;
        }, {});

        const allSkills = eventsData.flatMap((event) => event.skills || []);
        const skillCounts = allSkills.reduce((acc, skill) => {
            if (!acc[skill]) acc[skill]++;
            else acc[skill]++;
            return acc;
        }, {});

        setCategories(categoryCounts);
        setSkills(skillCounts);
    };

    const applyFilters = () => {
        let filteredResults = [...events];

        // Apply search filter
        if (search.trim() !== "") {
            filteredResults = filteredResults.filter((event) =>
                event.eventName.toLowerCase().includes(search.trim().toLowerCase())
            );
        }

        // Apply sort filter
        if (sortBy !== "") {
            switch (sortBy) {
                case "scheduled":
                    filteredResults = filteredResults.filter(
                        (event) => event.eventStatus === "Scheduled"
                    );
                    break;
                case "ongoing":
                    filteredResults = filteredResults.filter(
                        (event) => event.eventStatus === "Ongoing"
                    );
                    break;
                case "completed":
                    filteredResults = filteredResults.filter(
                        (event) => event.eventStatus === "Completed"
                    );
                    break;
                case "postponed":
                    filteredResults = filteredResults.filter(
                        (event) => event.eventStatus === "Postponed"
                    );
                    break;
                case "cancelled":
                    filteredResults = filteredResults.filter(
                        (event) => event.eventStatus === "Cancelled"
                    );
                    break;
                default:
                    break;
            }
        }

        // Apply location filter
        if (locationFilter !== "") {
            filteredResults = filteredResults.filter(
                (event) => event.location.toLowerCase() === locationFilter.toLowerCase()
            );
        }

        // Apply month filter
        if (monthFilter !== "") {
            filteredResults = filteredResults.filter(
                (event) => dayjs(event.eventDate).month() === parseInt(monthFilter)
            );
        }

        setFilteredEvents(filteredResults);
    };

    useEffect(() => {
        applyFilters();
    }, [events, search, sortBy, locationFilter, monthFilter]);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const onClickSearch = () => {
        applyFilters();
    };

    const onClickClear = () => {
        setSearch("");
        setSortBy("");
        setLocationFilter("");
        setMonthFilter("");
        applyFilters();
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

    const renderEventStatusIconAndColor = (eventStatus) => {
        switch (eventStatus.toLowerCase()) {
            case "scheduled":
                return { icon: <EventAvailable />, color: "orange" };
            case "ongoing":
                return { icon: <Pending />, color: "blue" };
            case "completed":
                return { icon: <CheckCircleIcon />, color: "green" };
            case "postponed":
                return { icon: <PauseCircle />, color: "orange" };
            case "cancelled":
                return { icon: <CancelIcon />, color: "red" };
            default:
                return { icon: <EventAvailable />, color: "text.secondary" };
        }
    };

    if (loading) {
        return <p>Loading events...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Events
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Input
                    value={search}
                    placeholder="Search for events..."
                    onChange={onSearchChange}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="body2" sx={{ mr: 2 }}>
                    <span style={{ fontWeight: "bold" }}>{filteredEvents.length}</span>{" "}
                    results found
                </Typography>

                <Box sx={{ flexGrow: 15 }} />

                <FormControl sx={{ mr: 2 }}>
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
                <FormControl sx={{ mr: 2 }}>
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
                        {Array.from({ length: 12 }, (_, i) => (
                            <MenuItem key={i} value={i}>
                                {dayjs().month(i).format("MMMM")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {filteredEvents.length === 0 ? (
                <Typography>
                    No events found. Please try again by changing the filters.
                </Typography>
            ) : (
                <Box sx={{ display: "flex", mb: 4 }}>
                    <Box sx={{ minWidth: 200, mr: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Top Categories
                        </Typography>
                        {Object.keys(categories).map((category, index) => (
                            <Typography key={index} variant="body2" gutterBottom>
                                {category} ({categories[category]})
                            </Typography>
                        ))}

                        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                            Skills
                        </Typography>
                        {Object.keys(skills).map((skill, index) => (
                            <Typography key={index} variant="body2" gutterBottom>
                                {skill} ({skills[skill]})
                            </Typography>
                        ))}
                    </Box>

                    <Grid container spacing={3}>
                        {filteredEvents.map((event) => (
                            <Grid item xs={12} md={6} lg={4} key={event.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6">{event.eventName}</Typography>
                                        </Box>

                                        <Box>
                                            {event.imageFile ? (
                                                <Box
                                                    className="aspect-ratio-container"
                                                    sx={{ marginBottom: 2 }}
                                                >
                                                    <img
                                                        alt="event"
                                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${event.imageFile
                                                            }`}
                                                        style={{
                                                            maxWidth: "100%", // ensures the image scales down to fit the container
                                                            maxHeight: "400px", // adjust the height as needed
                                                            objectFit: "contain", // maintains aspect ratio
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        marginTop: 3,
                                                        marginBottom: 3,
                                                        textAlign: "center",
                                                        fontStyle: "italic",
                                                    }}
                                                >
                                                    No image is available or added for this event.
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box
                                            sx={{
                                                marginTop: 3,
                                                marginBottom: 3,
                                                borderRadius: "5px",
                                                padding: "3px 8px",
                                                background: "#f0f0f0",
                                                marginRight: "10px",
                                            }}
                                        >
                                            {event.eventType}
                                        </Box>

                                        <Box
                                            sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                                            color="text.secondary"
                                        >
                                            <AccountCircle sx={{ mr: 1, mt: 0.5 }} />
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: "bold" }}
                                                >
                                                    Organizer Details:
                                                </Typography>
                                                <Typography variant="body2" color="text.primary">
                                                    {event.organizerDetails}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box
                                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                                            color="text.secondary"
                                        >
                                            <EventAvailable sx={{ mr: 1 }} />
                                            <Typography>
                                                {dayjs(event.eventDate).format("DD MMMM YYYY")}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                                            color="text.secondary"
                                        >
                                            <AccessTime sx={{ mr: 1 }} />
                                            <Typography>
                                                {event.eventTimeFrom} to {event.eventTimeTo}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                                            color="text.secondary"
                                        >
                                            <LocationOn sx={{ mr: 1 }} />
                                            <Typography>{event.location}</Typography>
                                        </Box>

                                        <Box
                                            sx={{ display: "flex", alignItems: "center", mb: 1 }}
                                            color="text.secondary"
                                        >
                                            <People sx={{ mr: 1 }} />
                                            <Typography>
                                                Max Participants: {event.maxParticipants}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
                                            {event.eventDescription}
                                        </Typography>

                                        {event.termsAndConditions && (
                                            <>
                                                <Divider sx={{ mt: 2, mb: 1 }}>
                                                    Terms and Conditions:
                                                </Divider>
                                                <Typography
                                                    sx={{
                                                        whiteSpace: "pre-wrap",
                                                        mb: 1,
                                                        color: "red",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {event.termsAndConditions}
                                                </Typography>
                                            </>
                                        )}

                                        <Divider sx={{ mt: 2 }} />
                                        <Typography
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                fontStyle: "italic",
                                                marginTop: "5px",
                                                color: renderEventStatusIconAndColor(event.eventStatus)
                                                    .color,
                                            }}
                                        >
                                            Event Status: {event.eventStatus}
                                        </Typography>

                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            {renderEventStatusIconAndColor(event.eventStatus).icon}
                                            <Typography
                                                sx={{
                                                    whiteSpace: "pre-wrap",
                                                    fontWeight: "bold",
                                                    color: renderEventStatusIconAndColor(
                                                        event.eventStatus
                                                    ).color,
                                                    ml: 1,
                                                }}
                                            >
                                                {event.eventStatus.charAt(0).toUpperCase() +
                                                    event.eventStatus.slice(1)}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            sx={{
                                                color: "limegreen",
                                                "&:hover": { textDecoration: "underline" },
                                            }}
                                        >
                                            <Link
                                                to={`/UserEventDetails/${event.id}`}
                                                style={{ textDecoration: "none", color: "inherit" }}
                                            >
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

export default Events;
