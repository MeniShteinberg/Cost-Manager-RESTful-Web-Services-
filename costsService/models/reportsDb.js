//Importing the mongoose libary 
const mongoose = require('mongoose');

//Schema definition based on requirements
const reportsSchema = new mongoose.Schema({

    //The unique identifier of the user
    userid: {
        type: Number,
        required: true
    },

    //The calendar year of the report
    year: {
        type: Number,
        required: true
    },

    //The calendar month of the report
    month: {
        type: Number,
        required: true
    },

    //The array of categorized expense items
    costs: {
        type: Array,
        required: true
    }
});

//Compile the schema into a model and export it for use
module.exports = mongoose.model('reports', reportsSchema);