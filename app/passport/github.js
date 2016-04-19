'use strict';

const passport = require('passport'),
    githubStrategy = require('passport-github').Strategy,
    userProfile = require('../models').UserProfile,
    githubUser = require('../models').GitHubUser,
    userController = require('../controllers').userController;

const githubConfig = function(app){
    passport.use(new githubStrategy({
        clientID: (process.env.GITHUB_CLIENT_ID || ""),
        clientSecret: (process.env.GITHUB_CLIENT_SECRET || ""),
        callbackURL: "/auth/github/callback"
    },
        function(accessToken, refreshToken, profile, done) {
            userProfile.findOne({'gitHubUser.id': profile._json.id})
                .then(function(user){
                    if(user) return done(null, user);
                    else{
                        var newGitHubUser = new githubUser({
                            id: profile._json.id,
                            name: profile._json.name,
                            username: profile._json.login,
                            email: profile._json.email,
                            avatar: profile._json.avatar_url,
                            profileUrl: profile._json.html_url,
                            company: profile._json.company,
                            gender: profile._json.gender,
                            location: profile._json.location
                        });

                        userController.checkProfileExist(profile._json.email, function(error, model){
                            if(error) return done(null, null);
                            if(model){
                                model.gitHubUser = newGitHubUser;
                                model.save(function(error){
                                    if(!error) return done(null, user);
                                    else{
                                        console.log(error);
                                    }
                                })
                            }
                            else{
                                var newProfile = new userProfile({
                                    name : profile._json.displayName
                                });
                                newProfile.gitHubUser = newGitHubUser;
                                newProfile.save(function(err){
                                    if (!err) return done(null, newProfile);
                                    else {
                                        console.log("ERROR: " + err);}
                                });
                            }
                        })
                    }
                })
        }
    ));


    app.get('/auth/github', passport.authenticate('github'));

    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });
};
module.exports = githubConfig;
