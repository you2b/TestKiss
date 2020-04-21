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


function update_order(pid, _id, st){
    let url = current_host + '/product/module/update'
    let data = "_id="+ _id+ "&st="+st+"&pid="+pid
        $.ajax({
        type : "PUT",
        url : url,
        dataType: "json",
        data : data,
        async : false,
        success : function(r){
            $(".cancel_modal").click()
            if(r.err == 0){
                console.log(r.msg);
                msg("success", r.msg);
            }else{
                msg("error", r.msg);
            }
        },
        error: function(){
            msg("error", "服务端请求出错!");
        }
    });
}

function sort_case(case_id, md, st) {
    let url = current_host + '/case/sort'
    let data = "_id="+ case_id+ "&st="+st+"&md="+md
        $.ajax({
        type : "PUT",
        url : url,
        dataType: "json",
        data : data,
        async : false,
        success : function(r){
            $(".cancel_modal").click();
            if(r.err == 0){
                console.log(r.msg);
                msg("success", r.msg);
            }else{
                msg("error", r.msg);
            }
        },
        error: function(r){
            msg("error", "服务端请求出错!");
        }
    });
}

function change_order(){
    $( ".sortable" ).sortable({
      revert: false
    });
    $(".case-node").draggable({
        connectToSortable: ".sortable",
        distance: 10,
        stop: function (event, ui) {
            let nt = $(this).parent('ul').parent('li').attr('nt')
            let md = $(this).parent('ul').parent('li').children('span').attr('id')
            let case_id = $(this).attr('id').split("_")[1]
            let st = ""
            if(nt !== "leaf"){
                alert("只能移动到叶子节点！");
                window.location.reload();
                return;
            }
            let prev = $(this).prev().attr('st');
            let next = $(this).next().attr('st');
            if(next !== undefined){
                st = parseInt(next) - 1
                console.log("next:" + next);
                console.log("current:" + st);
            }else{
                st = parseInt(prev) + 1
                console.log("prev:" + prev);
                console.log("current:" + st);
            }
            sort_case(case_id, md, st);
        }
    })
    
    $( ".parent_li" ).draggable({
        connectToSortable: ".sortable",
        distance: 10,
        stop: function(event, ui){
            let _id = $(this).children('span').attr('id')
            let pid = $(this).parent('ul').parent('li').children('span').attr('id')
            let pnt = $(this).parent('ul').parent('li').attr('nt')
            let nt = $(this).attr('nt')
            let st = ''
            let prev = $(this).prev().attr('st')
            let next = $(this).next().attr('st')
            if($(this).parent('ul').hasClass('delete-node')){
                if($(this).find('li').length >0){
                    alert("含有子节点不能删除!");
                    window.location.reload();
                    return;
                }else{
                    delete_node(_id)
                    $(this).hide();
                    return;
                }
            }
            if(pid !== undefined){
                console.log("当前父节点ID" + pid);
            }else{
                pid = 0;
            }
            if(next !== undefined){
                st = parseInt(next) - 1
                console.log("next:" + next);
                console.log("current:" + st);
            }else{
                st = parseInt(prev) + 1
                console.log("prev:" + prev);
                console.log("current:" + st);
            }
            if(pid != 0 ){
                if(nt == "parent"){
                    alert("不能添加到其他节点下！");
                    window.location.reload();
                    return;
                }
                if(pnt == "child" && nt == "child"){
                    alert("不能添加到child节点下！");
                    window.location.reload();
                    return;
                }
                if(pnt == "leaf"){
                    alert("叶子节点不能添加模块！");
                    window.location.reload();
                    return;
                }
            }
            update_order(pid, _id, st);
        }
    });
}

//过滤点击的模块
function choose_case(ele){
    let e = $(ele)
    let p = e.parent()
    if(e.hasClass('checked')){
        e.removeClass('checked')
        let cls = e.parent().attr('id')
        $("."+cls).removeClass('case-selected')
        $("."+cls).hide()
        if(e.hasClass('disabled')){
            e.removeClass('disabled')
        }
        p.find('div').removeClass('checked')
        let pl = p.parents('li')
        $.each(pl, function (i) {
            let curr = $(pl[i]).children('div')
            let ck = $(pl[i]).find('div')
            let flag = 0
            $.each(ck, function (i) {
                if($(ck[i]).hasClass('checked')){
                    flag = 1
                }
            })
            if(flag == 0){
                curr.removeClass('disabled');
                curr.removeClass('checked');
            }else{
                curr.addClass('disabled');
            }
        })
    }else{
        e.addClass('checked');
        e.removeClass('disabled');
        let cls = e.parent().attr('id');
        $("."+cls).addClass('case-selected');
        $("."+cls).show();
        p.find('div').addClass('checked');
        p.find('div').removeClass('disabled');
        let pl = p.parents('li');
        $.each(pl, function (i) {
            let curr = $(pl[i]).children('div');
            let ck = $(pl[i]).find('div');
            let flag = 0
            $.each(ck, function (i) {
                if(!$(ck[i]).hasClass('checked')){
                    curr.addClass('disabled');
                    flag = 1
                }
            })
            if(flag == 0){
                curr.removeClass('disabled');
            }
            if(!curr.hasClass('checked')){
                curr.addClass('checked');
            }
        })
    }
}

function quick_save(){
    $(".quick-save").click(function () {
        let div = $(this).parent().parent();
        let cid = div.attr('title');
        let step = div.children().children('div:nth-child(1)').html();
        let expect = div.children().children('div:nth-child(2)').html();
        let url = current_host + "/case/quick/save"
        let data = "_id="+cid+"&step="+encodeURIComponent(step)+"&expect="+encodeURIComponent(expect)
        $.ajax({
                type :"PUT",
                url : url,
                dataType: "json",
                data : data,
                async : false,
                success : function(r){
                    $(".cancel_modal").click();
                    if(r.err == 0){
                        console.log(r.data._id);
                        msg("success", r.msg);
                        $(".module-name").text("");
                        $(".module-name").text(r.msg);
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

function save_run(){
    const url = current_host + '/run/add'
    $("#save_run").click(function () {
        let product_id = $("#product_id").val();
        let plan_id = $("#plan_id").val();
        let run_name = $("#run_name").val();
        let assign_to = $("#assign_to").val();
        let cid = new Array();
        let cases = $(".even.pointer.case-selected");
        let run_list = $("#run_list").attr('href');
        $.each(cases, function (i) {
            let cs = $(cases[i]).children('td:eq(0)').text();
            cid[i] = cs
        })
        if(cid.length < 1){
            msg("error", "请先选择要执行的用例！");
            return;
        }
        console.log(cid);
        if($.trim(run_name) == ""){
            msg("error", "请先执行名称!");
            return;
        }
        if($.trim(assign_to) == ""){
            msg("error", "请先分配一个执行者!");
        }
        let data = "product_id="+product_id+"&plan_id="+plan_id+"&run_name="+encodeURIComponent(run_name)+"&assign_to="+assign_to+"&cid="+cid
        $.ajax({
                type :"POST",
                url : url,
                dataType: "json",
                data : data,
                async : false,
                success : function(r){
                    if(r.err == 0){
                        console.log(r.msg)
                        msg("success", r.msg)
                        window.location.href = run_list
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

function search_user(){
    let div = $("#user_list");
    $("#assign_to").keyup(function () {
        let name = $("#assign_to").val();
        let url = current_host + '/user/list'
        let data = 'name=' + name
        console.log(name)
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: data,
            async: false,
            success: function (r) {
                if(r.err == 0){
                    div.empty();
                    d = r.data
                    $.each(d,function (i) {
                        if(i % 2 == 0){
                            div.append('<li class="list-group-item list-group-item-success" onclick="select_user(this)">'+ d[i].username +'</li>');
                        }else{
                            div.append('<li class="list-group-item list-group-item-info" onclick="select_user(this)">'+ d[i].username +'</li>');
                        }
                    });
                }else{
                    msg('error', r.msg);
                }
            },
            error: function (r) {
                msg('error', r.msg);
            }
        });
    });
}

function select_user(e){
    let ele = $(e);
    $("#assign_to").val(ele.text());
    $("#user_list").empty();
}


$(document).ready(function() {
    module_tree();
    change_order();
    quick_save();
    save_run();
    search_user();
    hide_empty(); //from common.js
});
