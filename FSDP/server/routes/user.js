const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const { User } = require('../models');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();

const yup = require("yup");

router.post("/register", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim()
            .min(3).max(50)
            .required()
            .matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces and characters: ' - , ."),
        email: yup.string().trim()
            .lowercase()
            .email()
            .max(50)
            .required(),
        password: yup.string().trim()
            .min(8)
            .max(50)
            .required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "Password must contain at least 1 letter and 1 number"),
        role: yup.string().trim()
            .oneOf(['volunteer', 'organization'])
            .required(),
        phoneNumber: yup.string().trim()
            .required()
            .matches(/^\d{8}$/, "Phone number must be 8 digits"),
        dob: yup.date()
            .nullable()
            .required("Date of birth is required")
            .typeError("Invalid Date."),
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Additional logic for admin registration if needed
        if (data.role === 'admin') {
            res.status(403).json({ message: "Admin registration not allowed." });
            return;
        }

        // Hash password
        data.password = await bcrypt.hash(data.password, 10);

        // Create user
        let result = await User.create(data);
        res.status(201).json({
            message: `User registered successfully.`,
            user: result
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
    }
});


router.post("/login", async (req, res) => {
    let data = req.body;
    // Check email and password
    let errorMsg = "Email or password is not correct.";
    let user = await User.findOne({
        where: { email: data.email }
    });
    if (!user) {
        res.status(400).json({ message: errorMsg });
        return;
    }
    let match = await bcrypt.compare(data.password, user.password);
    if (!match) {
        res.status(400).json({ message: errorMsg });
        return;
    }
    // Return user info
    let userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        dob: user.dob,
        role: user.role,
    };
    let accessToken = sign(userInfo, process.env.APP_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES_IN });
    res.json({
        accessToken: accessToken,
        user: userInfo
    });
});

router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
        dob: req.user.dob,
        role: req.user.role
    };
    res.json({
        user: userInfo
    });
});

module.exports = router;