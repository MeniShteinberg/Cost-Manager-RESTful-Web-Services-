//Importing the mongoose libary 
const mongoose = require('mongoose');

//Schema definition based on requirements
  const logSchema = new mongoose.Schema({

      //The level of the log
      level: {
        type: String,
        required: true
  },

  //The message of the log
  message: {
        type: String,
        required: true
  },

  //The time of creation of the log
  timeStamp: {
        type: Date,
        default: Date.now
  },
  
  //all extra details of the log 
  details: Object

});

//Compile the schema into a model and export it for use
module.exports = mongoose.model('logs',logSchema);
