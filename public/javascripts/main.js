$(function(){
    "use strict";
    var topicId = $.cookie('topic-id');
    $('#cookieName').text(topicId);

    var socket = io();


    socket.on('connection', function(data){
        socket.emit('userConnected', topicId);
    });
    socket.on('ready', function(data){
        //alert(data);
        $('#voteUpText').text(data.voteUp);
    });
    $('#voteUp').click(function(){
        socket.emit('load', {id: 12312312});
    });
    commonActivations();
});

function commonActivations(){
    $('.modal-trigger').leanModal();
}

function voteUpEvent(socket){
    "use strict";
    $('.voteUp').click(function(){
        var feedId = $(this).data('feed');
        socket.emit('voteUp',{feed: feedId});
    })
}
