//树形结构的js
function module_tree() {
    $("#").click();
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Expand this branch');
    $('.tree li.parent_li > span').on('click', function (e) {
    let children = $(this).parent('li.parent_li').find(' > ul > li');
    if (children.is(":visible")) {
      children.hide('fast');
      $(this).attr('title', 'Expand this branch').find(' > i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
    } else {
      children.show('fast');
      $(this).attr('title', 'Collapse this branch').find(' > i').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
    }
    e.stopPropagation();
  });
}

//过滤点击的模块
function filter_case(){
    $('li>span').click(function () {
        let cls = $(this).parent('li').attr('id');
        $('tbody>tr').hide()
        $("."+cls).show();
    })
    $(".module-parent").click(function () {
        $('tbody>tr').show();
    });
}

function run_case_status(){
    const url = current_host + '/run/case/stat'
    $(".change-cs-st").click(function () {
        let run_id = $("#run_id").val();
        let tr = $(this).parents('tr').prev('tr');
        let case_id = $(tr).children('td:eq(0)').text();
        let stat = $(tr).find('span.case-status');
        let html = $(tr).children("td:eq(7)");
        let old_stat = $(stat).text();
        let new_stat = $(this).attr('title')
        if($.trim(old_stat) == $.trim(new_stat)){
            console.log("新老状态相同，不更新！");
            return;
        }
        let data = "run_id="+run_id+"&case_id="+case_id+"&old_stat="+old_stat+"&new_stat="+new_stat
        $.ajax({
                type :"PUT",
                url : url,
                dataType: "json",
                data : data,
                async : false,
                success : function(r){
                    if(r.err == 0){
                        console.log(r.msg);
                        $(html).empty();
                        switch (new_stat) {
                            case "stop":
                                $(html).append("<span class='case-status label label-warning'>stop</span>")
                                break;
                            case "abort":
                                $(html).append("<span class='case-status label label-default'>abort</span>")
                                break;
                            case "fail":
                                $(html).append("<span class='case-status label label-danger'>fail</span>")
                                break;
                            case "pass":
                                $(html).append("<span class='case-status label label-success'>pass</span>")
                                break;
                        }
                    }else{
                        msg("error", r.msg);
                    }
                },
                error: function(){
                    msg("error", "服务端请求失败!");
                }
            });
    });
}

function submit_bug_comment(){
    let url = current_host + '/run/case/info'
    $(".case-submit").click(function () {
        console.log("点击提交bug链接和评论")
        let tr = $(this).parents('tr').prev('tr');
        let run_id = $("#run_id").val();
        let case_id = $(tr).children('td:eq(0)').text();
        let div = $(this).parent('div').parent('div');
        let bug = $(div).find('.case-bug').val();
        let comment = $(div).find('.case-comment').val();
        let data = "run_id="+run_id+"&case_id="+case_id+"&bug="+bug+"&comment="+comment
        $.ajax({
                type :"PUT",
                url : url,
                dataType: "json",
                data : data,
                async : false,
                success : function(r){
                    if(r.err == 0){
                        msg("success", r.msg);
                    }else{
                        msg("error", r.msg);
                    }
                },
                error: function(){
                    msg("error", "服务端请求失败!");
                }
            });
    });
}

function run_stat(){
    const url = current_host + '/run/stat'
    const run_id = $("#run_id").val();
    const run_list_url = $("#run-list").attr('href');
    $('#end-run').click(function () {
        let data = "run_id="+run_id+"&stat=已完成"
        $.ajax({
            type :"PUT",
            url : url,
            dataType: "json",
            data : data,
            async : false,
            success : function(r){
                if(r.err == 0){
                    msg("success", r.msg)
                    window.location.href = run_list_url;
                }else{
                    msg("error", r.msg);
                }
            },
            error: function(){
                msg("error", "服务端请求出错!");
            }
        });
    });
}

$(document).ready(function() {
    module_tree();
    filter_case();
    run_stat();
    run_case_status();
    submit_bug_comment();
    hide_empty(); //from common.js
});
