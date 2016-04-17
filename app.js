//noinspection JSLint,JSHint
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    compression = require('compression');

var app = express();

// view engine setup
//noinspection JSLint,JSHint
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(compression());

//
/**
 * Mongoose Configurations
 * @type {connections|exports|module.exports}
 */
var local_db = require('./app/configurations');
mongoose.connect(process.env.MONGOLAB_URI || local_db.DEVELOPMENT_URL);

/**
 * Configurations for sessions
 */
var mongoStoreConfig = new mongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 7 * 24 * 60 * 60 *1000 // = 7 days.
});
app.use(session({
    key   : "toi.session.id",
    secret: process.env.EXPRESS_SESSION_KEY,
    cookie: {maxAge: 7 * 24 * 60 * 60 * 1000},
    resave: false,
    saveUninitialized: true,
    store: mongoStoreConfig
}));

/**
 * Configurations for passport
 */
require('./app/passport')(app);

/**
 * Configuration for socket.io
 */
var port = process.env.PORT || '3000',
    io = require('socket.io').listen(app.listen(port));

//routes
require('./app/routes')(app,io);

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
//noinspection JSLint
app.use(function(err, req, res, next) {
    //noinspection JSLint
    res.status(err.status || 500); // jshint ignore:line
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
