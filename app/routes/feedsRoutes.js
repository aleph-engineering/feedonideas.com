'use strict';
const feedsController = require('../controllers').feedController,
    topicController = require('../controllers').topicController;

var feedsRoutes = function(app){
    app.get('/feeds', (req, res) => {
        const topicId = req.query.topic;
        if(topicId){
            topicController.getTopicById(topicId, (error, topic) => {
                if(topic){
                    feedsController.getFeedsByTopic(topic.id, (error, feeds) => {
                        if(!error){
                            res.render('controls/feeds', { title: topic.name, feeds: feeds, topic: topic.id, userProfile: req.user });
                        }
                    })
                }
            });
        }
    })
};

module.exports = feedsRoutes;
