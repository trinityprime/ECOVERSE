const express = require("express");
const cors = require("cors");
const { Sequelize, Op } = require("sequelize");
const db = require("./models"); 
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Simple Route
app.get("/", (req, res) => {
  res.send("Welcome to the learning space.");
});

// Example backend route definition
app.get("/events", async (req, res) => {
  try {
    // Fetch events from the database using Sequelize model
    const events = await db.Event.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events." });
  }
});

// Fetch a single event by ID from the database using Sequelize
app.get('/events/:id', async (req, res) => {
  const eventId = parseInt(req.params.id);
  try {
    const event = await db.Event.findByPk(eventId);
    if (event) {
      res.json(event);
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event.' });
  }
});

// Create a new event
app.post('/events', async (req, res) => {
  const eventData = req.body;

  try {
    const newEvent = await db.Event.create(eventData);
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Update an existing event by ID
app.put('/events/:id', async (req, res) => {
  const eventId = parseInt(req.params.id);
  const updatedEventData = req.body;

  try {
    const event = await db.Event.findByPk(eventId);
    if (event) {
      await event.update(updatedEventData);
      res.status(200).json({ message: 'Event updated successfully', event: event });
    } else {
      res.status(404).json({ error: `Event with id ${eventId} not found` });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete an event by ID
app.delete('/events/:id', async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    const event = await db.Event.findByPk(eventId);
    if (event) {
      await event.destroy();
      res.status(200).json({ message: 'Event deleted successfully' });
    } else {
      res.status(404).json({ error: `Event with id ${eventId} not found` });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// Example endpoint to fetch event details by ID
app.get('/event/export/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
      const event = await db.Event.findByPk(eventId);
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }
      // Assuming you want to export the event data in JSON format
      res.json(event);
  } catch (error) {
      console.error('Error exporting event:', error);
      res.status(500).json({ message: 'Failed to export event' });
  }
});

// Course Routes (similar to events)
app.get("/courses", async (req, res) => {
  try {
    // Fetch courses from the database using Sequelize model
    const courses = await db.Course.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
});

// Fetch a single course by ID from the database using Sequelize
app.get('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  try {
    const course = await db.Course.findByPk(courseId);
    if (course) {
      res.json(course);
    } else {
      res.status(404).send('Course not found');
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Failed to fetch course.' });
  }
});

// Create a new course
app.post('/courses', async (req, res) => {
  const courseData = req.body;

  try {
    const newCourse = await db.Course.create(courseData);
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
});

// Update an existing course by ID
app.put('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  const updatedCourseData = req.body;

  try {
    const course = await db.Course.findByPk(courseId);
    if (course) {
      await course.update(updatedCourseData);
      res.status(200).json({ message: 'Course updated successfully', course: course });
    } else {
      res.status(404).json({ error: `Course with id ${courseId} not found` });
    }
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Failed to update course' });
  }
});

// Delete a course by ID
app.delete('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);

  try {
    const course = await db.Course.findByPk(courseId);
    if (course) {
      await course.destroy();
      res.status(200).json({ message: 'Course deleted successfully' });
    } else {
      res.status(404).json({ error: `Course with id ${courseId} not found` });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
});


// Routes for other resources
const tutorialRoute = require("./routes/tutorial");
app.use("/tutorial", tutorialRoute);
const userRoute = require("./routes/user");
app.use("/user", userRoute);
const fileRoute = require("./routes/file");
app.use("/file", fileRoute);
const eventRoute = require("./routes/event");
app.use("/event", eventRoute);
const courseRoute = require("./routes/course");
app.use("/course", courseRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Sequelize synchronization and server start
db.sequelize
  .sync({ alter: true })
  .then(() => {
    let port = process.env.APP_PORT || 3001; // Use default port 3001 if APP_PORT is not defined
    app.listen(port, () => {
      console.log(`⚡ Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
