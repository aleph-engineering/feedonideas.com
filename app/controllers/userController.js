'use strict';

const userProfile = require('../models').UserProfile;

const userController = {
    /**
     * Check if email exists in one of the current profiles(fb,ln,gh,g+)
     * @param email
     * @param callback
     */
    checkProfileExist(email, callback) {
        if (typeof callback === "function") {
            userProfile.findOne({$or: [{'googleUser.email': email}, {'facebookUser.email': email}, {'linkedInUser.email': email}, {'gitHubUser.email': email}, {'email': email}]},
                (error, model) => {
                    callback(error, model);
                });
        }
    },
    getUserById(id, callback) {
        if (typeof callback === "function") {
            userProfile.findById(id, function (error, model) {
                callback(error, model);
            });
        }
    },
    getUserLoginAvatar(userId, callback) {
        userProfile.findById(userId, function (error, model) {
            callback(error, model.loginAvatarUrl);
        })
    },
    createNonRegisteredUser(email, callback){
        var newUser = new userProfile({
            email: email,
            loginAvatarUrl: "/images/empty_avatar.jpg"
        });
        newUser.save((error,model)=>{
            if(!error) return model;
        })
    }


};
module.exports = userController;
