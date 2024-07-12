const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const yup = require("yup");

// POST /events endpoint to create a new event
router.post("/", async (req, res) => {
    try {
        let data = req.body;
        
        // Capitalize eventStatus field if present and valid
        if (data.eventStatus) {
            data.eventStatus = data.eventStatus.charAt(0).toUpperCase() + data.eventStatus.slice(1).toLowerCase();
        }
        
        // Validate request body
        const validationSchema = yup.object({
            eventName: yup.string().trim().min(3).max(100).required(),
            eventType: yup.string().trim().min(3).max(50).required(),
            eventDescription: yup.string().trim().min(3).required(),
            eventDate: yup.date().required(),
            eventTimeFrom: yup.string().trim().required(),
            eventTimeTo: yup.string().trim().required(),
            location: yup.string().trim().min(3).max(100).required(),
            maxParticipants: yup.number().integer().positive().required(),
            organizerDetails: yup.string().trim().min(3).max(100).required(),
            termsAndConditions: yup.string().trim().min(3).required(),
            eventStatus: yup.string().trim().oneOf(['Ongoing', 'Scheduled', 'Cancelled', 'Completed', 'Postponed']).required()
        });

        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Event.create(data);
        res.json(result);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(400).json({ errors: err.errors });
    }
});

// PUT /events/:id endpoint to update individual event by ID
router.put("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = req.body;
        
        // Capitalize eventStatus field if present and valid
        if (data.eventStatus) {
            data.eventStatus = data.eventStatus.charAt(0).toUpperCase() + data.eventStatus.slice(1).toLowerCase();
        }
        
        // Validate request body
        const validationSchema = yup.object({
            eventName: yup.string().trim().min(3).max(100),
            eventType: yup.string().trim().min(3).max(50),
            eventDescription: yup.string().trim().min(3),
            eventDate: yup.date(),
            eventTimeFrom: yup.string().trim(),
            eventTimeTo: yup.string().trim(),
            location: yup.string().trim().min(3).max(100),
            maxParticipants: yup.number().integer().positive(),
            organizerDetails: yup.string().trim().min(3).max(100),
            termsAndConditions: yup.string().trim().min(3),
            eventStatus: yup.string().trim().oneOf(['Ongoing', 'Scheduled', 'Cancelled', 'Completed', 'Postponed'])
        });

        data = await validationSchema.validate(data, { abortEarly: false });
        
        let num = await Event.update(data, { where: { id: id } });
        
        if (num == 1) {
            res.json({ message: "Event was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update event with id ${id}.` });
        }
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ errors: err.errors });
    }
});

// GET /events endpoint to fetch all events
router.get("/", async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ errors: err.errors });
    }
});

// GET /events/:id endpoint to fetch single event by ID
router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const event = await Event.findByPk(id);
        
        if (!event) {
            console.error(`Event with id ${id} not found`);
            res.sendStatus(404);
            return;
        }
        
        res.json(event);
    } catch (err) {
        console.error(`Error fetching event with id ${id}:`, err);
        res.status(500).json({ errors: err.errors });
    }
});

// DELETE /events/:id endpoint to delete single event by ID
router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const event = await Event.findByPk(id);
        
        if (!event) {
            console.error(`Event with id ${id} not found`);
            res.sendStatus(404);
            return;
        }
        
        await event.destroy();
        res.json({ message: `Event with id ${id} deleted successfully.` });
    } catch (err) {
        console.error(`Error deleting event with id ${id}:`, err);
        res.status(500).json({ errors: err.errors });
    }
});

// DELETE /events endpoint to delete all events
router.delete("/", async (req, res) => {
    try {
        await Event.destroy({ where: {} });
        res.json({ message: "All events deleted successfully." });
    } catch (err) {
        console.error('Error deleting all events:', err);
        res.status(500).json({ errors: err.errors });
    }
});

module.exports = router;
