//Loads environment variables from your .env file into process.env
require('dotenv').config();
//Importing the express framework
const express = require('express');
//Importing the mongoose libary 
const mongoose = require('mongoose');
//Importing the custom route handlers from the routes/api.js file
const apiRouter = require('./routes/api');
//Importing the logAndSaveToDb,requestLogger,errorLogger functions from the logs file
const { logAndSaveToDb, requestLogger, errorLogger } = require('../logsService/logs');
//Initializes a new Express application instance
const app = express();
//Creating a connection to the mongoDB database using the string inside the env file
mongoose.connect(process.env.mongoUri)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Get log for each http request and save it to DB
app.use(requestLogger);

app.use('/api', apiRouter);

//Catches requests to routes that do not exist.
app.use(async function (err, req, res, next) {
  // Determine the HTTP status: use the error's status or default to 500 (Internal Server Error)
  const status = err.status || 500;

  // Specific logic for 404 errors (e.g., the user typed the wrong URL)
  if (status === 404) {
    await logAndSaveToDb('error', 'Failed: The requested path does not exist ', {
      path: req.url,
      message: err.message
    });

    return res.status(404).send({
      // Custom internal error ID for tracking
      id: 3,
      message: 'The requested path ' + req.url + ' does not exist.'
    });
  }
  else {
    // If the error isn't a 404, pass it to the next error-handling middleware
    next(err);
  }
});

//Catches all errors passed through next(err) from your routes
app.use(errorLogger);

// Use the 'PORT' from .env if available, otherwise default to 3001 for the User Service
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  // Log a message to the terminal so we know the service is successfully running
  console.log(`User Microservice is running on port ${PORT}`);
});

module.exports = app;