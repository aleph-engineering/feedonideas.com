'use strict';

const models = require('../models'),
    userProfile = models.UserProfile,
    feed = models.Feed;

var feedController = {
    saveNewFeed: function(topicId, authorId, text, callback){
        if (typeof callback === "function") {
            var newFeed = new feed({
                topicId: topicId,
                authorId: authorId,
                body: text
            });
            newFeed.save(function(error, model){
                callback(error,model);
            })
        }
    },
    getFeedsByTopic: function(topicId, callback){
        if (typeof callback === "function") {
            feed.find({topicId: topicId}, function(error, models){
                callback(error, models);
            })
        }
    },
    setUp: function(feedId, userId, callback){
        if (typeof callback === "function") {
            feed.findById(feedId, function(error, model){
                if(!error){
                    model.ups.push(userId);
                    model.save(callback(error, model));
                }
            });
        }
    },
    setDown: function(feedId, userId, callback) {
        if (typeof callback === "function") {
            var feedModel = feed.findOne(feedId, function (error, model) {
                return model;
            });
            feedModel.downs.push(userId);
            feedModel.save(function (error, model) {
                callback(error, model);
            })
        }
    }
};

module.exports = feedController;
