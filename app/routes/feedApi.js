'use strict';

const feedModel = require('../models').Feed,
    feedController = require('../controllers').feedController,
    userController = require('../controllers').userController,
    topicController = require('../controllers').topicController;

var feedsApi = function(app){
    app.get('/api/feeds/',(req, res)=>{
        let topicId = req.query.topic;
        var query = feedModel.find({topicId: topicId});
        query.limit(5);
        query.exec((error, model) => {
            console.log(model);
            if(!error)
                res.jsonp({feeds: model});
        })
    });
    app.get('/api/feeds/create/', (req, res) => {
        var body = req.query.body,
            authorEmail = req.query.author,
            emailRegex = /.+@.+/;
        if(authorEmail && emailRegex.test(authorEmail)){
            userController.checkProfileExist(authorEmail, (error, user) => {
                if(user){
                    feedController.saveNewFeedWithTopicId(req.clientTopic,user._id, user.loginAvatarUrl ,body, (error, model)=>{});
                }
                else{
                    userController.createNonRegisteredUser(authorEmail, (error, model) =>{
                        feedController.saveNewFeedWithTopicId(req.clientTopic, model._id, body, (error, model) => {})
                    })
                }
            });
            res.jsonp("Feed registered successfully");
        }
        else{
            topicController.getTopicById(req.clientTopic, (error, topic) =>{
                userController.getUserById(topic.anonymousUser, (error, user) => {
                    feedController.saveNewFeedWithTopicId(topic._id, topic.anonymousUser, user.loginAvatarUrl ,body, (error, model) =>{
                        res.jsonp("Feed registered successfully");
                    })
                });
            })
        }
    })
};

module.exports = feedsApi;
