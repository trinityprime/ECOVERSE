const express = require('express');
const router = express.Router();

// Since we're removing user authentication, we can remove most of the user-related routes
// However, we might want to keep a simple route to get user information for display purposes

router.get("/", async (req, res) => {
    res.json({
        message: "User authentication has been removed from this application."
    });
});

module.exports = router;