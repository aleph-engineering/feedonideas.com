"use strict";
$(function(){
    const foiCookieName = "foiUserEmail";
    var foiUserEmailCookie = readCookie(foiCookieName);
    var $body = $('body');
    $body.append(getCssFile());
    $body.append(getSingleBox());
    showFoiPanel();
    hideFoiInfoBox();
    showCreateFeedForm();
    goBackToFeedList();
    sendFeedButton();
});

/**
 * Read the cookie with name 'foiCookieName'
 * @param foiCookieName
 * @returns {currentUserEmail}
 */
function readCookie(foiCookieName){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function makeRequest(){
    $.ajax({
            url: "/test",
            dataType: 'JSONP',

            headers: {"Authorization": "Bearer " + $('#myToken').val()}
        })
        .done(function (data) {
            console.log(data);
        })
        .fail(function (jqXHR, textStatus) {
            alert("error: " + textStatus);
        });
}
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}
function createBox(){

}
function getSingleBox(){
    return '<div class="foi-box">' +
            '<img src="/images/lamp.ign.png" class="foi-ico"/>' +
            '<div class="foi-info-box">' +
                '<div class="foi-box-header">' +
                    '<label class="foi-header-text">Feed On Ideas</label>' +
                    '<button class="foi-create-feed">+</button>'+
                '</div>' +
                '<ul class="foi-feed-list">' +
                    '<li class="foi-feed-item"><label class="done"></label>Create JIRA integration to generate issues automatically</li>'+
                    '<li class="foi-feed-item"><label class="done"></label>Create JIRA integration to generate issues automatically</li>'+
                    '<li class="foi-feed-item"><label class=""></label>Create JIRA integration to generate issues automatically</li>'+
                    '<li class="foi-feed-item"><label class="done"></label>Create JIRA integration to generate issues automatically</li>'+
                    '<li class="foi-feed-item"><label class=""></label>Create JIRA integration to generate issues automatically</li>'+
                    '<li class="foi-feed-item"><label class=""></label>Create JIRA integration to generate issues automatically</li>'+
                    '<li class="foi-feed-item"><label class="done"></label>Create JIRA integration to generate issues automatically</li>'+
                '</ul>'+
                '<form class="foi-create-panel">' +
                    '<textarea name="feedText" class="new-feed-text" rows="5" placeholder="Type your new feed here"></textarea>' +
                    '<button class="send-new-feed" type="button">Send</button>'+
                    '<button class="cancel-new-feed" type="reset">Back</button>'+
                '</form>'+
            '</div>' +
        '</div>'
}
function getCssFile(){
    return '<link rel="stylesheet" href="/files/feedonideas.css"/>';
}
function showFoiPanel(){
    $('.foi-box').click(()=>{
        $('.foi-box img.foi-ico').fadeOut(200, () =>{
            $('.foi-info-box').fadeIn(500);
        });
    })
}
function hideFoiInfoBox(){
    $('.foi-box').mouseleave(()=>{
        $('.foi-info-box').fadeOut(200, ()=>{
            $('.foi-box img.foi-ico').fadeIn(500);
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
function sendFeedButton(){
    $('.send-new-feed').click(()=>{
        $('.foi-create-panel')[0].reset();
    })
}
