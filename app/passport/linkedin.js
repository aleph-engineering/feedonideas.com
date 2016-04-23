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
            state: true
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("FUCK YOU");
            console.log(profile);
            userProfile.findOne({ 'linkedInUser.id': profile._json.id })
                .then(function(user){
                    if(user) return done(null, user);
                    else {
                        var newLinkedInUser = new linkedInUser({
                            id : profile._json.id,
                            name : profile._json.firstName,
                            email: profile._json.emailAddress,
                            avatarUrl: profile._json.pictureUrl,
                            headline: profile._json.headline,
                            industry: profile._json.industry,
                            country: profile._json.location.name,
                            profileUrl: profile._json.publicProfileUrl,
                            positions: profile._json.positions,
                            summary: profile._json.summary
                        });

                        userController.checkProfileExist(profile._json.email,function(error,model){
                            if(error) { return done(null, null) }
                            if(model){
                                model.linkedInUser = newLinkedInUser;
                                model.loginAvatarUrl = newLinkedInUser.avatarUrl;
                                model.save(function(err){
                                    if(!err) return done(null, model);
                                    else{
                                        console.log(err);}
                                });
                            }
                            else{
                                var newProfile = new userProfile({
                                    name : newLinkedInUser.name,
                                    loginAvatarUrl: newLinkedInUser.avatarUrl
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
    app.get('/auth/linkedin', passport.authenticate('linkedin'), function(req, res){});

    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/home'}),
        function(req, res) {
            res.redirect('/');
        });
};

module.exports = linkedinConfig;
