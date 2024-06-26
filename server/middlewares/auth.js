const jwt = require('jsonwebtoken');
const { APP_SECRET } = process.env;

const validateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assuming token is in format "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, APP_SECRET);
        req.user = decoded; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token Verification Error:', err);
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

module.exports = { validateToken };
