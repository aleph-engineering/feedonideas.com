'use strict';
const feedController = require('../controllers').feedController;

const feedsSocket = function(io, socket, profile){

    /**
     * Enter to feeds room event
     */
    socket.on('enterFeedsRoom', function(data){
        socket.roomId = data.roomId;
        socket.join(data.roomId);
    });

    /**
     * Create new feed event
     */
    socket.on('createFeed', function(data){
        feedController.saveNewFeedWithRoomId(socket.roomId, socket.userId, profile.loginAvatarUrl ,data.feedBody, function(error, model){
            io.in(socket.roomId).emit('feedCreated', {feed: model});
        })
    });

    /**
     * Vote up event
     */
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

    /**
     * Vote down event
     */
    socket.on('voteDown', function(data){
        feedController.setDown(data.feed, socket.userId, function(error, model){
            if(!error){
                io.in(socket.roomId).emit('getVoteDowns', {feedId: model._id, downs: model.downs.length});
            }
        });
    });
};
module.exports = feedsSocket;
