'use strict';

$(function(){
    $("#showDeleteModal").on('click', function(e){
        var deleteUrl = $(e.target).parent().data('delete-url');
        $("#deleteLink").attr('href', deleteUrl);
    });
});
