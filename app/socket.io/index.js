'use strict';
const models = require('../models'),
    controllers = require('../controllers'),
    userProfile = models.UserProfile,
    userController = controllers.userController,
    topicController = controllers.topicController,
    feedController = controllers.feedController;

var socketConfig = function(io, socket, profile){
    require('./feedsSocket')(io, socket, profile);
};
function findClientsSocket(io,roomId, namespace) {
    var res = [],
        ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms[roomId];
                if(index) {
                    res.push(ns.connected[id]);
                }
            }
            else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}
module.exports = socketConfig;
