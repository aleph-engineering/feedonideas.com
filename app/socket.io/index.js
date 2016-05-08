'use strict';
const models = require('../models'),
    controllers = require('../controllers'),
    userProfile = models.UserProfile,
    userController = controllers.userController,
    topicController = controllers.topicController,
    feedController = controllers.feedController;

var socketConfig = function(io, socket, profile){
    require('./feedsSocket')(io, socket, profile);
};
module.exports = socketConfig;
