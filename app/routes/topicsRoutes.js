'use strict';

const topicModel = require('../models').Topic,
    topicController = require('../controllers').topicController;

const topicRoutes = function(app){
    app.get('/topics', function(req, res){
        topicController.getAvailableTopics((error, model)=> {
            if(!error) res.render('topics', {title: "Public Topics", publicTopics: model, userProfile: req.user });
            else res.redirect('/profile');
        });
    })
};
module.exports = topicRoutes;
