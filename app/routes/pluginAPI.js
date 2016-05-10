'use strict';

const feedModel = require('../models').Feed,
    feedController = require('../controllers').feedController,
    userController = require('../controllers').userController,
    topicController = require('../controllers').topicController;

var feedsApi = function(app, io){
    app.get('/api/plugin/auth_client', (req, res) =>{
        res.jsonp({topic: req.clientTopic});
    });

    app.get('/api/plugin/feeds/',(req, res)=>{
        let topicId = req.query.topic;
        var query = feedModel.find({topicId: topicId});
        query.limit(5);
        query.exec((error, model) => {
            console.log(model);
            if(!error)
                res.jsonp({feeds: model});
        })
    });
    app.get('/api/plugin/feeds/create/', (req, res) => {
        var body = req.query.body,
            authorEmail = req.query.author,
            emailRegex = /.+@.+/;
        if(authorEmail && emailRegex.test(authorEmail)){
            userController.checkProfileExist(authorEmail, (error, user) => {
                if(user){
                    feedController.saveNewFeedWithTopicId(req.clientTopic,user._id, user.loginAvatarUrl ,body, (error, model)=>{
                        io.in(req.clientTopic).emit('feedCreated', {feed: model});
                        res.jsonp("Feed registered successfully");
                    });
                }
                else{
                    userController.createNonRegisteredUser(authorEmail, (error, model) =>{
                        feedController.saveNewFeedWithTopicId(req.clientTopic, model._id, model.loginAvatarUrl ,body, (error, model) => {
                            io.in(req.clientTopic).emit('feedCreated', {feed: model});
                            res.jsonp("Feed registered successfully");
                        })
                    })
                }
            });

        }
        else{
            topicController.getTopicById(req.clientTopic, (error, topic) =>{
                console.log(req.clientTopic);
                console.log(topic);
                userController.getUserById(topic.anonymousUser, (error, user) => {
                    feedController.saveNewFeedWithTopicId(topic._id, topic.anonymousUser, user.loginAvatarUrl ,body, (error, model) =>{
                        io.in(req.clientTopic).emit('feedCreated', {feed: model});
                        res.jsonp("Feed registered successfully");
                    })
                });
            })
        }
    })
};

module.exports = feedsApi;
