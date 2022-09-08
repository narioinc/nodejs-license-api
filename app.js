var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var licenseRouter = require('./routes/license');
var licenseKafkaController = require("./controllers/license.kafka.conntroller")
const db = require("./models");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/license', licenseRouter);
licenseKafkaController.init()

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

db.sequelize.sync({ force: false })
.then(() => {
  console.log("Drop and re-sync db.");
  
})
.catch((err) => {
  console.log("Failed to sync db: " + err.message);
 
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
