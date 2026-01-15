// put here all files that work with monogoDB// 
const mongoose = require('mongoose');

// Schema definition based on requirements
const usersSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
});

module.exports = mongoose.model('users', usersSchema);
