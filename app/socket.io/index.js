'use strict';
const models = require('../models'),
    controllers = require('../controllers'),
    userProfile = models.UserProfile,
    userController = controllers.userController,
    topicController = controllers.topicController,
    feedController = controllers.feedController;

const socketConfig = function(io, socket, userId){

    socket.on('enterFeedsRoom', function(data){
        var room = findClientsSocket(io,data.roomId);
        if(room.length < 100){
            socket.join(data.roomId);
        }
    });
    socket.on('createFeed', function(data){
        var room = findClientsSocket(io, data.roomId);
        feedController.saveNewFeedWithRoomId(data.roomId, socket.userId, data.feedBody, function(error, model){
            console.log("ERROR: " + error);
            io.in(data.roomId).emit('feedCreated', {feed: model});
        })
    });
    socket.on('enter-topic', function(data){
        var room = findClientsSocket(io, data.id);
        socket.userId = userController.getUserById(user)
    });

    socket.on('voteUp', function(data){
        var room = findClientsSocket(io, data.id);
        feedController.setUp(data.feed, userId, function(error, model){
            if(!error){
                io.in(data.id).emit('setVoteUp', {feedId: model._id});
            }
        });
    });
};
function findClientsSocket(io,roomId, namespace) {
    var res = [],
        ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms[roomId];
                if(index) {
                    res.push(ns.connected[id]);
                }
            }
            else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}
module.exports = socketConfig;
