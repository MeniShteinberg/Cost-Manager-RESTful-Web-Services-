// put here all files that work with monogoDB// 
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const uri = process.env.mongoUri;

// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting:", err));

// Schema definition based on requirements
const users = new mongoose.Schema({
  id: Number,
  first_name: String,
  last_name: String,
  birthday: Date
});

const User = mongoose.model('User', users);
module.exports = User;