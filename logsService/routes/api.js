const express = require('express');

//Initialize express router
const router = express.Router();

//Import logs database model
const log = require('../models/logsDb');

//Import the logging functions from the logs service
const { logAndSaveToDb } = require('../../logsService/logs')

//Handle GET requests to show all logs
router.get('/logs', async function(req,res,next) {
    try {
        //find all logs in the DB and insert them to alllogs
        const allLogs = await log.find({});

        //endpoint is accessed Successfully log
        await logAndSaveToDb('info','Logs list retrieved successfully');
        //Return the logs as JSON and success 200 message and 
        res.status(200).json(allLogs);

    } catch (error){
        next(error);//Forward unexpected errors to the error handler
        }
});

//Export the router to be mounted in the main application
module.exports = router;