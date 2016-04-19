'use strict';

const userProfile = require('../models').UserProfile;

const userController = {
    /**
     * Check if email exists in one of the current profiles(fb,ln,gh,g+)
     * @param email
     * @param callback
     */
    checkProfileExist: function(email, callback){
        if (typeof callback === "function") {
            userProfile.findOne({$or: [{'googleUser.email': email}, {'facebookUser.email': email}, {'linkedInUser.email': email}, {'gitHubUser.email': email}, {'localUser.email': email}]},
                function (error, model) {
                    callback(error,model);
                });
        }
    },
    getUserById: function(id, callback){
        if (typeof callback === "function") {
            userProfile.findById(id, function(error, model){
                callback(error, model);
            });
        }
    }

};
module.exports = userController;
