'use strict';
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
};

module.exports = apiRoutes;
