// put here all files that work with monogoDB// 
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.mongoUri;

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting:", err));

  const costs = new mongoose.Schema({
  catdescription: String ,
  category: String ,
  userid: Number ,
  sum: Number
});