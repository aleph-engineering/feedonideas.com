"use strict";
$(function(){
    const foiCookieName = "foiUserEmail";
    var foiUserEmailCookie = readCookie(foiCookieName);
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
