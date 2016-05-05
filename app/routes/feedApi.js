'use strict';

const feedModel = require('../models').Feed,
    feedController = require('../controllers').feedController;

var feedsApi = function(app){
    app.get('/api/feeds/',(req, res)=>{
        let topicId = req.query.topic;
        var query = feedModel.find({topicId: topicId});
        query.limit(5);
        query.exec((error, model) => {
            console.log(model);
            if(!error)
                res.jsonp({feeds: model});
        })
    });
    app.post('/api/feeds/create', (req, res) => {
        var body = req.query.body, authorEmail = req.body.author;

    })
};

module.exports = feedsApi;
