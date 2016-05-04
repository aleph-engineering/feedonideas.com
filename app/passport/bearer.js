'use strict';

const passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    TokenModel = require('../models').Token,
    UserProfile = require('../models').UserProfile;



const tokenConfig = function(app){
    passport.use(new BearerStrategy(
        (token, callback) => {
            console.log("TOKEN: " + token);
            TokenModel.findOne({value: token}, (error, token) => {
                if(error) { return callback(error) }
                if (!token) { return callback(null, false); }

                UserProfile.findById(token.userId, (error, user) => {
                    if(error) { return callback(error) }
                    if(!user) { return callback(null, false) }
                    callback(null, user);
                })
            })
    }));

    app.get('/auth/client', passport.authenticate('bearer', {session: false}));
};

module.exports = tokenConfig;




