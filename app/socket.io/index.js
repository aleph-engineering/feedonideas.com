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
        if(room.length < 1000){
            socket.join(data.roomId);
            socket.roomId = data.roomId;
        }
    });
    socket.on('createFeed', function(data){
        findClientsSocket(io, socket.roomId);
        feedController.saveNewFeedWithRoomId(socket.roomId, socket.userId, data.feedBody, function(error, model){
            console.log("ERROR: " + error);
            io.in(socket.roomId).emit('feedCreated', {feed: model});
        })
    });

    socket.on('voteUp', function(data){
        feedController.setUp(data.feed, socket.userId, function(error, model){
            if(!error){
                io.in(socket.roomId).emit('getVoteUps', {feedId: model._id, ups: model.ups.length});
            }
            else{
                console.log("VOTE UP ERROR: " + error);
            }
        });
    });
    socket.on('voteDown', function(data){
        feedController.setDown(data.feed, socket.userId, function(error, model){
            if(!error){
                io.in(socket.roomId).emit('getVoteDowns', {feedId: model._id, downs: model.downs.length});
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
