const current_host = 'http://' + window.location.host

function msg(type, text){
        new PNotify({
        title: '提示信息',
        text: text,
        nonblock:{
            nonblock: true
        },
        type: type,
        styling: 'bootstrap3'
    });
}

//测试用例相关通用功能
const case_num = $("#origin-ul").find('.case-node').length
function hide_empty(){
    $(".total-case").text("( "+case_num+" )");
    let parents = $(".parent_li")
    $.each(parents, function (i) {
        let p = $(parents[i]).find('.case-node').length
        $(parents[i]).children('a').text("( "+p+" ) ");
        if(p < 1){
            $(parents[i]).remove();
        }
    });
}


$(document).ready(function () {
    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrf_token);
        }
    }
});
})
