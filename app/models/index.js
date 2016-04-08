'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const GoogleUserSchema = new Schema({
    id          : { type: String },
    name        : { type: String },
    email       : { type: String },
    avatar      : { type: String },
    gender      : { type: String },
    birthday    : { type: String }
});

const FacebookUserSchema = new Schema({
    id          : { type: String},
    name        : { type: String },
    email       : { type: String },
    avatar      : { type: String },
    gender      : { type: String }
});

const LinkedInUserSchema = new Schema({
    id          : { type: String},
    name        : { type: String },
    email       : { type: String }
});
const GitHubUserSchema = new Schema({
    id          : { type: String},
    name        : { type: String},
    email       : { type: String }
});

const CommentSchema = new Schema({
    author       : { type: String },
    name         : { type: String },
    email        : { type: String },
    creationDate : { type: Date, default: new Date()}
});

const FeedSchema = new Schema({
    author       : { type: String },
    number       : { type : Number},
    creationDate : { type: Date, default: new Date()},
    ups          : { type : Number},
    downs        : { type : Number},
    comments     : [CommentSchema]
});
const UserProfileSchema = new Schema({
    availableVotes  : { type: Number},
    name            : { type: String },
    email           : { type: String },
    reg_date        : { type: Date, default: new Date()},
    feed            : [FeedSchema],
    googleUser      : GoogleUserSchema,
    facebookUser    : FacebookUserSchema,
    linkedInUser    : LinkedInUserSchema,
    gitHubUser      : GitHubUserSchema
});

const CrashLogSchema = new Schema({
    date            : { type: Date, default: new Date()},
    text            : { type: String }
});

module.exports = {
    GoogleUser: mongoose.model('googleUser', GoogleUserSchema),
    FacebookUser: mongoose.model('facebookUser', FacebookUserSchema),
    LinkedInUser: mongoose.model('linkedInUser', LinkedInUserSchema),
    GitHubUser: mongoose.model('gitHubUser', GitHubUserSchema),
    UserProfile: mongoose.model('userProfile', UserProfileSchema),
    Feed: mongoose.model('feed', FeedSchema),
    Comment: mongoose.model('comment', CommentSchema),
    CrashLog : mongoose.model('crashLog', CrashLogSchema)
};

