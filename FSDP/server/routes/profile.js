const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/auth');
const db = require('../models'); // Ensure this path is correct

router.get('/profile', validateToken, async (req, res) => {
    try {
        // Ensure req.user.id is set by validateToken middleware
        const user = await db.User.findByPk(req.user.id); // Use findByPk for Sequelize
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error fetching user:', err); // Add logging for debugging
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
