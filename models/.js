// put here all files that work with monogoDB// 
require('dotenv').config();
const mongoose = require('mongoose');


const uri = process.env.mongoUri;

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Error connecting:", err));

  
const useres = new mongoose.Schema({
  id: Number ,
  first_name: String ,
  last_name: String ,
  birthday:Date
});

const costs = new mongoose.Schema({
  catdescription: String ,
  category: String ,
  userid: Number ,
  sum: Number
});

const logs = new mongoose.Schema({
 // I don't know what logs is supposed to contain.
});



const user = mongoose.model('user',useres);

//test add new user and save to DB
const newUser1 = new user({id: 123123,first_name:"moshe", last_name:"israeli",birthday:new Date("1990-01-30")});

//gimini func to save once in DB 
async function saveUser() {
  try {
    await newUser1.save();
    console.log("user saved !");
  } catch (err) {
    console.error("eror", err.message);
  }
}
saveUser();