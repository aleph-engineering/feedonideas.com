'use strict';
const controllers = require('../controllers'),
    models = require('../models');

var userController = controllers.userController,
    topicController= controllers.topicController,
    feedController = controllers.feedController,
    userSession = {}, profile = {};

var routeConfig = function(app, io){
    /**
     * Require always for authentication
     */
    app.use(function(req, res, next) {
        if(req.url == "/api/feedremote.js") return next();
        if (req.user) {
            userSession = req.session.passport;
            profile = req.user;
            next();
        } else {
            res.render('home');
        }
    });

    require('./topicsRoutes')(app); // Routes for topics
    require('./apiRoutes')(app); //Routes for apis

    app.get('/home', function(req, res, next){
        res.render('home');
    });

    app.get('/', function(req, res, next) {
        res.render('profile', { title: 'Profile', userProfile: req.user});
    });

    app.get('/feeds/:roomId', function(req, res, next){
        var roomId = req.params.roomId;
        console.log("ROOM ID: " + roomId);
        topicController.getTopicByRoomId(roomId, function(error, topic){
            if(!error){
                console.log("TOPIC: " + topic);
                feedController.getFeedsByTopic(topic._id, function(error, model){
                    console.log("MODEL: " + model);
                    res.render('controls/feeds', {title: topic.name ,feeds: model, roomId: roomId, userProfile: req.user});
                });
            }
        });
    });
    app.post('/feeds/create/:roomId', function(req, res, next){
        const body = req.body.feedBody,
            roomId = req.params.roomId;
        feedController.saveNewFeedWithRoomId(roomId, userSession.user, body, function(error, model){
            res.cookie('room.id', roomId);
            res.render('controls/feeds', {});
        })
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

module.exports = routeConfig;

