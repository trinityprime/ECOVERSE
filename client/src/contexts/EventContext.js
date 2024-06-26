// EventContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import http from '../http';

const EventsContext = createContext();

export const useEvents = () => {
    return useContext(EventsContext);
};

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);

    const fetchEvents = () => {
        http.get('/events')
            .then((res) => {
                setEvents(res.data);
            })
            .catch((err) => {
                console.error('Error fetching events:', err);
            });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <EventsContext.Provider value={{ events, setEvents, fetchEvents }}>
            {children}
        </EventsContext.Provider>
    );
};
