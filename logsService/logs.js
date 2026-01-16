const pino = require('pino')(); 
const logger =pino(); 
const log = require('./models/logs'); //monogoDB schema logs 

const logAndSaveToDb = async (message, details = {}) => {
 //pino prints the log to console  
  logger.info(details, message);
  
// try to save the log from pino to mongoDB using the logsSchema
  try {
    await Log.create({
      level: 'info',
      message: message,
      details: details
      //timestemp is set by default to Date.now  
    });
  } catch (err) {
    logger.error('Database logging failed', err);
  }
};

const requestLogger = async (req, res, next) => {
  await logAndSaveToDb(`HTTP Request: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
};

const errorLogger = (err, req, res,) => {
  logger.error({ 
    err: err.message, 
    stack: err.stack, 
    url: req.url 
  }, 'Server Error');

  res.status(500).send("Internal Server Error");
};

module.exports = { logAndSaveToDb,requestLogger,errorLogger,logger };