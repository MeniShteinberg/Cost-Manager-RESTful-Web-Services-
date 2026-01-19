//Loads environment variables from your .env file
require('dotenv').config();

//Importing the express framework
const express = require('express');

//Importing the mongoose libary
const mongoose = require('mongoose');

//Importing the custom route handlers from the routes/api.js file
const apiRouter = require('./routes/api');

//Importing the logging functions from the logs service
const {logAndSaveToDb,requestLogger,errorLogger} = require('../logsService/logs');

//Initializes a new Express application instance
const app = express();

//Creating a connection to the mongoDB database using the string inside the env file
mongoose.connect(process.env.mongoUri);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Get log for each http request and save it to DB 
app.use(requestLogger);

app.use('/api', apiRouter); 

//Catches requests to routes that do not exist (404) and forwards them to the error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err)

});

//Handle 404 errors
app.use(async function(err, req, res, next) {

  //Determine the error status or default to 500
  const status = err.status || 500;

  if(status===404)
  {
      //Log error details to database before responding
      await logAndSaveToDb('error','Failed:The requested path does not exist ', {
      path:req.url,
      message:err.message
     });
      //error 404 not found message
      return res.status(404).send({
      id: 3,
      message: 'The requested path ' + req.url + ' does not exist.'
   });
  }
  else
  {
    //Pass non-404 errors to the subsequent error handler
    next(err);
  }
});

//Catches all remaining errors passed through next(err) from your routes 
app.use(errorLogger)

//Use the 'PORT' from .env if available, otherwise default to 3000
const port = process.env.PORT || 3000;

//Start the server
app.listen(port, () => {
    //Log a message to the terminal so we know the service is successfully running
    console.log(`Server is running on port ${port}`);
});

module.exports = app;