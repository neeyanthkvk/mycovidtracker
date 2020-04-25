const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('cookie-session');
const logger = require('morgan');
const http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var server = http.Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('port', 8080);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Other App Features
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

server.listen(8080, function() {
    console.log('Starting server on port ' + app.locals.config.siteConfig.port);
});