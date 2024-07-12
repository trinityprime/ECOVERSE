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




const fileRoute = require('./routes/file');
app.use("/file", fileRoute);


const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });