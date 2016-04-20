$(function(){
    "use strict";
    var roomId = $('.feed-page').data('room');
    console.log("ROOM ID: " + roomId);
    var socket = io();

    startConnection(socket, roomId);
    createFeedEvent(socket);
    receiveFeedCreated(socket);

});
function startConnection(socket, roomId){
    "use strict";
    socket.on('connect', function(){
        socket.emit('enterFeedsRoom', {roomId: roomId})
    });
}
function voteUpEvent(socket){
    "use strict";
    $('.voteUp').click(function(){
        var feedId = $(this).data('feed');
        socket.emit('voteUp',{feed: feedId});
    })
}
function voteDownEvent(socket){
    "use strict";
    $('.voteDown').click(function(){
        var feedId = $(this).data('feed');
        socket.emit('voteDown',{feed: feedId});
    })
}
function receiveFeedCreated(socket){
    "use strict";
    socket.on('feedCreated', function(model){
        console.log(model.feed);
        var feed = model.feed;
        console.log(feed);
        console.log(feed.body);
        drawNewFeed(feed.body, feed.ups.length, feed.downs.length);
    });
}
function createFeedEvent(socket){
    "use strict";
    var feedForm = $('#createFeed');
    feedForm.on('submit', function(e){
        e.preventDefault();
        var feedText = $('#feedText').val();
        socket.emit('createFeed', { feedBody: feedText})
    });
}

function enableNoFeeds(enabled) {
    var noFeeds = $('.no-feeds');
    if(!enabled){
        noFeeds.addClass('hide');
        return;
    }
    noFeeds.removeClass('hide');
}
function drawNewFeed(body, ups, downs){
    "use strict";
    enableNoFeeds(false);
    var html = "<li class='collection-item avatar'>" +
        "<img class='circle' src='/images/refucktor.jpg'>" +
        "<span class='title'></span>" +
        "<p class='feed-text'>"+ body + "</p>" +
        "<div class='chip'>" +
            "<i class='material-icons left'>star</i>" +
            "<label class='left ups'>" + ups + "</label>" +
        "</div>" +
        "<div class='chip'>" +
            "<i class='material-icons left'>star_outline</i>" +
            "<label class='left downs'>" + downs + "</label>" +
        "</div>" +
        "<div class='secondary-content'>" +
            "<a href='#' class='waves-effect waves-circle waves-light btn-floating setUp'><i class='material-icons'>star</i></a>" +
            "<a href='#' class='waves-effect waves-circle waves-light btn-floating grey setDown'><i class='material-icons'>star_outline</i></a>" +
        "</div>" +
        "</li>";
    $('.feeds').prepend(html);
}
