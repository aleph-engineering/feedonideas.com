'use strict';
const feedController = require('../controllers').feedController,
    topicController = require('../controllers').topicController;

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
        topicController.getTopicByRoomId(socket.roomId, (error, topic) =>{
            if(!error){
                feedController.setUp(data.feed, socket.userId, topic.maxUpsPerUser, (error, feed)=>{
                    if(!error){
                        io.in(socket.roomId).emit('getVoteUps', {feedId: feed._id, ups: feed.ups.length});
                    }
                    else{
                        socket.emit('errorToast', {error : error.message});
                    }
                })
            }
            else{
                socket.emit('errorToast', {error : error});
            }
        });
    });

    /**
     * Vote down event
     */
    socket.on('voteDown', function(data) {
        topicController.getTopicByRoomId(socket.roomId, (error, topic) => {
            if (!error) {
                feedController.setDown(data.feed, socket.userId, topic.maxDownsPerUser, (error, feed)=> {
                    if (!error) {
                        io.in(socket.roomId).emit('getVoteDowns', {feedId: feed._id, downs: feed.downs.length});
                    }
                    else {
                        socket.emit('errorToast', {error: error.message});
                    }
                })
            }
            else {
                socket.emit('errorToast', {error: error});
            }
        });
    });
};
module.exports = feedsSocket;
