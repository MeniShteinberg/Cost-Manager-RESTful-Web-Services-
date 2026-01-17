// put here all files that work with monogoDB// 
const mongoose = require('mongoose');

// Schema definition based on requirements
const usersSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'User ID is required'],
    unique: true //Ensures no two users have the same ID
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
    required: true,
    validate: {
      //Ensures the birthday is in the past
      validator: function (value) {
        return value < new Date(); // Returns true if the date is before 'now'
      },
      message: 'Birthday must be a date in the past.'
    }
  }
});

module.exports = mongoose.model('users', usersSchema);
