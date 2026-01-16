const express = require('express');
const router = express.Router();
const cost = require('../models/costsDb');
const report = require('../models/reportsDb');
// ייבוא המודל של המשתמשים כדי לבדוק קיום משתמש במסד הנתונים
const user = require('../../usersService/models/usersDb');

router.post('/add', function(req, res, next) {
    const userid = req.body.userid; // 1. חילוץ ה-ID
    const createdAt = req.body.created_at ? new Date(req.body.created_at) : new Date();

    // 1. בדיקה: האם התאריך שייך לעבר?
    const today = new Date();
    today.setHours(0, 0, 0, 0); // מאפסים שעות כדי להשוות רק תאריכים

    if (createdAt < today) {
        return res.status(400).send({ 
            id: 4, 
            message: 'Adding costs with past dates is not allowed.'
        });
    }

    // 2. בדיקה האם המשתמש קיים
    user.findOne({ id: userid })
        .then(function(userExists) {
            if (!userExists) {
                // 3. אם לא נמצא, החזרת שגיאה מתאימה ועצירה
                return res.status(404).send({ 
                    id: 3, 
                    message: 'User ID ' + userid + ' does not exist. Cost item not added.' 
                });
            }

            // 4. אם המשתמש קיים, ממשיכים להוספת העלות
            return cost.create(req.body)
                .then(function(costItem) {
                    const result = costItem.toObject();

                    delete result._id;
                    delete result.__v;

                    res.status(201).send(result);
                });
        })
        .catch(function(error) {
            res.status(500).send({ 
                id: 1, 
                message: 'Problem adding cost item: ' + error.message
            });
        });
});

router.get('/report', function(req, res) {

    const userid = req.query.id;
    const year = req.query.year;
    const month = req.query.month;

    user.findOne({ id: userid })
        .then(function(userExists) {
            if (!userExists) {
                return res.status(404).send({ 
                    id: 3, 
                    message: 'User ID ' + userid + ' does not exist. Cannot generate report.' 
                });
            }

    // 1. חיפוש בטבלת הדוחות (Computed Pattern) - האם כבר חישבנו את הדוח הזה בעבר?
    return report.findOne({ userid: userid, year: year, month: month })
        .then(function(existingReport) {
            if (existingReport) {
                // אם נמצא דוח מוכן, מחזירים אותו מיד בלי לחשב
                return res.status(200).send({
                    userid: existingReport.userid,
                    year: existingReport.year,
                    month: existingReport.month,
                    costs: existingReport.costs
                });
            }

            // 2. אם לא נמצא דוח, מגדירים טווח תאריכים לחיפוש בטבלת העלויות
            const startDate = new Date(year, month - 1, 1); 
            const endDate = new Date(year, month, 0, 23, 59, 59);

            return cost.find({ 
                userid: userid, 
                created_at: { $gte: startDate, $lte: endDate } 
            })
            .then(function(results) {
                const categories = ['food', 'health', 'housing', 'sports', 'education'];
                
                // עיבוד התוצאות למבנה הנדרש (Grouped by Category)
                const groupedCosts = categories.map(function(cat) {
                    const items = results
                        .filter(function(item) { return item.category === cat; })
                        .map(function(item) {
                            return {
                                sum: item.sum,
                                description: item.description,
                                day: item.created_at.getDate() // חילוץ היום מתוך ה-Date
                            };
                        });
                    const obj = {};
                    obj[cat] = items;
                    return obj;
                });

                const finalReport = {
                    userid: parseInt(userid),
                    year: parseInt(year),
                    month: parseInt(month),
                    costs: groupedCosts
                };

                // 3. שמירת הדוח ב-DB אם מדובר בחודש שעבר (כדי שלא נצטרך לחשב שוב)
                const now = new Date();
                const isPastMonth = (year < now.getFullYear()) || (year == now.getFullYear() && month < (now.getMonth() + 1));
                
                if (isPastMonth) {
                    report.create(finalReport).catch(err => console.log("Save report error:", err));
                }

                res.status(200).send(finalReport);
            });
        });
        })
        .catch(function(error) {
            // החזרת שגיאה במבנה הנדרש
            res.status(500).send({ 
                id: 2, 
                message: 'Error generating report: ' + error.message 
            });
        });
});

module.exports = router;