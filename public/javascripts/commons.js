$(function(){
    "use strict";
    activateModals();
    activateNavbarCollapse();
});

function activateModals(){
    $('.modal-trigger').leanModal();
}
function activateNavbarCollapse(){
    $(".button-collapse").sideNav();
}
