'use strict';
const userProfile = require('../models').UserProfile;

const socketConfig = function(socket){
    socket.on('voteUp')
};

module.exports = socketConfig;
