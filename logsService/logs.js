
const logAndSave = async (level, message, extraDetails = {}) => {
 // pino print for console
  logger[level](extraDetails, message);

  //try to save to monogoDB
  try {
    await Log.create({
      level: level,
      message: message,
      details: extraDetails //here will be all pino details
    });
  } catch (err) {
    logger.error('couldnt save to monogo', err);
  }
};
