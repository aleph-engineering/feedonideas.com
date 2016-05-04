'use strict';
const passport = require('passport'),
    profile = require('../models').UserProfile;

const passportConfig = function(app){

    app.use(passport.initialize());
    app.use(passport.session());

    /*passport.serializeUser(localUser.serializeUser());
     passport.deserializeUser(localUser.deserializeUser());
     passport.deserializeUser(function(user, done){
     done(null, user);
     });*/
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        profile.findById(id, function(err, user) {
            done(err, user);
        });
    });

    require('./facebook')(app);
    require('./google')(app);
    require('./linkedin')(app);
    require('./github')(app);
    //require('./bearer')(app);
};

module.exports = passportConfig;
