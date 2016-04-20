'use strict';

const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    userProfile = require('../models').UserProfile,
    localUser = require('../models').LocalUser,
    userController = require('../controllers').userController;
