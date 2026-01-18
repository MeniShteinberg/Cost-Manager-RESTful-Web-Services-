//Importing the mongoose libary 
const mongoose = require('mongoose');

// Schema definition based on requirements
const usersSchema = new mongoose.Schema({
  id: {
    //Make sure the user enter an id that is a number and that the id dosnet exist in th DB.
    type: Number,
    required: [true, 'User ID is required'],
    unique: true
  },
  first_name: {
    //Make sure the user enter a first name that is a string
    type: String,
    required: true
  },
  last_name: {
    //Make sure the user enter a last name that is a string
    type: String,
    required: true
  },
  birthday: {
    //Make sure the user enter a birthday that is a date and that the birthday is in the past
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value < new Date();
      },
      message: 'Birthday must be a date in the past.'
    }
  }
});

module.exports = mongoose.model('users', usersSchema);
