const { UserEvent } = require('../models');
const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const yup = require("yup");

// Route to create a new event
router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        eventName: yup.string().trim().min(3).max(100).required(),
        eventPax: yup.number().min(1).max(1000).required(),
        eventAddress: yup.string().trim().min(3).max(100).required(),
        eventDate: yup.date().required(),
        eventDescription: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await UserEvent.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Route to get all events
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { eventName: { [Op.like]: `%${search}%` } },
            { eventPax: { [Op.like]: `%${search}%` } },
            { eventAddress: { [Op.like]: `%${search}%` } },
            { eventDate: { [Op.like]: `%${search}%` } },
            { eventDescription: { [Op.like]: `%${search}%` } }
        ];
    }
    let list = await UserEvent.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

// Route to get a single event by ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await UserEvent.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});

// Route to update an event by ID
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await UserEvent.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    let num = await UserEvent.update(data, { where: { id: id } });
    if (num == 1) {
        res.json({ message: "Event was updated successfully." });
    } else {
        res.status(400).json({ message: `Cannot update Event with id ${id}.` });
    }
});

// Route to delete an event by ID
router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let num = await UserEvent.destroy({ where: { id: id } });
        if (num == 1) {
            res.json({ message: "Event was deleted successfully." });
        } else {
            res.status(404).json({ message: `Event with id ${id} was not found.` });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while trying to delete the event.",
            error: error.message
        });
    }
});

module.exports = router;
