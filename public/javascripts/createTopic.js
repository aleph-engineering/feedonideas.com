var reader = new FileReader(),
    imageFiles;

reader.onload = function (e) {
    $('#picturePreview').attr('src', e.target.result);
};
reader.onloadend = function (e) {
    if (e.target.readyState == FileReader.DONE) {
        //SOME ACTION AFTER LOADING IS DONE
    }
};

$(function(){
    "use strict";
    $('#picture').change(function () {
        imageFiles = this.files;
        readFile();
    });

    // VALIDATION
    $.validator.addMethod('positiveNumber', function (value) {
        return Number(value) > 0;
    }, 'Must be a positive number.');
     $('#newTopicForm').validate({
        rules: {
            category: {
                required: true
            },
            maxUps: {
                positiveNumber: true
            },
            maxDowns: {
                positiveNumber: true
            }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error);
            } else {
                if (element[0].type == "file") {
                    var fileDiv = $(element).siblings('.file-path-wrapper');
                    error.insertAfter(fileDiv);
                } else {
                    error.insertAfter(element);
                }
            }
        }
    });

    var topic = {
        name: ko.observable(),
        siteUrl: ko.observable(),
        category: ko.observable(),
        picture: ko.observable(),
        image: ko.observable(),
        maxVotes: ko.observable(),
        maxUps: ko.observable(),
        maxDowns: ko.observable(),
        description: ko.observable()
    };
    ko.applyBindings(topic);
});
function readFile() {
    reader.readAsDataURL(imageFiles[0]);
}
