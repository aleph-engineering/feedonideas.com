var reader = new FileReader(),
    imageFiles;
$(function(){
    "use strict";
    $('#picture').change(function () {
        imageFiles = this.files;
        readFile();
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

reader.onload = function (e) {
    var image = $('#picture').attr('src', e.target.result);
    $('#picture-preview').attr('src', e.target.result);
};
reader.onloadend = function (e) {
    if (e.target.readyState == FileReader.DONE) {
        alert("Image done")
    }
};

