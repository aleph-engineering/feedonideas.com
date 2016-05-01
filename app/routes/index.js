'use strict';
const controllers = require('../controllers'),
    models = require('../models'),
    uuid = require('uuid'),
    multer = require('multer');

var userController = controllers.userController,
    topicController= controllers.topicController,
    feedController = controllers.feedController,
    userSession = {}, profile = {},
    topicModel = models.Topic;

var upload = multer({
    dest: 'public/uploads/',
    limits: {
        fileSize: 2 * 1024 * 1024 //2 MB
    }
});

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

    app.get('/test/getMaxUps', function(req, res, next){
        var id = "5711c8e29d4f45e34c8a8156";
        topicController.getMaxUps(id, function(error, model){
            if (error) console.log("ERROR: " + error);
            console.log("MODEL: " + model);
            res.redirect('/');
        });
    });

    app.get('/home', function(req, res, next){
        res.render('home');
    });

    app.get('/', function(req, res, next) {
        res.render('profile', { title: 'Profile', userProfile: req.user});
    });

    app.get('/mytopics', function(req, res, next){
        topicController.getUserTopics(userSession.user, function(error, model){
            res.render('controls/mytopics', { title: "My topics", userProfile: req.user, topics: model});
        });
    });
    app.get('/mytopics/create', function(req, res, next){
        res.render('controls/createTopic', {title: 'Create Topic', userProfile: req.user});
    });

    app.get('/topic/:id', function(req,res){
        res.render('controls/topic', {title: 'Topic'});
    });

    app.post('/mytopics/create', upload.single('picture'), function(req, res, next){
        var newTopic = new topicModel({
            name : req.body.topicName,
            siteUrl : req.body.siteUrl,
            topicDesc : req.body.description,
            roomId : uuid.v1(),
            category : req.body.category,
            authorId : userSession.user,
            pictureUrl : '/uploads/' + req.file.filename,
            available : true,
            maxUpsPerUser : req.body.maxUps,
            maxDownsPerUser : req.body.maxDowns
        });
        newTopic.save(function(error, model){
            if(!error){
                topicController.getUserTopics(userSession.user, function(error, model){
                    console.log(model);
                    res.render('controls/mytopics', { title: "My Topics", userProfile: req.user, topics: model});
                });
            }
            else {
                console.log("ERROR SAVING TOPIC: " + error);
                res.redirect("/mytopics");
            }
        });
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

    var socketConfig = io.on('connection', function (socket) {
        socket.userId = userSession.user;
        require('../socket.io')(io,socket, profile);
    });
};

module.exports = routeConfig;

