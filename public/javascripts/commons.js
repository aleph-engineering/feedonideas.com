'use strict';
$(function(){
    commonsMaterializaActivations();
    customActivations();
});
function commonsMaterializaActivations(){
    $(".button-collapse").sideNav(); //button to show sidenav
    $('.modal-trigger').leanModal({ //trigger to activate modal
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .8, // Opacity of modal background
        ready: function() { }, // Callback for Modal open
        complete: function() { } // Callback for Modal close
    });
    $('.parallax').parallax();       //activate parallax
    $('.tooltipped').tooltip({delay: 50}); //activate tooltips
    $('select').material_select(); // activate form selects
}
function customActivations(){
    $('#show-logins').click(function(){
        $('.login-buttons').removeClass('hide').addClass('animated zoomIn');
    })
}
