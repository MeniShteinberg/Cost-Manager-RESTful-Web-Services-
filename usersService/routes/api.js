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
router.get('/users/:id', function (req, res, next) {
    const userId = req.params.id; // Extracts the ID from the URL
    User.findOne({ id: userId }, '-_id -__v') // Finds one user by their numeric ID
        .then(function (user) {
            if (!user) {
                return res.status(404).send({
                    status: 404,
                    message: "User not found"
                });
            }

            const totalCosts = 0;

            // Placeholder for total calculation logic
            // In the future, you will pull data from the costs service here

            res.json({
                first_name: user.first_name,
                last_name: user.last_name,
                id: user.id,
                birthday: user.birthday,
                total: totalCosts
            });
        })
        .catch(next); // Passes any server errors to the error handler
});

module.exports = router;