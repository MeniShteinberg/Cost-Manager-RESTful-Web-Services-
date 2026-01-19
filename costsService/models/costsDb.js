//Importing the mongoose libary 
const mongoose = require('mongoose');

//Schema definition based on requirements
const costsSchema = new mongoose.Schema({

  //The title or details of the expense    
  description: {
        type: String,
        required: true
  },

  //The category the expense belongs to
  category: {
        type: String,
        required: true
  },

  //Reference ID of the user who added the cost
  userid: {
        type: Number,
        required: true
  },

  //The cost of the expense
  sum: {
        type: Number, 
        required: true
  },

  //Customizable date with the current time as default
  created_at: {
        type: Date,
        default: Date.now
  }
});

//Compile the schema into a model and export it for use
module.exports = mongoose.model('costs', costsSchema);
