'use strict';
const controllers = require('../controllers'),
    models = require('../models'),
    url = require('url');

var userController = controllers.userController,
    topicController= controllers.topicController,
    feedController = controllers.feedController,
    AuthorizedUrlModel = require('../models').AuthorizedUrl,
    userSession = {}, profile = {};

var routeConfig = function(app, io){
    /**
     * Require always for authentication
     */
    app.use(function(req, res, next) {
        var referer = req.headers['referer'];
        if(referer && req.url.match(/api\/plugin\/.+/)){
            validateUrl(referer, (error, model) => {
                if (model) {
                    req.clientTopic = model.topicId;
                    return next();
                }
            });
        }
        else if(req.user){
            userSession = req.session.passport;
            profile = req.user;
            return next();
        }
        else{
            res.render('home');
        }
    });

    require('./topicsRoutes')(app); // Routes for topics
    require('./feedsRoutes')(app);
    require('./apiRoutes')(app); //Routes for apis
    require('./pluginAPI')(app, io); //API for plugin

    app.get('/home', function(req, res, next){
        res.render('home');
    });

    app.get('/', function(req, res, next) {
        res.render('profile', { title: 'Profile', userProfile: req.user});
    });

    app.get('/logout', function(req,res){
        req.session.destroy();
        res.redirect('/home');
    });

    io.on('connection', function (socket) {
        socket.userId = userSession.user;
        require('../socket.io')(io,socket, profile);
    });
};

/***** helpers *****/
function validateUrl(clientUrl, callback){
    var parsedUrl = url.parse(clientUrl);
    var URL = parsedUrl.protocol + '//' +parsedUrl.host;

    if (typeof callback === "function") {
        AuthorizedUrlModel.findOne({ url: URL},(error, model)  =>{
            callback(error, model);
        })
    }
}

module.exports = routeConfig;

