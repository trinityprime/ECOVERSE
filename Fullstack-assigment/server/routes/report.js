const express = require('express');
const router = express.Router();
const {  Report } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        incidentType: yup.string().oneOf(["Environmental Incident", "Resources Management", "Others"]).required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Report.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await Report.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        // include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let report = await Report.findByPk(id, {
        // include: { model: User, as: "user", attributes: ['name'] }
    });
    if (!report) {
        res.sendStatus(404);
        return;
    }
    res.json(report);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let report = await Report.findByPk(id);
    if (!report) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        title: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500),
        incidentType: yup.string().oneOf(["Environmental Incident", "Resources Management", "Others"])
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        let num = await Report.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Report was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update report with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let report = await Report.findByPk(id);
    if (!report) {
        res.sendStatus(404);
        return;
    }

    let num = await Report.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Report was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Report with id ${id}.`
        });
    }
});

module.exports = router;