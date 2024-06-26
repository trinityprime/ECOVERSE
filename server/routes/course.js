const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

// POST /courses endpoint to create a new course
router.post("/", validateToken, async (req, res) => {
    try {
        let data = req.body;
        data.Id = req.id;
        
        // Capitalize courseStatus field if present and valid
        if (data.courseStatus) {
            data.courseStatus = data.courseStatus.charAt(0).toUpperCase() + data.courseStatus.slice(1).toLowerCase();
        }
        
        // Simplified validation schema without strict date validation
        const validationSchema = yup.object({
            courseName: yup.string().trim().min(3).max(100).required(),
            courseType: yup.string().trim().min(3).max(50).required(),
            courseDescription: yup.string().trim().min(3).required(),
            courseStartDate: yup.string().trim().required(), // Treat as string, ensure format
            courseEndDate: yup.string().trim().required(), // Treat as string, ensure format
            courseTimeFrom: yup.string().trim().required(),
            courseTimeTo: yup.string().trim().required(),
            location: yup.string().trim().min(3).max(100).required(),
            maxParticipants: yup.number().integer().positive().required(),
            organizerDetails: yup.string().trim().min(3).max(100).required(),
            termsAndConditions: yup.string().trim().min(3).required(),
            courseStatus: yup.string().trim().oneOf(['Ongoing', 'Scheduled', 'Cancelled', 'Completed', 'Postponed']).required(),
            imageFile: yup.string().trim().nullable().notRequired()
        });

        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Course.create(data);
        res.json(result);
    } catch (err) {
        console.error('Error creating course:', err);
        res.status(400).json({ errors: err.errors });
    }
});

// PUT /courses/:id endpoint to update individual course by ID
router.put("/:id", validateToken, async (req, res) => {
    try {
        let id = req.params.id;
        let Id = req.id;
        let data = req.body;
        
        // Capitalize courseStatus field if present and valid
        if (data.courseStatus) {
            data.courseStatus = data.courseStatus.charAt(0).toUpperCase() + data.courseStatus.slice(1).toLowerCase();
        }
        
        // Simplified validation schema without strict date validation
        const validationSchema = yup.object({
            courseName: yup.string().trim().min(3).max(100).required(),
            courseType: yup.string().trim().min(3).max(50).required(),
            courseDescription: yup.string().trim().min(3).required(),
            courseStartDate: yup.string().trim().required(), // Treat as string, ensure format
            courseEndDate: yup.string().trim().required(), // Treat as string, ensure format
            courseTimeFrom: yup.string().trim().required(),
            courseTimeTo: yup.string().trim().required(),
            location: yup.string().trim().min(3).max(100).required(),
            maxParticipants: yup.number().integer().positive().required(),
            organizerDetails: yup.string().trim().min(3).max(100).required(),
            termsAndConditions: yup.string().trim().min(3).required(),
            courseStatus: yup.string().trim().oneOf(['Ongoing', 'Scheduled', 'Cancelled', 'Completed', 'Postponed']).required(),
            imageFile: yup.string().trim().nullable().notRequired()
        });

        data = await validationSchema.validate(data, { abortEarly: false });
        
        let [num] = await Course.update(data, { where: { id: id, Id: Id } });
        
        if (num === 1) {
            res.json({ message: "Course was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update course with id ${id}.` });
        }
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ errors: err.errors });
    }
});

// GET /courses endpoint to fetch all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ errors: err.errors });
    }
});

// GET /courses/:id endpoint to fetch single course by ID
router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const course = await Course.findByPk(id);
        
        if (!course) {
            console.error(`Course with id ${id} not found`);
            res.sendStatus(404);
            return;
        }
        
        res.json(course);
    } catch (err) {
        console.error(`Error fetching course with id ${id}:`, err);
        res.status(500).json({ errors: err.errors });
    }
});

// DELETE /courses/:id endpoint to delete single course by ID
router.delete("/:id", validateToken, async (req, res) => {
    try {
        let id = req.params.id;
        let Id = req.id;
        const course = await Course.findOne({ where: { id: id, Id: Id } });
        
        if (!course) {
            console.error(`Course with id ${id} not found`);
            res.sendStatus(404);
            return;
        }
        
        await course.destroy();
        res.json({ message: `Course with id ${id} deleted successfully.` });
    } catch (err) {
        console.error(`Error deleting course with id ${id}:`, err);
        res.status(500).json({ errors: err.errors });
    }
});

// DELETE /courses endpoint to delete all courses
router.delete("/", validateToken, async (req, res) => {
    try {
        await Course.destroy({ where: {} });
        res.json({ message: "All courses deleted successfully." });
    } catch (err) {
        console.error('Error deleting all courses:', err);
        res.status(500).json({ errors: err.errors });
    }
});

module.exports = router;
