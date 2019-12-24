var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var helloRouter = require('./routes/hello');
var ajaxRouter = require('./routes/ajax');
var googleNewsRouter = require('./routes/googleNews')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var session_opt = {
  secret: 'keyboard cat', // ハッシュ計算時の秘密キー
  resave: false, // セッションストアに強制的に値を保存するか
  saveUninitialized: false, // 初期化されてない値を強制的に保存するか
  cookie: {maxAge: 60 * 60 * 1000 } // クッキーの保管（＝セッションの継続）時間。ここでは1時間
}
app.use(session(session_opt))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hello', helloRouter);
app.use('/ajax', ajaxRouter);
app.use('/googleNews', googleNewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
