const mongoose = require('mongoose');

const reportsSchema = new mongoose.Schema({
    userid: {
        type: Number
    },
    year: {
        type: Number
    },
    month: {
        type: Number
    },
    costs: {
        type: Array
    }
});

module.exports = mongoose.model('reports', reportsSchema);