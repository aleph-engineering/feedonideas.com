"use strict";
const foiCookieName = "foi",
    authenticationUrl = 'http://www.feedonideas.com/api/plugin/auth_/client',
    getFeedsUrl = 'http://www.feedonideas.com/api/plugin/feeds/',
    sendFeedUrl = 'http://www.feedonideas.com/api/plugin/feeds/create/';
$(function(){
    var $body = $('body');
    var currentTopic = "";
    authenticate(function(topic){
        currentTopic = topic;
        lazyLoading($body, function(){
            $body.append(getSingleBox());
            showFoiPanel();
            hideFoiInfoBox();
            showCreateFeedForm();
            goBackToFeedList();

            getLastFeeds(currentTopic, function(feeds){
                drawFeeds(feeds);
            });
            sendFeedButtonClick();
        });
    });
});

/**
 * Read the cookie with name 'foiCookieName'
 * @param foiCookieName
 * @returns {currentUserEmail}
 */
function readCookie(foiCookieName){
    var nameEQ = foiCookieName + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function lazyLoading($body, callback){
    if (typeof callback === "function") {
        $body.append(getCssFile());
        callback();
    }
}
function getSingleBox(){
    return '<div class="foi-box">' +
        '<div class="foi-icon-box">' +
            '<img src="https://s3-ap-southeast-1.amazonaws.com/feedonideas.com/foi_assets/foi_white_icon.png" class="foi-ico"/>' +
        '</div>' +
        '<div class="foi-info-box" style="display: none">' +
        '<div class="foi-box-header">' +
            '<a class="foi-header-text" href="http://www.feedonideas.com" target="_blank">We Feed On Ideas</a>' +
            '<button class="hide-foi-box"> x </button>'+
        '</div>' +
        '<form class="foi-create-panel">' +
            '<textarea name="feedText" id="feedText" class="new-feed-text" rows="3" placeholder="Create your own ideas"></textarea>' +
            '<button class="send-new-feed" type="button">Send</button>'+
        '</form>'+
        '<ul class="foi-feed-list"></ul>'+
        '</div>' +
        '</div>'
}
function getCssFile(){
    return '<link rel="stylesheet" href="https://s3-ap-southeast-1.amazonaws.com/feedonideas.com/foi_assets/feedonideas.css"/>';
}
function showFoiPanel(){
    $('.foi-icon-box').click(()=>{
        $('.foi-icon-box').fadeOut(200, () =>{
            $('.foi-info-box').fadeIn(500);
        });
    })
}
function hideFoiInfoBox(){
    $('.hide-foi-box').click(()=>{
        $('.foi-info-box').fadeOut(200, ()=>{
            $('.foi-icon-box').fadeIn(500);
        })
    });
}
function showCreateFeedForm(){
    $('.foi-create-feed').click(()=>{
        $('.foi-feed-list').fadeOut(200, ()=>{
            $('.foi-create-panel').fadeIn(500);
        })
    })
}
function goBackToFeedList(){
    $('.cancel-new-feed').click(()=>{
        $('.foi-create-panel').fadeOut(200, ()=>{
            $('.foi-feed-list').fadeIn(500);
        });
    })
}
function sendFeedButtonClick(){
    $('.send-new-feed').click(function(){
        var textarea = $('#feedText'),
            feedText = textarea.val();
        console.log("FEED TEXT " +feedText);
        if(feedText) {
            var emailFromCookie = readCookie(foiCookieName),
                emailRegex = /.+@.+/,
                email = emailFromCookie ? emailFromCookie.replace(/%40/i, '@') : null;
            email = emailRegex.test(email) ? email : null;
            $('.foi-create-panel')[0].reset();
            sendFeed(feedText, email, function (data) {
                console.log(data);
            })
        }
    })
}
function authenticate(callback){
    if (typeof callback === "function") {
        $.ajax({
                url: authenticationUrl,
                method: 'GET',
                crossDomain: true,
                dataType:'jsonp'
            })
            .success(function(data ) {
                callback(data.topic);
            })
            .fail(function(data) {
                console.log(data)
            });
    }
}

function getLastFeeds(topic, callback){
    if (typeof callback === "function") {
        $.ajax({
                url: getFeedsUrl,
                method: 'GET',
                data: {topic: topic},
                crossDomain: true,
                dataType:'jsonp'
            })
            .success(function(data ) {
                callback(data.feeds);
            })
            .fail(function(data) {
                console.log(data)
            });
    }
}
function sendFeed(body, email, callback){
    if (typeof callback === "function") {
        $.ajax({
                url: sendFeedUrl,
                method: 'GET',
                data: {body: body, author: email},
                crossDomain: true,
                dataType: 'jsonp'
            })
            .success(function (data) {
                callback(data);
            })
            .fail(function (data) {
                console.log(data)
            });
    }
}
function drawFeeds(feeds){
    for(let item in feeds){
        var li = '<li class="foi-feed-item"><label></label>'+ feeds[item].body + '</li>';
        $('.foi-feed-list').append(li);
    }
}
