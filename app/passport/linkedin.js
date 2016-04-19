'use strict';

const passport = require('passport'),
    linkedinStrategy = require('passport-linkedin-oauth2').Strategy,
    userProfile = require('../models').UserProfile,
    linkedInUser = require('../models').LinkedInUser,
    userController = require('../controllers').userController;

const linkedinConfig = function(app){
    passport.use(new linkedinStrategy({
            clientID: ( process.env.LINKEDIN_API_KEY || '123'),
            clientSecret: (process.env.LINKEDIN_SECRET_KEY || '123'),
            callbackURL: "http://localhost:3001/auth/linkedin/callback",
            scope: ['r_emailaddress', 'r_basicprofile'],
            state: true,
            passReqToCallback: true
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("FUCK YOU");
            console.log(profile);
            req.session.accessToken = accessToken;
            userProfile.findOne({ 'linkedInUser.id': profile._json.id })
                .then(function(user){
                    if(user) return done(null, user);
                    else {
                        var newLinkedInUser = new linkedInUser({
                            id : profile._json.id,
                            name : profile._json.name,
                            email: profile._json.email
                        });

                        userController.checkProfileExist(profile._json.email,function(error,model){
                            if(error) { return done(null, null) }
                            if(model){
                                model.linkedInUser = newLinkedInUser;
                                model.save(function(err){
                                    if(!err) return done(null, model);
                                    else{
                                        console.log(err);}
                                });
                            }
                            else{
                                var newProfile = new userProfile({
                                    //name : profile._json.displayName
                                });
                                newProfile.linkedInUser = newLinkedInUser;
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
    app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'login_state'}));

    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
            successRedirect: '/',
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/');
        });
};

module.exports = linkedinConfig;
