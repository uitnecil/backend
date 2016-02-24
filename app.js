var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var port = 3001;

//unprotected routes
var routes = require('./routes/index');
var filemanagement = require('./routes/filemanagement');
var publicThings = require('./routes/publicThings');
var users = require('./routes/users');
var authModule = require('./routes/auth');
//protected routes
var protectedThings = require('./routes/protectedThings');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express routing


router = express.Router();

//routes NO auth required
router.get('/public_things', publicThings.get);
router.post('/users', users.post);
//router.get('/filemanagement', filemanagement); // TODO : add authentication for this route (need massive changes)

//routes auth required
router.get('/filemanagement', filemanagement.getMyPictures);
router.get('/protected_things', authModule.auth(), protectedThings.getProtectedData);
router.get('/protected_things2', authModule.auth('ADMIN'), protectedThings.getProtectedData);
router.post('/login', login.post);

app.use('/api', router);



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
