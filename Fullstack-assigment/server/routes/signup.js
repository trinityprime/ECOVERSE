const { SignUp } = require('../models');
const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        Name: yup.string().trim().min(3).max(100).required(),
        MobileNumber: yup.number().required(),
        Email: yup.string().email().required(),
        numberOfPax: yup.number().min(1).required(),
        specialRequirements: yup.string().trim().max(500),
        eventCourseName: yup.string().trim().min(3).max(100).required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await SignUp.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { Name: { [Op.like]: `%${search}%` } },
            { MobileNumber: { [Op.like]: `%${search}%` } },
            { Email: { [Op.like]: `%${search}%` } },
            { numberOfPax: { [Op.like]: `%${search}%` } },
            { specialRequirements: { [Op.like]: `%${search}%` } },
            { eventCourseName: { [Op.like]: `%${search}%` } }
        ];
    }
    let list = await SignUp.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let signUp = await SignUp.findByPk(id);
    if (!signUp) {
        res.sendStatus(404);
        return;
    }
    res.json(signUp);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let signUp = await SignUp.findByPk(id);
    if (!signUp) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    let num = await SignUp.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "SignUp was updated successfully."
        });
    } else {
        res.status(400).json({
            message: `Cannot update SignUp with id ${id}.`
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let num = await SignUp.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.json({
                message: "SignUp was deleted successfully."
            });
        } else {
            res.status(404).json({
                message: `SignUp with id ${id} was not found.`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while trying to delete the signUp.",
            error: error.message
        });
    }
});

module.exports = router;
