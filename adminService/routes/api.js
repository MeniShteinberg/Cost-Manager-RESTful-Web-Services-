const express = require('express');
const router = express.Router();
const { logAndSaveToDb } = require('../../logsService/logs');

// About Team Endpoint
router.get('/about', function(req, res, next) {
    try {
        const teamMembers = [
            { first_name: "Meni", last_name: "Shteinberg" },
            { first_name: "Amit", last_name: "bregman" },
            { first_name: "Adi", last_name: "Shamay" }
        ];

        // Endpoint is accessed Successfully log
        logAndSaveToDb('info', 'Endpoint Accessed: Team details returned', {});

        //החזרת התשובה ללקוח (Success 200 message)
        res.status(200).send(teamMembers);

    } catch (error) {

        // שליחת לוג שגיאה
        logAndSaveToDb('error', 'Failed: Problem getting team details', {});

        // החזרת JSON עם הודעת שגיאה ועצירה
        return res.status(404).send({
            id: 3,
            message: 'Problem getting team details.'
        });
    }
});

module.exports = router;