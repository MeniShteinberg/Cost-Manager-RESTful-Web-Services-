//Importing the express framework
const express = require('express');
//Create a new router object
const router = express.Router();
//Imports the user DB file from inside the model folder 
const User = require('../models/usersDb');
//Importing the logAndSaveToDb function from the logs file
const { logAndSaveToDb } = require('../../logsService/logs')

// POST /api/add - Adding a new user
router.post('/add', function (req, res, next) {
    User.create(req.body)
        .then(function (newUser) {
            // Log successful access to the database
            logAndSaveToDb('info', 'Endpoint Accessed: user added', {});
            res.status(201).send(newUser);
        })
        .catch(function (error) {
            // Check for Duplicate ID (Mongo Error Code 11000)
            if (error.code === 11000) {
                logAndSaveToDb('error', 'Failed to add new user: Duplicate User ID', { id: req.body.id });
                return res.status(400).send({
                    id: 4,
                    message: `User already exists. The ID ${req.body.id} is already taken.`
                });
            }

            // Check for Missing Parameters or Validation Errors
            if (error.name === 'ValidationError') {
                // Determine if the error is specifically about the birthday validator
                const isFutureDate = error.errors.birthday && error.errors.birthday.kind === 'user defined';

                if (isFutureDate) {
                    //Check for Future Date
                    logAndSaveToDb('error', 'Failed to add user: Birthday is in the future', { birthday: req.body.birthday });
                    return res.status(400).send({
                        id: 4,
                        message: 'Invalid birthday. The date must be in the past.'
                    });
                } else {
                    // Missing Parameters (first_name, last_name,ID)
                    logAndSaveToDb('error', 'Failed to add user: Missing required parameters', { details: error.message });
                    return res.status(400).send({
                        id: 4,
                        message: 'Missing parameters. Please ensure all required fields are filled.'
                    });
                }
            }
            // General fallback for other unexpected errors
            next(error);
        });
});

// GET /api/users - List of users
router.get('/users', function (req, res, next) {
    User.find({}, '-_id -__v')
        .then(function (users) {
            //Endpoint is accessed Successfully log 
            logAndSaveToDb('info', 'Endpoint Accessed: got The list of users', {});
            // Sends the array of users as a JSON response.
            res.json(users);
        })
        .catch(next);// Passes any server errors to the error logger.
});

const Cost = require('../../costsService/models/costsDb'); // Import the Cost model

// GET /api/users/:id - returns a specific user
router.get('/users/:id', async function (req, res, next) {
    const userId = parseInt(req.params.id); // Ensure ID is a number

    try {
        //Find the User inside the database
        const user = await User.findOne({ id: userId });
        if (!user) {
            //error log that the user was not found
            logAndSaveToDb('error', 'Failed: User not found', { id });
            //error 404 not fund message
            return res.status(404).send({
                id: 3,
                message: 'User ' + id + 'not found.'
            });
        }

        //Calculate the Total Cost using Aggregation
        const costData = await Cost.aggregate([
            { $match: { userid: userId } }, // Find all costs for this user
            { $group: { _id: null, total: { $sum: "$sum" } } } // Sum the 'sum' fields
        ]);

        //Extract the total (or 0 if no costs exist)
        const totalAmount = costData.length > 0 ? costData[0].total : 0;

        //Send the final combined response

        //Endpoint is accessed Successfully log
        logAndSaveToDb('info', 'Endpoint Accessed: got The details of a specific user', {});
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