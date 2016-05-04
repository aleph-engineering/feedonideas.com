'use strict';

const multer = require('multer'),
    uuid = require('uuid');

const topicModel = require('../models').Topic,
    tokenModel = require('../models').Token,
    topicController = require('../controllers').topicController;

var upload = multer({
    dest: 'public/uploads/',
    limits: {
        fileSize: 2 * 1024 * 1024 //2 MB
    }
});

const topicRoutes = function(app){

    app.get('/topics', function(req, res){
        topicController.getAvailableTopics(req.user, (error, model)=> {
            if(!error) res.render('topics', {title: "Public Topics", publicTopics: model, userProfile: req.user });
            else res.redirect('/profile');
        });
    });

    app.get('/topic/delete/:id', function(req, res){
        topicController.deleteTopic(req.params.id, function(error, model){
            res.redirect(req.headers['referer']);
        });
    });

    app.get('/mytopics', function(req, res, next){
        topicController.getUserTopics(req.user.id, function(error, model){
            res.render('controls/mytopics', { title: "My topics", userProfile: req.user, myTopics: model});
        });
    });

    app.post('/mytopics/create', upload.single('picture'), function(req, res, next){
        var newTopic = new topicModel({
            name : req.body.topicName,
            siteUrl : req.body.siteUrl,
            topicDesc : req.body.description,
            roomId : uuid.v1(),
            category : req.body.category,
            authorId : req.user.id,
            pictureUrl : '/uploads/' + req.file.filename,
            available : true,
            maxUpsPerUser : req.body.maxUps,
            maxDownsPerUser : req.body.maxDowns
        });
        newTopic.save(function(error, model){
            if(!error){
                var token = new tokenModel({
                    value: uuid.v1(),
                    userId: req.user.id,
                    clientId: model._id
                });
                token.save(function(error, model){
                    if(error){ console.log(error);}
                });
                topicController.getUserTopics(req.user.id, function(error, model){
                    console.log(model);
                    res.render('controls/mytopics', { title: "My Topics", userProfile: req.user, myTopics: model});
                });
            }
            else {
                console.log("ERROR SAVING TOPIC: " + error);
                res.redirect("/mytopics");
            }
        });
    });

    app.get('/mytopics/create', function(req, res, next){
        res.render('controls/createTopic', {title: 'Create Topic', userProfile: req.user});
    });

    app.get('/topic/:id', function(req,res){
        res.render('controls/topic', {title: 'Topic'});
    });
};
module.exports = topicRoutes;
