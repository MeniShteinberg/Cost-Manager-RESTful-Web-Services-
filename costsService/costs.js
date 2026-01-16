require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');

const {logAndSaveToDb} = require('../logsService/logs')

const app = express();

mongoose.connect(process.env.mongoUri);
mongoose.Promise = global.Promise;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

app.use('/api', apiRouter); 

// את כל הבלוק הזה לא חיברתי ללוגים פשוט כי זה דופק את כל הלוגיקה 
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;

});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    id: 1,
    message: err.message
  });
});
// צריך לראות מה עושים פה אני התייאשתי

router.use(errorLogger)

const port = process.env.portCosts || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;