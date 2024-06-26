const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();

router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }

        // Hash password
        data.password = await bcrypt.hash(data.password, 10);

        // Set isAdmin field based on email
        if (data.email.includes("admin")) {
            data.isAdmin = true;
        }

        // Create user
        let result = await User.create(data);
        res.json({
            message: `Email ${result.email} was registered successfully.`
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

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
            isAdmin: user.isAdmin  // Include isAdmin
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        isAdmin: req.user.isAdmin  // Include isAdmin
    };
    res.json({
        user: userInfo
    });
});


router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    };
    res.json({
        user: userInfo
    });
});

module.exports = router;
