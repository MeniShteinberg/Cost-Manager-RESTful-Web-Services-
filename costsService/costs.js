require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const apiRouter = require('./routes/api');

const app = express();

mongoose.connect(process.env.mongoUri);
mongoose.Promise = global.Promise;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    id: 999, 
    message: err.message
  });
});

const port = process.env.portCosts || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;