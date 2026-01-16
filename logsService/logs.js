const pino = require('pino')(); 
const logger =pino; 
const log = require('./models/logsDb'); //monogoDB schema logs 

const logAndSaveToDb = async (level,message,details = {}) => {
  logger[level](details, message); //pino prints the log to console  
// try to save the log from pino to mongoDB using the logsSchema
  try {
    await log.create({
      level: level,
      message: message,
      details: details
      //timestemp is set by default to Date.now  
    });
  } catch (err) { //if the save to monogoDB faild
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
  await logAndSaveToDb('error', `Unexpected Error: ${err.message}`, {  //print the log and save it
    stack: err.stack,
    url: req.url
  });

  //check if alrady sent arespone to clinet 
  if (res.headersSent) {
    return next(err);
  }

  //the problem is with the server          
  res.status(500).send({ 
    id: 1, 
    message: 'An Internal Server Error (500): ' + err.message 
  });
};

module.exports = { logAndSaveToDb,requestLogger,errorLogger,logger };