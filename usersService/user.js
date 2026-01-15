require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api')

const app = express();

app.use(express.json());

const User = require('./models/usersDB');

//router for all /api pathes//
app.use('/api', apiRouter);

//Error Handling

//404 Error-not found
app.use(function (req, res, next) {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//General Error
app.use(function (error, req, res, next) {
    res.status(error.status || 500);//internal server error
    res.json({
        status: error.status || 500,
        message: error.message
    });
});

const PORT = process.env.portUsers || 3001;
app.listen(PORT, () => {
    console.log(`User Microservice is running on port ${PORT}`);
});

module.exports = app;
/* used for log
// Middleware for logging every request
app.use((req, res, next) => {
    logger.info({ method: req.method, url: req.url }, 'HTTP Request received');
    // Log to database logic should be implemented here or via a Pino transport
    next();
});
*/
