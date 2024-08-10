const { SignUp, User } = require('../models');
const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// Route to create a new sign-up
router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id; // Associate the sign-up with the authenticated user

    let validationSchema = yup.object({
        Name: yup.string().trim().min(3).max(100).required(),
        MobileNumber: yup.string().trim().required(), // Changed to string to handle different formats
        Email: yup.string().email().required(),
        numberOfPax: yup.number().min(1).required(),
        specialRequirements: yup.string().trim().max(500),
        eventCourseName: yup.string().trim().min(3).max(100).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await SignUp.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Route to get all sign-ups
router.get("/", validateToken, async (req, res) => {
    let condition = {};
    if (req.user.role !== 'admin') {
        // Non-admin users only see their own sign-ups
        condition.userId = req.user.id;
    }

    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { Name: { [Op.like]: `%${search}%` } },
            { MobileNumber: { [Op.like]: `%${search}%` } },
            { Email: { [Op.like]: `%${search}%` } },
            { numberOfPax: { [Op.like]: `%${search}%` } },
            { specialRequirements: { [Op.like]: `%${search}%` } },
            { eventCourseName: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        let list = await SignUp.findAll({
            where: condition,
            order: [['createdAt', 'DESC']],
            include: { model: User, as: "user", attributes: ['name'] } // Include user details
        });
        res.json(list);
    } catch (error) {
        console.error('Error fetching sign-ups:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get a single sign-up by ID
router.get("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let signUp = await SignUp.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] } // Include user details
    });

    if (!signUp || (signUp.userId !== req.user.id && req.user.role !== 'admin')) { // Ensure the sign-up belongs to the authenticated user or if admin
        res.sendStatus(403); // Forbidden if the sign-up doesn't belong to the user or if not an admin
        return;
    }

    res.json(signUp);
});

// Route to update a sign-up by ID
router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let signUp = await SignUp.findByPk(id);

    if (!signUp || (signUp.userId !== req.user.id && req.user.role !== 'admin')) { // Ensure the sign-up belongs to the authenticated user or if admin
        res.sendStatus(403); // Forbidden if the sign-up doesn't belong to the user or if not an admin
        return;
    }

    let data = req.body;
    try {
        let num = await SignUp.update(data, { where: { id: id } });

        if (num[0] === 1) {
            res.json({ message: "SignUp was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update SignUp with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ error: 'Error updating sign-up' });
    }
});

// Route to delete a sign-up by ID
router.delete("/:id", validateToken, async (req, res) => {
    try {
        let id = req.params.id;
        let signUp = await SignUp.findByPk(id);

        if (!signUp || (signUp.userId !== req.user.id && req.user.role !== 'admin')) { // Ensure the sign-up belongs to the authenticated user or if admin
            res.sendStatus(403); // Forbidden if the sign-up doesn't belong to the user or if not an admin
            return;
        }

        let num = await SignUp.destroy({ where: { id: id } });

        if (num === 1) {
            res.json({ message: "SignUp was deleted successfully." });
        } else {
            res.status(404).json({ message: `SignUp with id ${id} was not found.` });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while trying to delete the signUp.",
            error: error.message
        });
    }
});

module.exports = router;
