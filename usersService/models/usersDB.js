// put here all files that work with monogoDB// 
/*const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
*/


const mongoose = require('mongoose');
const path = require('path');

const uri = process.env.mongoUri;
// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting:", err));

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