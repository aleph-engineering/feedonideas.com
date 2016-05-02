'use strict';

const models = require('../models'),
    topicController = require('./topicController'),
    feed = models.Feed;

var feedController = {
    saveNewFeedWithTopicId(topicId, authorId, text, callback){
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
    saveNewFeedWithRoomId(roomId, authorId, avatarUrl ,text, callback){
        if (typeof callback === "function") {
            topicController.getTopicByRoomId(roomId, function(error, model){
                if(!error){
                    var newFeed = new feed({
                        topicId: model._id,
                        authorId: authorId,
                        authorAvatar: avatarUrl,
                        body: text
                    });
                    newFeed.save(function(error, model){
                        callback(error,model);
                    })
                }
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
    setUp(feedId, userId, maxUps ,callback){
        if (typeof callback === "function") {
            feed.findById(feedId, function(error, model){
                if(!error){
                    if(model.ups.length > 0){
                        let userUps = model.ups.filter((value)=> {
                            return value === userId;
                        });
                        if (maxUps > userUps.length) {
                            model.ups.push(userId);
                            model.save(callback(error, model));
                        }
                        else (callback(new Error("You can't give more 'Ups' to this feed."), null));
                    }
                    else{
                        model.ups.push(userId);
                        model.save(callback(error, model));
                    }
                }
                else callback(error | null, null);
            });
        }
    },
    setDown(feedId, userId, maxDowns, callback) {
        if (typeof callback === "function") {
            feed.findById(feedId, function(error, model){
                if(!error){
                    if(model.downs.length > 0){
                        let userDowns = model.downs.filter((value)=> {
                            return value === userId;
                        });
                        if (maxDowns > userDowns.length) {
                            model.downs.push(userId);
                            model.save(callback(error, model));
                        }
                        else (callback(new Error("You can't give more 'Downs' to this feed."), null));
                    }
                    else{
                        model.downs.push(userId);
                        model.save(callback(error, model));
                    }
                }
                else callback(error | null, null);
            });
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
    },
    getFeedsByRoomId(roomId, callback){
        if (typeof callback === "function") {
            topicController.getTopicByRoomId(roomId, function(error, model){
                if(!error){
                    feed.find({topicId: model._id}, function(error, models){
                        callback(error, models);
                    })
                }
            })
        }
    }

};

module.exports = feedController;
