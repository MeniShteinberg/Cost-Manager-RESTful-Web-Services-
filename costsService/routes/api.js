const express = require('express');
const router = express.Router();
const cost = require('../models/costsDB');

router.post('/add', function(req, res, next) {
    cost.create(req.body)
        .then(function(costItem) {
            res.status(201).send(costItem);
        })
        .catch(function(error) {
            res.status(500).send({ 
                id: 1, 
                message: 'Problem adding cost item: ' + error.message
            });
        });
});

module.exports = router;