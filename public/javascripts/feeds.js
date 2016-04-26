$(function () {
    "use strict";

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

    $('#createFeedLink').on('click', function(e){
        e.preventDefault();
        $('#createFeed').openModal({
            complete: function (e) {
                var form = $('#createFeed');
                form[0].reset();
            }
        });
    });
});
