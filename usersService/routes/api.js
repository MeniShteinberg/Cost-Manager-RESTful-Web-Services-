const express = require('express');
const router = express.Router();
const User = require('../models/usersDb');

// POST /api/add - Adding a new user
router.post('/add', function (req, res, next) {
    User.create(req.body)
        .then(function (newUser) {
            res.status(201).send(newUser);
        })
        .catch(function (error) {
            res.status(400).send({
                error: 'Problam adding a new user',
                details: error.message
            });
        });
});

// GET /api/users - List of users
router.get('/users', function (req, res, next) {
    User.find({}, '-_id -__v')
        .then(function (users) {
            res.json(users);
        })
        .catch(next);
});

// GET /api/users/:id - Get details of a specific user
const Cost = require('../../costsService/models/costsDB'); // Import the Cost model

router.get('/users/:id', async function (req, res, next) {
    const userId = parseInt(req.params.id); // Ensure ID is a number

    try {
        // 1. Find the User
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found" });
        }

        // 2. Calculate the Total Cost using Aggregation
        const costData = await Cost.aggregate([
            { $match: { userid: userId } }, // Find all costs for this user
            { $group: { _id: null, total: { $sum: "$sum" } } } // Sum the 'sum' fields
        ]);

        // 3. Extract the total (or 0 if no costs exist)
        const totalAmount = costData.length > 0 ? costData[0].total : 0;

        // 4. Send the final combined response
        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            birthday: user.birthday,
            total: totalAmount
        });

    } catch (error) {
        next(error);
    }
});
module.exports = router;