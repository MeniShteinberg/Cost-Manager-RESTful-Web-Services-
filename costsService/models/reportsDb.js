const mongoose = require('mongoose');

const reportsSchema = new mongoose.Schema({
    userid: Number,
    year: Number,
    month: Number,
    costs: Array
});

module.exports = mongoose.model('reports', reportsSchema);