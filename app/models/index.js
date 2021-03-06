'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const LocalUser = new Schema({
    username    : { type: String },
    email       : { type: String },
    password    : { type: String }
});

const GoogleUserSchema = new Schema({
    id          : { type: String },
    name        : { type: String },
    email       : { type: String },
    avatarUrl   : { type: String },
    gender      : { type: String },
    profileUrl  : { type: String },
    birthday    : { type: String }
});

const FacebookUserSchema = new Schema({
    id          : { type: String },
    name        : { type: String },
    email       : { type: String },
    avatarUrl   : { type: String },
    profileUrl  : { type: String },
    gender      : { type: String }
});

const LinkedInUserSchema = new Schema({
    id          : { type: String},
    name        : { type: String },
    email       : { type: String },
    avatarUrl   : { type: String },
    headline    : { type: String },
    industry    : { type: String },
    country     : { type: String },
    profileUrl  : { type: String },
    summary     : { type: String },
    positions   : { type: Object }
});
const GitHubUserSchema = new Schema({
    id          : { type: String},
    name        : { type: String},
    username    : { type: String},
    email       : { type: String},
    avatarUrl   : { type: String},
    profileUrl  : { type: String},
    company     : { type: String},
    publicRepos : { type: Number},
    gender      : { type: String},
    location    : { type: String}

});

const CommentSchema = new Schema({
    author       : { type: String },
    body         : { type: String },
    creationDate : { type: Date, default: new Date()}
});

const FeedSchema = new Schema({
    topicId     : { type: String },
    authorId     : { type: String },
    authorAvatar : { type: String },
    body         : { type: String },
    creationDate : { type: Date, default: new Date()},
    ups          : [{ type: [String], default: [String] }],
    downs        : [{ type: [String], default: [String] }],
    comments     : [CommentSchema]
});

const UserProfileSchema = new Schema({
    availableVotes  : { type: Number},
    name            : { type: String },
    email           : { type: String },
    loginAvatarUrl  : { type: String },
    reg_date        : { type: Date, default: new Date()},
    googleUser      : GoogleUserSchema,
    facebookUser    : FacebookUserSchema,
    linkedInUser    : LinkedInUserSchema,
    gitHubUser      : GitHubUserSchema
});

const TopicSchema = new Schema({
    name            : { type: String, unique: true, required: true },
    category        : { type: String },
    roomId          : { type: String, unique: true },
    authorId        : { type: String },
    anonymousUser   : { type: String },
    pictureUrl      : { type: String },
    siteUrl         : { type: String },
    topicDesc       : { type: String },
    available       : { type: Boolean, default: false },
    maxUpsPerUser   : { type: Number },
    maxDownsPerUser : { type: Number }
});

const NotificationSchema =new Schema({
    receiver        : { type: String },
    message         : { type: String }
});

const CrashLogSchema = new Schema({
    date            : { type: Date, default: new Date()},
    text            : { type: String }
});

var TokenSchema   = new Schema({
    value: { type: String, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true }
});
var AuthorizedUrlSchema = new Schema({
    url         : { type: String },
    ownerId     : { type: String },
    topicId     : { type: String },
    enabled     : { type: Boolean, default: true}
});

module.exports = {
    GoogleUser: mongoose.model('googleUser', GoogleUserSchema),
    FacebookUser: mongoose.model('facebookUser', FacebookUserSchema),
    LinkedInUser: mongoose.model('linkedInUser', LinkedInUserSchema),
    GitHubUser: mongoose.model('gitHubUser', GitHubUserSchema),
    UserProfile: mongoose.model('userProfile', UserProfileSchema),
    Feed: mongoose.model('feed', FeedSchema),
    Topic: mongoose.model('topic', TopicSchema),
    Comment: mongoose.model('comment', CommentSchema),
    CrashLog : mongoose.model('crashLog', CrashLogSchema),
    Token: mongoose.model('token', TokenSchema),
    AuthorizedUrl: mongoose.model('authorized_url', AuthorizedUrlSchema)
};

