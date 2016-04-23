'use strict';

const passport = require('passport'),
    facebookStrategy = require('passport-facebook').Strategy,
    userProfile = require('../models').UserProfile,
    facebookUser = require('../models').FacebookUser,
    userController = require('../controllers').userController;

const facebookConfig = function(app){
    passport.use(new facebookStrategy({
            clientID: (process.env.FACEBOOK_APP_ID || ""),
            clientSecret: (process.env.FACEBOOK_APP_SECRET || ""),
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id','displayName', 'picture.type(large)', 'gender' ,'email'],
            enableProof: true
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            userProfile.findOne({ 'facebookUser.id': profile._json.id })
                .then(function(user){
                    if(user) return done(null, user);
                    else {
                        var newFacebookUser = new facebookUser({
                            id : profile._json.id,
                            name : profile._json.name,
                            email: profile._json.email,
                            gender: profile._json.gender,
                            avatarUrl: profile._json.picture.data.url
                        });

                        userController.checkProfileExist(profile._json.email,function(error,model){
                            if(error) { return done(null, null) }
                            if(model){
                                model.facebookUser = newFacebookUser;
                                model.loginAvatarUrl= profile._json.picture.data.url;
                                model.save(function(err){
                                    if(!err) return done(null, model);
                                    else{
                                        console.log(err);}
                                });
                            }
                            else{
                                var newProfile = new userProfile({
                                    name : profile._json.name,
                                    loginAvatarUrl: profile._json.picture.data.url
                                });
                                newProfile.facebookUser = newFacebookUser;
                                newProfile.save(function(err){
                                    if (!err) return done(null, newProfile);
                                    else {
                                        console.log("ERROR: " + err);}
                                });
                            }
                        });
                    }
                });
        }
    ));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email']}));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            res.cookie('provider', 'facebook');
            res.redirect('/');
        });
};

module.exports = facebookConfig;
