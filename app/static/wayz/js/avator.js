function upload_avator(){
    const url = current_host + '/user/avator'
    $upload = $("#uploadImg");
    $download = $("#download");
    $upload.click(function () {
        let img = "img=" + encodeURIComponent($download.attr('href'));
        msg("info",'开始上传图片');
        $.post(url, img, function (r) {
            $("#getCroppedCanvasModal > div > div > div.modal-header > button").click();
        }, 'json')
        msg("success",'上传图片完成');
    });
}

$(document).ready(function() {
    upload_avator();
    init_cropper(1 / 1);
});
