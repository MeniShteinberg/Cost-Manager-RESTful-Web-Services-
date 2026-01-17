//put here the loglist api 
const express = require('express');
const router = express.Router();
const { logAndSaveToDb } = require('../../logsService/logs')
const cost = require('../models/logsDb');

router.get('/logs', async function(req,res,next) {
    try {
        //find all logs in the DB and insert them to alllogs
        const allLogs = await Log.find({});

        //endpoint is accessed Successfully log
        await logAndSaveToDb('info','Logs list retrieved successfully');
        //success 200 message
        res.status(200).json(allLogs);

    } catch (error){
        next(error);//will go to the errorlogger func that logs and prints the error message 500
        }
});

module.exports = router;