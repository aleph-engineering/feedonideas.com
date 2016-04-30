"use strict";
$(function () {
    var socket = io(),
        roomId = $('.feeds-room').data('room');
    socket.on('connect', function(){
        socket.emit('enterFeedsRoom', {roomId: roomId})
    });

    /****** UI ******/
    var grid = activateMasonry();
    openCreateFeedModal();
    validation();

    /****** Socket IO Emitters ******/
    createFeedEvent(socket);
    voteDownEvent(socket);
    voteUpEvent(socket);

    /****** Socket IO Receivers ******/
    receiveFeedCreated(socket, grid);
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

function receiveFeedCreated(socket, grid){
    socket.on('feedCreated', function(data){
        console.log(data);
        var feed = data.feed;
        var element = $(createHTMLFeedElement(feed._id, feed.authorAvatar, feed.body));
        grid.append(element).masonry( 'appended', element );
        reloadHandlers(socket);
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
    return $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        gutter: 20,
        percentPosition: true
    });
}
function createHTMLFeedElement(feedId, authorAvatar, body){
    return '<div class="grid-item" id="'+ feedId+'">' +
        '<div class="item-header">' +
            '<img class="responsive-img circle" src="'+ authorAvatar +'">' +
            '<div class="chip">' +
                '<i class="material-icons"> thumb_down</i>' +
                '<label class="left downs-counter">0</label>' +
            '</div>' +
            '<div class="chip">' +
                '<i class="material-icons"> thumb_up</i>' +
                '<label class="left ups-counter">0</label>' +
            '</div>'+
        '<div class="item-content">' +
            '<label>'+ body +'</label>'+
        '</div>'+
        '<div class="item-footer">'+
            '<a class="waves-effect waves-circle waves-light btn-floating grey voteDown" href="#" data-feed="'+ feedId +'">' +
                '<i class="material-icons"> thumb_down</i>'+
            '</a>'+
            '<a class="waves-effect waves-circle waves-light btn-floating voteUp" href="#" data-feed="'+ feedId +'">' +
                '<i class="material-icons"> thumb_up</i>'+
            '</a>'+
        '</div>'+
        '</div>'+'</div>';
}
function reloadHandlers(socket) {
    $('.voteDown').unbind();
    $('.voteUp').unbind();
    voteUpEvent(socket);
    voteDownEvent(socket);
}
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
