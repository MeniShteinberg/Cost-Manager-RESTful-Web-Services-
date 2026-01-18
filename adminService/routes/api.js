const express = require('express');

//Create a new router instance for API endpoints
const router = express.Router();

//Import the logging functions from the logs service
const { logAndSaveToDb } = require('../../logsService/logs');

//Define a GET route to retrieve team information
router.get('/about', function(req, res, next) {
    try {
        //Static list containing team member details
        const teamMembers = [
            { first_name: "Meni", last_name: "Shteinberg" },
            { first_name: "Amit", last_name: "bregman" },
            { first_name: "Adi", last_name: "Shamay" }
        ];

        //Log the successful access of this endpoint to the database
        logAndSaveToDb('info', 'Endpoint Accessed: Team details returned', {});

        //Send a 200 OK status with the team members array
        res.status(200).send(teamMembers);

    } catch (error) {

        //Log the failure details to the database
        logAndSaveToDb('error', 'Failed: Problem getting team details', {});

        //Return error message
        return res.status(404).send({
            id: 3,
            message: 'Problem getting team details.'
        });
    }
});

//Export the router to be mounted in the main application
module.exports = router;