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
                console.log(r.msg)
                msg("success", r.msg)
            }else{
                msg("error", r.msg)
            }
        },
        error: function(r){
            msg("error", "服务端请求出错!");
        }
    });
}

function delete_case(case_id) {
    let url = current_host + '/case/delete'
    let data = "_id="+ case_id
        $.ajax({
        type : "DELETE",
        url : url,
        dataType: "json",
        data : data,
        async : false,
        success : function(r){
            $(".cancel_modal").click()
            if(r.err == 0){
                console.log(r.msg)
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
            $(".cancel_modal").click()
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
            if($(this).parent('ul').hasClass('delete-node')){
                console.log("删除用例:" + case_id)
                delete_case(case_id)
                $(this).hide()
                return
            }
            if(nt !== "leaf"){
                alert("只能移动到叶子节点！")
                window.location.reload()
                return
            }
            let prev = $(this).prev().attr('st')
            let next = $(this).next().attr('st')
            if(next !== undefined){
                st = parseInt(next) - 1
                console.log("next:" + next)
                console.log("current:" + st);
            }else{
                st = parseInt(prev) + 1
                console.log("prev:" + prev)
                console.log("current:" + st)
            }
            sort_case(case_id, md, st)
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
                    alert("含有子节点不能删除!")
                    window.location.reload()
                    return
                }else{
                    delete_node(_id)
                    $(this).hide()
                    return
                }
            }
            if(pid !== undefined){
                console.log("当前父节点ID" + pid)
            }else{
                pid = 0
            }
            if(next !== undefined){
                st = parseInt(next) - 1
                console.log("next:" + next)
                console.log("current:" + st)
            }else{
                st = parseInt(prev) + 1
                console.log("prev:" + prev)
                console.log("current:" + st)
            }
            if(pid != 0 ){
                if(nt == "parent"){
                    alert("不能添加到其他节点下！")
                    window.location.reload()
                    return
                }
                if(pnt == "child" && nt == "child"){
                    alert("不能添加到child节点下！")
                    window.location.reload()
                    return
                }
                if(pnt == "leaf"){
                    alert("叶子节点不能添加模块！")
                    window.location.reload()
                    return
                }
            }
            update_order(pid, _id, st);
        }
    });
}

//过滤点击的模块
function filter_case(){
    $('li>span').click(function () {
        let cls = $(this).parent('li').attr('id')
        $('tbody>tr').hide()
        $("."+cls).show()
    })
    $(".module-parent").click(function () {
        $('tbody>tr').show()
    })
}

function quick_save(){
    $(".quick-save").click(function () {
        let div = $(this).parent().parent()
        let cid = div.attr('title')
        let step = div.children().children('div:nth-child(1)').html()
        let expect = div.children().children('div:nth-child(2)').html()
        let url = current_host + "/case/quick/save"
        let data = "_id="+cid+"&step="+encodeURIComponent(step)+"&expect="+encodeURIComponent(expect)
        $.ajax({
                type :"PUT",
                url : url,
                dataType: "json",
                data : data,
                async : false,
                success : function(r){
                    $(".cancel_modal").click()
                    if(r.err == 0){
                        msg("success", r.msg)
                    }else{
                        msg("error", r.msg)
                    }
                },
                error: function(r){
                    msg("error", "服务端请求出错!")
                }
            });
    });
}

$(document).ready(function() {
    module_tree();
    change_order();
    filter_case();
    quick_save();
    hide_empty(); //from common.js
});
