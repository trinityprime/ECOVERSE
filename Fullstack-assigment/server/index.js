require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Routes
const userEventRoute = require('./routes/userEvent');
app.use("/userEvent", userEventRoute);

const signUpRoute = require('./routes/signup');
app.use("/signup", signUpRoute);

const courseRoute = require('./routes/course');
app.use("/course", courseRoute);

const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const reportRoute = require('./routes/report');
app.use("/report", reportRoute);

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const profileRoute = require('./routes/profile');
app.use('/profile', profileRoute);

const adminRoute = require('./routes/admin');
app.use('/admin', adminRoute);

const initializeAdminAccount = require('./initializeAdmin'); 

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const fileRoute = require('./routes/file');
app.use("/file", fileRoute);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(async () => {
        await initializeAdminAccount();
        const port = process.env.APP_PORT || 3000;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Database synchronization error:', err);
    });
