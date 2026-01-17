const express = require('express');
const router = express.Router();
const User = require('../models/usersDb');
const { logAndSaveToDb } = require('../../logsService/logs')

// POST /api/add - Adding a new user
router.post('/add', function (req, res, next) {
    User.create(req.body)
        .then(function (newUser) {
            //endpoint is accessed Successfully log  
            logAndSaveToDb('info','Endpoint Accessed:user added',{});
            //returns status 201(succecefully created a new resource)and a new user as been creats
            res.status(201).send(newUser);
        })
        .catch(function (error) {
            //error log
            logAndSaveToDb('error',' Failed: adding user',{});
            //error 400 Bad Request message
            return res.status(400).send({
            id: 4, 
            message: 'faild adding user.'
        });
    });
});

// GET /api/users - List of users
router.get('/users', function (req, res, next) {
    User.find({}, '-_id -__v')
        .then(function (users) {
            //endpoint is accessed Successfully log
            logAndSaveToDb('info','Endpoint Accessed: got The list of users',{});
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
        // 1. Find the User inside the database
        const user = await User.findOne({ id: userId });
        if (!user) {
            //error log
            logAndSaveToDb('error','Failed: User not found', {id});
            //error 404 not fund message
            return res.status(404).send({
            id: 3,
            message: 'User ' + id + 'not found.'
            });
        }

        // 2. Calculate the Total Cost using Aggregation
        const costData = await Cost.aggregate([
            { $match: { userid: userId } }, // Find all costs for this user
            { $group: { _id: null, total: { $sum: "$sum" } } } // Sum the 'sum' fields
        ]);

        // 3. Extract the total (or 0 if no costs exist)
        const totalAmount = costData.length > 0 ? costData[0].total : 0;

        // 4. Send the final combined response

        //endpoint is accessed Successfully log
        logAndSaveToDb('info','Endpoint Accessed: got The details of a specific user', {});
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