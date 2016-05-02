'use strict';

const models = require('../models'),
    userProfile = models.UserProfile,
    topic = models.Topic;


function addDeletePermissions(currentUserId, topics){
    topics.forEach(function(element, index, array){
        var creator = element.authorId;
        element.canDelete = creator === currentUserId;
    });
    return topics;
}

var topicController = {
    findTopicById(topicId, callback){
        if (typeof callback === "function") {
            topic.findById(topicId, function (error, model) {
                callback(error, model);
            })
        }
    },
    getAllTopics(currentUser, callback){
        if (typeof callback === "function") {
            topic.find(function(error, model){
                model = addDeletePermissions(currentUser.id, model);
                callback(error, model);
            })
        }
    },
    getAvailableTopics(currentUser, callback){
        if (typeof callback === "function") {
            topic.find({available: true},(error, model)=>{
                model = addDeletePermissions(currentUser.id, model);
                callback(error, model);
            })
        }
    },
    getUserTopics(userId, callback){
        if (typeof callback === "function") {
            topic.find({authorId: userId}, function(error, model){
                model = addDeletePermissions(userId, model);
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
    deleteTopic(topicId, callback){
        if (typeof callback === "function") {
            topic.findByIdAndRemove(topicId, function(error, model){
                callback(error, model);
            });
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
                callback(error, model);
            })
        }
    }


};

module.exports = topicController;
