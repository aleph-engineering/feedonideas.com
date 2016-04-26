'use strict';
var fs = require('fs');
const userController = require('../controllers').userController;

var apiRoutes = function(app){
    app.get('/api/login_avatar/:userId', function(req, res){
        var userId = req.params.userId;
        console.log("USER ID: " + userId);
        if(userId) {
            userController.getUserLoginAvatar(userId, function (error, avatar) {
                console.log("AVATAR: " + avatar);
                res.writeHead(200, {'Content-type':'image/webb'});
                res.end(avatar);
            })
        }
        else
            res.status(404).send("You need to specify a correct identifier");
    });

    app.get('/api/feedremote.js', function(req, res){
        fs.readFile(__dirname + '/../../public/files/feedonideas.js',"utf-8" ,function(error, content){
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(content, 'utf-8');
        });
    })
};

module.exports = apiRoutes;
