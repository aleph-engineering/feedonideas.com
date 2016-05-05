'use strict';

const aws = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    uuid = require('uuid'),
    path = require('path');

const topicModel = require('../models').Topic,
    userModel = require('../models').UserProfile,
    tokenModel = require('../models').Token,
    authorizedUrlModel = require('../models').AuthorizedUrl,
    topicController = require('../controllers').topicController;


/****************************
 * S3 Storage configuration *
 ****************************/
aws.config.update({
    accessKeyId: process.env.FOI_AMAZON_S3_KEY_ID,
    secretAccessKey: process.env.FOI_AMAZON_S3_ACCESS_KEY
});
aws.config.region = "ap-southeast-1";
var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'feedonideas.com',
        key: function (req, file, cb) {
            var ext = path.extname(file.originalname);
            cb(null, 'topic_covers/' + Date.now().toString() + ext);
        }
    }),
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
        var anonymousUser = new userModel({
            name: "anonymous_" + req.body.topicName,
            loginAvatarUrl: "/images/empty_avatar.jpg"
        });
        var newTopic = new topicModel({
            name : req.body.topicName,
            siteUrl : req.body.siteUrl,
            topicDesc : req.body.description,
            roomId : uuid.v1(),
            category : req.body.category,
            authorId : req.user.id,
            anonymousUser: anonymousUser._id,
            pictureUrl : req.file ? req.file.location : '/images/image-empty.png',
            available : true,
            maxUpsPerUser : req.body.maxUps,
            maxDownsPerUser : req.body.maxDowns
        });
        newTopic.save(function(error, model){
            if(!error){
                console.log(newTopic._id);
                anonymousUser.save((error, model)=>{
                    if(error) console.log("Error saving anoonymous user");
                });
                var authorizedUrl = new authorizedUrlModel({
                    url: newTopic.siteUrl,
                    ownerId: req.user.id,
                    topicId: newTopic._id
                });
                authorizedUrl.save(function (error, model){
                    if(error) {
                        console.log(error);}
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
