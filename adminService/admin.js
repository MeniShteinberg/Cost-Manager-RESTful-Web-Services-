require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const {logAndSaveToDb,requestLogger,errorLogger} = require('../logsService/logs')
const app = express();

mongoose.connect(process.env.mongoUri);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//get log for each http request and save it to DB. 
app.use(requestLogger);

app.use('/api', apiRouter);

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

//this will catch all next(error) log save to DB and print error 500 
app.use(errorLogger)

const port = process.env.portAdmin || 3003;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;