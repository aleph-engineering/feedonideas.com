'use strict';
const feedController = require('../controllers').feedController,
    topicController = require('../controllers').topicController;

const feedsSocket = function(io, socket, profile){

    /**
     * Enter to feeds room event
     */
    socket.on('enterFeedsRoom', function(data){
        if(data.topic){
            topicController.getTopicById(data.topic, (error, model) => {
                if(model){
                    socket.topicId = model.id;
                    socket.join(model.id);
                }
            })
        }
    });

    /**
     * Create new feed event
     */
    socket.on('createFeed', function(data){
        if(socket.topicId && data.feedBody){
            topicController.getTopicById(socket.topicId, (error, topic) => {
                if(topic){
                    feedController.saveNewFeedWithTopicId(topic.id, socket.userId, profile.loginAvatarUrl, data.feedBody, (error, feed) =>{
                        io.in(socket.topicId).emit('feedCreated', {feed: feed});
                    })
                }
            })
        }
    });

    /**
     * Vote up event
     */
    socket.on('voteUp', function(data){
        topicController.getTopicById(socket.topicId, (error, topic) =>{
            if(!error){
                feedController.setUp(data.feed, socket.userId, topic.maxUpsPerUser, (error, feed)=>{
                    if(!error){
                        io.in(socket.topicId).emit('getVoteUps', {feedId: feed._id, ups: feed.ups.length});
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
        topicController.getTopicById(socket.topicId, (error, topic) => {
            if (!error) {
                feedController.setDown(data.feed, socket.userId, topic.maxDownsPerUser, (error, feed)=> {
                    if (!error) {
                        io.in(socket.topicId).emit('getVoteDowns', {feedId: feed._id, downs: feed.downs.length});
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
