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

router.put('/profile', async (req, res) => {
    const userId = req.user.id; 
    const { name, email, phoneNumber, dob, password } = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user properties
        user.name = name;
        user.email = email;
        user.phone = phoneNumber;
        user.dob = dob;

        // Update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Save updated user
        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Failed to update user' });
    }
});

router.delete('/profile', async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user
        await user.destroy();

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});


module.exports = router;


