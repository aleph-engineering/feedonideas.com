'use strict';
const controllers = require('../controllers'),
    models = require('../models');

var userController = controllers.userController,
    topicController= controllers.topicController,
    feedController = controllers.feedController,
    userSession = {};

var routeConfig = function(app, io){
    /**
     * Require always for authentication
     */
    app.use(function(req, res, next) {
        if (req.user) {
            userSession = req.session.passport;
            console.log(userSession);
            next();
        } else {
            req.session.error = 'Access denied!';
            res.render('login');
        }
    });

    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express', profile: {}});
    });
    app.get('/create', function(req,res){

        // Generate unique id for the room
        var id = Math.round((Math.random() * 1000000));

        // Redirect to the random room
        res.cookie('topic-id', id, {path: '/room/'});
        res.redirect('/topic/'+id);
    });

    app.get('/topic/:id', function(req,res){
        console.log(req.session.passport);
        // Render the chant.html view
        res.render('controls/topic');
    });

    app.get('/mytopics', function(req, res, next){
        var topics = topicController.getUserTopics(userSession.user, function(error, model){
            console.log(model);
            res.render('controls/mytopics', {topics: model});
        });
    });
    app.get('/feeds', function(req, res, next){
        res.render('controls/feeds');
    });

    app.post('/topics/create', function(req, res, next){
        const name = req.body.topicName,
            pictureUrl = req.body.pictureUrl,
            siteUrl = req.body.siteUrl,
            topicDesc = req.body.topicDesc;
        console.log('Name: '+ name);
        console.log('Name: '+ pictureUrl);
        console.log('Name: '+ siteUrl);
        console.log('Name: '+ topicDesc);
        topicController.saveNewTopic(name,userSession.user,pictureUrl,siteUrl,topicDesc, function(error,model){
            if(error) console.log(error);
            res.redirect('http://localhost:3001/mytopics');
        })
    });
    var socketConfig = io.on('connection', function (socket) {
        require('../socket.io')(io,socket);
    });
};

module.exports = routeConfig;

