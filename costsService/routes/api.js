const express = require('express');

//Initialize express router
const router = express.Router();

//Import cost database model
const cost = require('../models/costsDb');

//Import report database model
const report = require('../models/reportsDb');

//Import the logging functions from the logs service
const { logAndSaveToDb } = require('../../logsService/logs')

//Import user database model
const user = require('../../usersService/models/usersDb');

//Handle POST requests to add new cost items
router.post('/add', function(req, res, next) {
    const userid = req.body.userid;
    const sum = req.body.sum;
    const createdAt = req.body.created_at ? new Date(req.body.created_at) : new Date();

    //Set time to midnight for date comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //Prevent adding costs with dates in the past
    if (createdAt < today) {
        //Error log
        logAndSaveToDb('error',' Failed: Past date',{ userid, date: createdAt });
        //Return error message
        return res.status(400).send({
        id: 4, 
        message: 'Adding costs with past dates is not allowed.'
        });
    }
    
    //Validate that the sum is a positive number
    if (sum <= 0) {
        //Error log
        logAndSaveToDb('error', 'Failed: Invalid sum', { userid, sum });
        //Return error message
        return res.status(400).send({
            id: 4, 
            message: 'Sum must be a positive number.'
        });
    }

    //Verify user existence before processing
    user.findOne({ id: userid })
        .then(function(userExists) {
            if (!userExists) {
                //Error log
                logAndSaveToDb('error','Failed: User not found', { userid });
                //Return error message
                return res.status(404).send({
                id: 3,
                message: 'User ID ' + userid + ' does not exist. Cost item not added.'
                });
            }

            //Store the new cost item in the database
            return cost.create(req.body)
                .then(function(costItem) {
                    //Endpoint is accessed Successfully log  
                    logAndSaveToDb('info','Endpoint Accessed: Cost item added', { userid, costId: costItem._id });
                    const result = costItem.toObject();
                    //Clean up internal fields from response
                    delete result._id;
                    delete result.__v;
                    //Return the created cost item as a JSON response
                    res.status(201).send(result);
                });
        })
        .catch(function(error) {
            //Forward unexpected errors to the error handler
            next(error);
        });
});

//Handle GET requests for monthly reports
router.get('/report', function(req,res,next) {

    const userid = req.query.id;
    const year = req.query.year;
    const month = req.query.month;

    //Check for required query parameters
    if (!userid || !year || !month) {
        //Error log
        logAndSaveToDb('error', 'Failed: Missing query parameters', { userid, year, month });
        //Return error message
        return res.status(400).send({
            id: 4,
            message: 'Missing required parameters: id, year, and month must be provided.'
        });
    }

    //Validate that month range is 1-12
    if (month < 1 || month > 12) {
        //Error log
        logAndSaveToDb('error', 'Failed: Invalid month parameter', { userid, year, month });
        //Return error message
        return res.status(400).send({
            id: 4,
            message: 'Month must be between 1 and 12.'
        });
    }

    //Verify user existence before report generation
    user.findOne({ id: userid })
        .then(function(userExists) {
            if (!userExists) {
                //Error log
                logAndSaveToDb('error','Failed: User not found', { userid });
                //Return error message 
                return res.status(404).send({ 
                    id: 3, 
                    message: 'User ID ' + userid + ' does not exist. Cannot generate report.' 
                });
            }

    /*
    COMPUTED DESIGN PATTERN IMPLEMENTATION:
    1. Check if a pre-computed report exists in the 'reports' collection for the given user, year, and month.
    2. If found, return the existing report immediately to avoid unnecessary processing.
    3. If not found, generate a new report by processing data from the 'costs' collection.
    4. If the requested period is in the past, save the newly calculated report to the database for future use.
    */        

    //Check for pre-computed reports to avoid recalculation
    return report.findOne({ userid: userid, year: year, month: month })
        .then(function(existingReport) {
            if (existingReport) {
               
                //endpoint is accessed Successfully log
                logAndSaveToDb('info','Endpoint Accessed: Monthly Report returned', {userid});
                
                //Return the saved report as a JSON response
                return res.status(200).send({
                    userid: existingReport.userid,
                    year: existingReport.year,
                    month: existingReport.month,
                    costs: existingReport.costs
                });
            }

            //If no saved report is found, define the search window for the month
            const startDate = new Date(year, month - 1, 1); 
            const endDate = new Date(year, month, 0, 23, 59, 59);

            //Find all cost records within the date range
            return cost.find({ 
                userid: userid, 
                created_at: { $gte: startDate, $lte: endDate } 
            })
            .then(function(results) {
                //List of required categories for the report structure
                const categories = ['food', 'health', 'housing', 'sports', 'education'];
                
                //Group costs by category ensuring all categories are present
                const groupedCosts = categories.map(function(cat) {
                    //Filter results to get only items matching the current category
                    const items = results
                        .filter(function(item) { return item.category === cat; })
                        //Format the items to include only necessary fields
                        .map(function(item) {
                            return {
                                sum: item.sum,
                                description: item.description,
                                day: item.created_at.getDate()
                            };
                        });
                    //Create an object with the category name as the key
                    const obj = {};
                    obj[cat] = items;
                    //Return the formatted category object to the mapped array
                    return obj;
                });

                //Format the final report object
                const finalReport = {
                    userid: parseInt(userid),
                    year: parseInt(year),
                    month: parseInt(month),
                    costs: groupedCosts
                };

                //Check if report is for a past month
                const now = new Date();
                const isPastMonth = (year < now.getFullYear()) || (year == now.getFullYear() && month < (now.getMonth() + 1));
                
                //Save computed report if it belongs to a past month
                if (isPastMonth) {
                    report.create(finalReport)
                        .catch(function(saveError) {
                            //Error log
                            logAndSaveToDb('error', 'Failed to save computed report to DB', saveError);
                        });
                }
                //Endpoint is accessed Successfully log
                logAndSaveToDb('info','Endpoint Accessed: Monthly Report returned', {userid});
                
                //Return the report as a JSON response
                res.status(200).send(finalReport);
            });
        });
        })
        .catch(function(error) {
            //Forward unexpected errors to the error handler
            next(error);
        });
});

//Export the router to be mounted in the main application
module.exports = router;