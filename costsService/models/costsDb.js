const mongoose = require('mongoose');

const costsSchema = new mongoose.Schema({
  description: {
        type: String,
        required: true
  },
  category: {
        type: String,
        required: true
  },
  userid: {
        type: Number,
        required: true
  },
  sum: {
        type: Number, 
        required: true
  },
  created_at: {
        type: Date,
        default: Date.now
  }
});

module.exports = mongoose.model('costs', costsSchema);
