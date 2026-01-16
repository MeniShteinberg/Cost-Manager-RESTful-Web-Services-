require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.mongoUri;

  const logs = new mongoose.Schema({
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