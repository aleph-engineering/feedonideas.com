'use strict';

const models = require('../models'),
    userProfile = models.UserProfile,
    topicModel = models.Topic,
    feed = models.Feed;


function addDeletePermissions(currentUserId, topics){
    topics.forEach(function(element, index, array){
        var creator = element.authorId;
        element.canDelete = creator === currentUserId;
    });
    return topics;
}

var topicController = {
    getAllTopics(currentUser, callback){
        if (typeof callback === "function") {
            topicModel.find(function(error, model){
                model = addDeletePermissions(currentUser.id, model);
                callback(error, model);
            })
        }
    },
    getAvailableTopics(currentUser, callback){
        if (typeof callback === "function") {
            topicModel.find({available: true},(error, model)=>{
                model = addDeletePermissions(currentUser.id, model);
                callback(error, model);
            })
        }
    },
    getUserTopics(userId, callback){
        if (typeof callback === "function") {
            topicModel.find({authorId: userId}, function(error, model){
                model = addDeletePermissions(userId, model);
                callback(error, model);
            })
        }
    },
    saveNewTopic(name, userId, pictureUrl, siteUrl, description, callback){
        if (typeof callback === "function") {
            var newTopic = new topicModel({
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
            topicModel.findByIdAndRemove(topicId, function(error, model){
                if (!error) {
                    feed.remove({topicId: topicId}, function(error){
                        callback(error, model);
                    });
                } else {
                    callback(error, model);
                }
            });
        }
    },
    getMaxUps(topicId, callback){
        if (typeof callback === "function") {
            topicModel.findById(topicId, function(error, model){
                callback(error, model.maxUpsPerUser);
            })
        }
    },
    getTopicByRoomId(roomId, callback){
        if (typeof callback === "function") {
            topicModel.findOne({roomId: roomId}, function(error, model){
                callback(error, model);
            })
        }
    },
    getTopicById(topicId, callback){
        if (typeof callback === "function") {
            topicModel.findById(topicId, (error, model) => {
                callback(error, model);
            });
        }
    }


};

module.exports = topicController;
