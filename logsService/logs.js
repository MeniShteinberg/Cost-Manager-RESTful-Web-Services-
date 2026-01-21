//Importing the pino library 
const pino = require('pino')();

//Creating a new object from the pino library 
const logger =pino; 

//Import logs database model
const log = require('./models/logsDb'); 

//the main function that uses pino to create a log and saves it to the data base 
const logAndSaveToDb = async (level,message,details = {}) => {
  
  //pino creates the log 
  logger[level](details, message);  

// try to save the log from pino to mongoDB using the log model 
  try {
    await log.create({
      level: level,
      message: message,
      details: details
      //timestemp is set by default to Date.now  
    });
  } catch (err) { 
    //if the save to monogoDB faild prints pino log to console
    logger.error('failed to save log to mongoDB', err);
  }
};


//Middleware for logging HTTP Requests 
const requestLogger = async (req, res, next) => {
  await logAndSaveToDb('info',`HTTP Request: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
};

//Middleware for logging Errors 
const errorLogger = async (err, req, res, next) => {
  await logAndSaveToDb('error', `Unexpected Error: ${err.message}`, {  
    stack: err.stack,
    url: req.url
  });

  //check if already sent arespone to client
  if (res.headersSent) {
    return next(err);
  }

  //else the problem is with the server,         
  res.status(500).send({ 
    id: 1, 
    message: 'An Internal Server Error (500): ' + err.message 
  });
};

//Exporting registry functions and middleware for use elsewhere 
module.exports = { logAndSaveToDb,requestLogger,errorLogger,logger };