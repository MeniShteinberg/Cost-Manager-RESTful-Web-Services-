//Loads environment variables from your .env file into process.env
require('dotenv').config();

//Importing the express framework
const express = require('express');

//Importing the mongoose libary 
const mongoose = require('mongoose');

//Importing the custom route handlers from the routes/api.js file
const apiRouter = require('./routes/api');

//Importing the logAndSaveToDb,requestLogger,errorLogger functions from the logs file
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

app.use(async function(err, req, res, next) {
  const status = err.status || 500;
  if(status===404)
  {
     await logAndSaveToDb('error','Failed:The requested path does not exist ', {
      path:req.url,
      message:err.message
     });
      //error 404 not fund message
      return res.status(404).send({
      id: 3,
      message: 'The requested path ' + req.url + ' does not exist.'
   });
  }
  else
  {
    next(err);
  }
});

//Catches all errors passed through next(err) from your routes 
app.use(errorLogger)

// Use the 'PORT' from .env if available, otherwise default to 3003
const port = process.env.PORT || 3003;

// Start the server
app.listen(port, () => {
  // Log a message to the terminal so we know the service is successfully running
    console.log(`Server is running on port ${port}`);
});

module.exports = app;