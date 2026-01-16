const mongoose = require('mongoose');

// Schema definition based on requirements

  const logSchema = new mongoose.Schema({
      level: {
        type: String,
        required: true
  },
  message: {
        type: String,
        required: true
  },
  timeStamp: {
        type: Date,
        default: Date.now
  },
  
  details: Object

});

module.exports = mongoose.model('logs',logSchema);