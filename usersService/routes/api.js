//Importing the express framework
const express = require('express');
//Create a new router object
const router = express.Router();
//Imports the user DB file from inside the model folder 
const user = require('../models/usersDb');
//Importing the logAndSaveToDb function from the logs file
const { logAndSaveToDb } = require('../../logsService/logs')

// POST /api/add - Adding a new user
router.post('/add', function (req, res, next) {
    user.create(req.body)
        .then(function (newUser) {
            // Log successful access to the database
            logAndSaveToDb('info', 'Endpoint Accessed: user added', {});
            const newUserResponse = newUser.toObject();
            delete newUserResponse.__v;
            delete newUserResponse._id;
            res.status(201).send(newUserResponse);
        })
        .catch(function (error) {
            // Check for Duplicate ID (Mongo Error Code 11000)
            if (error.code === 11000) {
                logAndSaveToDb('error', 'Failed to add new user: Duplicate User ID', { id: req.body.id });
                return res.status(400).send({
                    id: 4,
                    message: `user already exists. The ID ${req.body.id} is already taken.`
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
    user.find({}, '-_id -__v')
        .then(function (users) {
            //Endpoint is accessed Successfully log 
            logAndSaveToDb('info', 'Endpoint Accessed: got The list of users', {});
            // Sends the array of users as a JSON response.
            res.json(users);
        })
        .catch(next);// Passes any server errors to the error logger.
});
// Import the Cost model
const cost = require('../../costsService/models/costsDb');

// GET /api/users/:id - returns a specific user
router.get('/users/:id', async function (req, res, next) {
    // Ensure ID is a number
    const userId = parseInt(req.params.id);

    try {
        //Find the User inside the database
        const user = await user.findOne({ id: userId });
        if (!user) {
            //error log that the user was not found
            logAndSaveToDb('error', 'Failed: user not found', { id });
            //error 404 not fund message
            return res.status(404).send({
                id: 3,
                message: 'user ' + id + 'not found.'
            });
        }

        //Calculate the Total cost using Aggregation
        const costData = await cost.aggregate([
            // Find all costs for this user
            { $match: { userid: userId } },
            // Sum the 'sum' fields
            { $group: { _id: null, total: { $sum: "$sum" } } }
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

    }// General fallback for other unexpected errors
    catch (error) {
        next(error);
    }
});

module.exports = router;