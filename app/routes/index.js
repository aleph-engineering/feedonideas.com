'use strict';
const controllers = require('../controllers'),
    models = require('../models'),
    uuid = require('uuid'),
    macAd = require('getmac');

var userController = controllers.userController,
    topicController= controllers.topicController,
    feedController = controllers.feedController,
    userSession = {}, roomIdent="",
    topicModel = models.Topic;

var routeConfig = function(app, io){
    /**
     * Require always for authentication
     */
    app.use(function(req, res, next) {
        if (req.user) {
            userSession = req.session.passport;
            next();
        } else {
            res.render('home');
        }
    });
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
        res.render('index', { title: 'Profile', userProfile: req.user});
    });
    app.get('/create', function(req,res){

        // Generate unique id for the room
        var id = Math.round((Math.random() * 1000000));

        // Redirect to the random room
        res.cookie('topic-id', id, {path: '/room/'});
        res.redirect('/topic/'+id);
    });

    app.get('/mytopics', function(req, res, next){
        var topics = topicController.getUserTopics(userSession.user, function(error, model){
            console.log(model);
            res.render('controls/mytopics', { title: "MyTopics", userProfile: req.user, topics: model});
        });
    });
    app.get('/mytopics/create', function(req, res, next){
        res.render('controls/createTopic', {title: 'Create Topic', userProfile: req.user});
    });

    app.get('/topic/:id', function(req,res){
        console.log(req.session.passport);
        // Render the chant.html view
        res.render('controls/topic');
    });
    app.post('/mytopics/create', function(req, res, next){
        var newTopic = new topicModel({
            name : req.body.topicName,
            siteUrl : req.body.siteUrl,
            topicDesc : req.body.description,
            roomId : uuid.v1(),
            category : req.body.category,
            authorId : userSession.user,
            pictureUrl : "/images/image-empty.png",
            available : true,
            votesPerUser : req.body.maxVotes,
            maxUpsPerUser : req.body.maxVotes,
            maxDownsPerUser : req.body.maxDowns
        });
        newTopic.save(function(error, model){
            if(!error){
                var topics = topicController.getUserTopics(userSession.user, function(error, model){
                    console.log(model);
                    res.render('controls/mytopics', { title: "MyTopics", userProfile: req.user, topics: model});
                });
            }
            console.log("ERROR SAVING TOPIC: " + error);
            res.redirect("/mytopics");
        });
    });


    app.get('/feeds/:roomId', function(req, res, next){
        var roomId = req.params.roomId;
        console.log("ROOM ID: " + roomId);
        topicController.getTopicByRoomId(roomId, function(error, model){
            if(!error){
                feedController.getFeedsByTopic(model, function(error, model){
                    res.render('controls/feeds', {feeds: model, roomId: roomId});
                    return;
                });
            }
        });
    });
    app.post('/feeds/create/:roomId', function(req, res, next){
        const body = req.body.feedBody,
            roomId = req.params.roomId;
        roomIdent = roomId;
        feedController.saveNewFeedWithRoomId(roomId, userSession.user, body, function(error, model){
            res.cookie('room.id', roomId);
            res.render('controls/feeds', {});
        })
    });

    app.get('/toNeutrino', function(req, res, next) {
        var mac = macAd.getMac(function (err, macAddress) {
            if (err)  throw err;
            console.log(macAddress);
            res.render('controls/home', {macAdd: macAddress});
        });
    });
    var socketConfig = io.on('connection', function (socket) {
        socket.userId = userSession.user;
        require('../socket.io')(io,socket);
    });
};

module.exports = routeConfig;

