$(function(){
    "use strict";
    commonsMaterializaActivations();
    customActivations();
});
function commonsMaterializaActivations(){
    "use strict";
    $(".button-collapse").sideNav(); //button to show sidenav
    $('.modal-trigger').leanModal(); //trigger to activate modal
    $('.parallax').parallax();       //activate parallax
    $('.tooltipped').tooltip({delay: 50});
    $('select').material_select();
}
function customActivations(){
    "use strict";
    $('#show-logins').click(function(){
        $('.login-buttons').removeClass('hide').addClass('animated zoomIn');
    })
}
