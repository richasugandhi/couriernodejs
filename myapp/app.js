var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var expressLayouts = require('express-ejs-layouts');
var hbs = require('express-hbs');
var expressValidator = require('express-validator');
var express = require('express');
global.db = require('./database');

var app = express();

app.use('/public', express.static('public'));
app.use('/css', express.static(__dirname + 'public/custom/css'));
app.use('/js', express.static(__dirname + 'public/custom/js'));
app.use('/img', express.static(__dirname + 'public/custom/img'));


// view engine setup
app.use(expressLayouts);
//app.set('layout', './user/layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'couriermanagment',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use(expressValidator());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var orderRouter = require('./api/users/route/order');
var usersApiRouter = require('./api/users/route/user.route');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);
app.use('/api/users', usersApiRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(req, res, next) {
  res.locals.user = req.session.userdata;
  next();
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//const db=require('./database');
module.exports = app;
