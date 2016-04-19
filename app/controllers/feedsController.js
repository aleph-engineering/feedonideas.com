'use strict';

const models = require('../models'),
    userProfile = models.UserProfile,
    feed = models.Feed;

var feedController = {
    saveNewFeed(topicId, authorId, text, callback){
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
    getFeedsByTopic(topicId, callback){
        if (typeof callback === "function") {
            feed.find({topicId: topicId}, function(error, models){
                callback(error, models);
            })
        }
    },
    setUp(feedId, userId, callback){
        if (typeof callback === "function") {
            feed.findById(feedId, function(error, model){
                if(!error){
                    model.ups.push(userId);
                    model.save(callback(error, model));
                }
            });
        }
    },
    setDown(feedId, userId, callback) {
        if (typeof callback === "function") {
            var feedModel = feed.findOne(feedId, function (error, model) {
                if(!error) return model;
            });
            feedModel.downs.push(userId);
            feedModel.save(function (error, model) {
                callback(error, model);
            })
        }
    },
    getUps(feedId, userId, callback){
        if (typeof callback === "function") {
            feed.find({_id: feedId, ups: userId}, function(error, model){
                callback(error, model.length);
            })
        }
    },
    getDowns(feedId, userId, callback){
        if (typeof callback === "function") {
            feed.find({_id: feedId, downs: userId}, function(error, model){
                callback(error, model.length);
            })
        }
    }


};

module.exports = feedController;
