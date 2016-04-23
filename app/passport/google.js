'use strict';

const passport = require('passport'),
    googleStrategy = require('passport-google-oauth2').Strategy,
    userProfile = require('../models').UserProfile,
    googleUser = require('../models').GoogleUser,
    userController = require('../controllers').userController;

const googleConfig = function(app){
    passport.use(new googleStrategy({
            clientID: ( process.env.GOOGLE_CLIENT_ID || ''),
            clientSecret: (process.env.GOOGLE_CLIENT_SECRET || ''),
            callbackURL: "/auth/google/callback",
            profileFields: ['id','displayName', 'picture', 'gender', 'birthday' , 'email']
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile);
            userProfile.findOne({ 'googleUser.id': profile._json.id })
                .then(function(user){
                    if(user){
                        return done(null, user)
                    }
                    else {
                        var newGoogleUser = new googleUser({
                            id : profile._json.id,
                            email : profile.email,
                            name : profile.displayName,
                            avatarUrl : profile._json.image.url.replace("sz=50", "sz=200"),
                            gender : profile._json.gender,
                            birthday : profile._json.birthday
                        });

                        userController.checkProfileExist(profile.email, function(error, model){
                            if(error) { return done(null, null) }
                            if(model){
                                model.googleUser = newGoogleUser;
                                model.loginAvatarUrl = newGoogleUser.avatarUrl;
                                model.save(function(err, model){
                                    if(!err) return done(null, model);
                                    else{
                                        console.log("SAVING ERROR: " + err);}
                                });
                            }
                            else{
                                var newProfile = new userProfile({
                                    name : newGoogleUser.name,
                                    loginAvatarUrl: newGoogleUser.avatarUrl
                                });
                                newProfile.googleUser = newGoogleUser;
                                newProfile.save(function(err, model){
                                    if (!err) return done(null, model);
                                    else {
                                        console.log("SAVING ERROR: " + err);}
                                });
                            }
                        });
                    }
                });
        }
    ));
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });
};

module.exports = googleConfig;
