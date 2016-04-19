$(function(){
    "use strict";
    var topicId = $.cookie('topic-id');
    var socket = io();

    connection(socket, topicId);
});

function connection(socket, topicId){
    "use strict";
    socket.on('connection', function(){
        socket.emit("enterFeedRoom", topicId);
    })
}
