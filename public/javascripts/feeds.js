"use strict";
$(function () {
    var socket = io(),
        roomId = $('.feeds-room').data('room');
    socket.on('connect', function(){
        socket.emit('enterFeedsRoom', {roomId: roomId})
    });

    /****** UI ******/
    activateMasonry();
    openCreateFeedModal();
    validation();

    /****** Socket IO Emitters ******/
    createFeedEvent(socket);
    voteDownEvent(socket);
    voteUpEvent(socket);

    /****** Socket IO Receivers ******/
    receiveFeedCreated(socket);
    receiveVoteDown(socket);
    receiveVoteUp(socket);
});

function voteUpEvent(socket){
    $('.voteUp').click(function(){
        var feedId = $(this).data('feed');
        socket.emit('voteUp',{feed: feedId});
    })
}
function voteDownEvent(socket){
    $('.voteDown').click(function(){
        var feedId = $(this).data('feed');
        socket.emit('voteDown',{feed: feedId});
    })
}

function createFeedEvent(socket){
    var feedForm = $('#createFeed');
    feedForm.on('submit', function(e){
        e.preventDefault();

        if ($(this).valid()) {
            var feedText = $('#feedText').val();
            socket.emit('createFeed', {feedBody: feedText});

            $(this).closeModal();
            this.reset();
        }
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
        //var feed = data.feed;
        //drawNewFeed(feed._id, feed.body, socket);
    });
}


function validation(){
    $('#createFeed').validate({
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });
}
function openCreateFeedModal(){
    $('#createFeedLink').on('click', function(e){
        e.preventDefault();
        $('#createFeed').openModal({
            complete: function (e) {
                var form = $('#createFeed');
                form[0].reset();
            }
        });
    });
}
function activateMasonry(){
    $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: 250,
        isFitWidth: true,
        gutter: 10,
        percentPosition: true
    });
}

function drawNewFeed(feedId, authorAvatar, body, ups, downs){
    var html = $('<div class="grid-item" id="'+ feedId+'">' +
        '<div class="item-header">' +
            '<img class="responsive-img circle" src="'+ authorAvatar +'">' +
            '<div class="chip>">' +
                '<i class="material-icons"> thumb_up</i>' +
                '<label class="left ups-counter">'+ ups +'</label>' +
            '<div class="chip">' +
                '<i class="material-icons"> thumb_down</i>' +
                '<label class="left ups-counter">'+ downs +'</label>' +
            '</div>'+
        '<div class="item-content">' +
            '<label>'+ body +'</label>'+
        '</div>'+
        '<div class="item-footer">'+
            '<a class="waves-effect waves-circle waves-light btn-floating grey voteDown" href="#" data-feed="'+ feedId +'">' +
                '<i class="material-icons"> thumb_down</i>'+
            '</a>'+
            '<a class="waves-effect waves-circle waves-light btn-floating grey voteDown" href="#" data-feed="'+ feedId +'">' +
                '<i class="material-icons"> thumb_up</i>'+
            '</a>'+
        '</div>'+
        '</div>'+'</div>');

}
