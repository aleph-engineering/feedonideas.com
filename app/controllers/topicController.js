'use strict';

const models = require('../models'),
    userProfile = models.UserProfile,
    topic = models.Topic;

var topicController = {
    findTopicById(topicId, callback){
        if (typeof callback === "function") {
            topic.findById(topicId, function (error, model) {
                callback(error, model);
            })
        }
    },
    getAllTopics(callback){
        if (typeof callback === "function") {
            topic.find(function(error, model){
                callback(error, model);
            })
        }
    },
    getUserTopics(userId, callback){
        if (typeof callback === "function") {
            topic.find({authorId: userId}, function(error, model){
                callback(error, model);
            })
        }
    },
    saveNewTopic(name, userId, pictureUrl, siteUrl, description, callback){
        if (typeof callback === "function") {
            var newTopic = new topic({
                name: name,
                roomId: Math.round((Math.random() * 1000000000)),
                authorId: userId,
                pictureUrl: pictureUrl,
                siteUrl: siteUrl,
                topicDesc: description
            });
            newTopic.save(function(error, model){
                callback(error, model);
            })
        }
    },
    getMaxUps(topicId, callback){
        if (typeof callback === "function") {
            topic.findById(topicId, function(error, model){
                callback(error, model.maxUpsPerUser);
            })
        }
    },
    getTopicByRoomId(roomId, callback){
        if (typeof callback === "function") {
            topic.findOne({roomId: roomId}, function(error, model){
                callback(error, model._id);
            })
        }
    }


};

module.exports = topicController;
