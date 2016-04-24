'use strict';
$(function(){
    var roomId = $('.feed-page').data('room');
    var socket = io();

    socket.on('connect', function(){
        socket.emit('enterFeedsRoom', {roomId: roomId})
    });
    createFeedEvent(socket);
    voteUpEventHandler(socket);
    voteDownEventHandler(socket);

    receiveFeedCreated(socket);
    receiveVoteUp(socket);
    receiveVoteDown(socket);
});

/***** Emitter events for socket.io *****/
function voteUpEventHandler(socket){
    $('.voteUp').click(function(){
        var feedId = $(this).data('feed');
        socket.emit('voteUp',{feed: feedId});
    })
}
function voteDownEventHandler(socket){
    $('.voteDown').click(function(){
        var feedId = $(this).data('feed');
        socket.emit('voteDown',{feed: feedId});
    })
}

function createFeedEvent(socket){
    var feedForm = $('#createFeed');
    feedForm.on('reset', function(e){
        var feedText = $('#feedText').val();
        socket.emit('createFeed', { feedBody: feedText})
    });
}


/***** Receiver events for socket.io *****/
function receiveVoteDown(socket){
    socket.on('getVoteDowns', function(data){
        updateVoteDown(data.feedId, data.downs);
    });
}
function receiveVoteUp(socket){
    socket.on('getVoteUps', function(data){
        updateVoteUp(data.feedId, data.ups);
    })
}
function receiveFeedCreated(socket){
    socket.on('feedCreated', function(data){
        console.log("RECEIVED FEED");
        var feed = data.feed;
        drawNewFeed(feed._id, feed.body, socket);
    });
}


/***** Update visual element in the DOM *****/
function enableNoFeeds(enabled) {
    var noFeeds = $('.no-feeds');
    if(!enabled){
        noFeeds.addClass('hide');
        return;
    }
    noFeeds.removeClass('hide');
}
function drawNewFeed(feedId, body, socket){
    var feedItem = $('.feed-item').clone();
    $(feedItem).attr('id', feedId);
    $(feedItem).children('.feed-text').text(body);
    $(feedItem).children('.chip').children('.ups-counter').text("0");
    $(feedItem).children('.chip').children('.downs-counter').text("0");
    $(feedItem).children('.secondary-content').children('a.voteUp').attr('data-feed', feedId.toString());
    $(feedItem).children('.secondary-content').children('.voteDown').attr('data-feed', feedId.toString());
    $(feedItem).children('.secondary-content').children('a.voteUp').click(function(){
        socket.emit('voteUp',{feed: feedId});
    });
    $(feedItem).children('.secondary-content').children('a.voteDown').click(function(){
        socket.emit('voteDown',{feed: feedId});
    });
    $(feedItem).removeClass('hide');
    $('.feeds').prepend(feedItem);
}
/*function drawNewFeed(feedId, body, ups, downs){
    "use strict";
    enableNoFeeds(false);
    var html = "<li class='collection-item avatar' id='" + feedId + "'>" +
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
            "<a href='#' class='waves-effect waves-circle waves-light btn-floating voteUp' data-feed='"+ feedId +"'><i class='material-icons'>star</i></a>" +
            "<a href='#' class='waves-effect waves-circle waves-light btn-floating grey voteDown' data-feed='"+ feedId +"'><i class='material-icons'>star_outline</i></a>" +
        "</div>" +
        "</li>";
    $('.feeds').prepend(html);
}*/
function updateVoteUp(feedId, ups){
    "use strict";
    var selector = "#" + feedId + " .ups-counter";
    $(selector).text(ups);
}
function updateVoteDown(feedId, downs){
    "use strict";
    var selector = "#" + feedId + " .downs-counter";
    $(selector).text(downs);
}
