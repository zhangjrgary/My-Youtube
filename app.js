var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var routes = require('./routes/index');
var users = require('./routes/users');
var events = require("./routes/sessionroute");
var app = express();
//
//global.db = mongoose.createConnection("localhost","abc");
var uristring = process.env.MONGOLAB_URI || 'localhost';
global.db = mongoose.createConnection(uristring,"abc");
console.log("app.js"+global.db.name);
db.on("error",function(){
    console.log("database link failed");
});
db.on("open",function(){
    console.log("database link success");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.get('/session',events.getAllsession);
app.get('/count',events.getCount);
app.get('/getListByName',events.getListByName);
app.post('/addSession',events.addSession);
app.post('/register',events.register);
app.post('/clearAll',events.clearAll);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
