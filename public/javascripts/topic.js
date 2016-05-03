'use strict';

$(function(){
    $('.showDeleteModal').click(function(){
        var deleteUrl = $(this).data('delete-url');
        $("#deleteLink").attr('href', deleteUrl);
    });
});
