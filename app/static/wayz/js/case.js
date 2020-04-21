//树形结构的js
function module_tree() {
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

function add_top(){
    $("#add_parent").click();
}

function add_child(e){
    let pid = $(e).parent().children('span').attr("id")
    $("#child_pid").val(pid);
    $("#add_child").click();
}

function add_leaf(e) {
    let pid = $(e).parent().children('span').attr("id")
    $("#child_pid").val(pid);
    $("#add_child").click();
}

function add_case_node(li_id, case_id, case_name) {
    let li = $("#li_"+li_id)
    let html = "<li id=\"case_"+case_id+"\" class=\"case-node draggable\" style=\"display: list-item;\">\n" +
        "<span>"+case_name+"</span>\n" +
        "</li>"
    li.children('ul').append(html);
}

function add_node_type(pid, id, name, nt) {
    let root = $("#origin-ul")
    let html = ''
    if(nt == "parent") {
        html = "<li class=\"parent_li\" id=li_" + id + ">" +
        "       <span id='" + id + "' name='" + name + "'>\n" +
        "            <i class=\"glyphicon glyphicon-folder-open blue glyphicon-plus-sign\">\n" +
        "            </i> " + name + "\n" +
        "        </span>\n" +
        "        <a data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"点击添加子节点\"><i class=\"fa fa-yelp purple\" onclick=\"add_child(this)\"></i></a></li>"
    }
    if(nt == "child"){
        html =  "<li class=\"parent_li\" id=li_"+id+">" +
        "       <span id='"+id+"' name='"+name+"'>\n" +
        "            <i class=\"glyphicon purple glyphicon-plus-sign\">\n" +
        "            </i> "+name+"\n" +
        "        </span>\n" +
        "        <a data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"点击添加子节点\"><i class=\"fa fa-yelp purple\" onclick=\"add_child(this)\"></i></a></li>"
    }
    if(nt == "leaf"){
        html =  "<li class=\"parent_li\" id=li_"+id+">" +
        "       <span class='leaf-node' id='"+id+"' name='"+name+"'>\n" +
        "            <i class=\"glyphicon glyphicon-leaf green\">\n" +
        "            </i> "+name+"\n" +
        "        </span>\n" +
        "        <a data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"点击添加子节点\"><i class=\"glyphicon glyphicon-edit green\"></i></a></li>"
    }
    if(pid == 0){
        root.append(html)
    }else{
        let li_root = $("#li_"+pid).children('ul');
        if(li_root[0]){
            li_root.append(html)
        }else{
            html = '<ul>' + html +'</ul>'
            $("#li_"+pid).append(html);
        }
    }
}

function post_add_module(pid, url, data) {
    $.ajax({
        type : "post",
        url : url,
        dataType: "json",
        data : data,
        async : false,
        success : function(r){
            $(".cancel_modal").click()
            if(r.err == 0){
                window.location.reload();
            }else{
                msg("error", r.msg);
            }
        },
        error: function(){
            msg("error", "服务端请求出错!");
        }
    });
}

function save_module(){
    let url = current_host + '/product/module/add'
    $("#add-top-node").click(function () {
            let product_id = $("#product_id").val();
            let name = $("#top_md_name").val();
            let r = $("input[name='TopType']");
            let node_type = false;
            let pid = 0;
        $.each(r, function (i,v) {
            if( $(r[i]).prop('checked') == true){
                node_type = $(r[i]).val()
            }
        })
        if(node_type == false){
            msg("error", "请选择一种类型！")
            return;
        }
        if(name == ""){
            msg("error", "请填写模块名称！");
        }
        let data = "pd="+product_id+"&pid=0&name="+encodeURIComponent(name)+"&nt="+node_type
        post_add_module(pid, url, data);
    })

    $("#add-child-node").click(function () {
        let product_id = $("#product_id").val();
        let name = $("#child_md_name").val();
        let r = $("input[name='ChildType']")
        let node_type = false
        let pid = $("#child_pid").val()
        $.each(r, function (i,v) {
            if( $(r[i]).prop('checked') == true){
                node_type = $(r[i]).val()
            }
        })
        if(node_type == false){
            msg("error", "请选择一种类型！")
            return
        }
        if(name == ""){
            msg("error", "请填写模块名称！")
        }
        let data = "pd="+product_id+"&pid="+pid+"&name="+encodeURIComponent(name)+"&nt="+node_type
        post_add_module(pid, url, data);
    })
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
                msg("success", "修改成功！")
            }else{
                msg("error", r.msg)
            }
        },
        error: function(r){
            msg("error", "服务端请求出错!")
        }
    });
}

function delete_node(_id) {
    let url = current_host + '/product/module/delete'
    let data = "_id="+ _id
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
                msg("success", "删除成功!")
            }else{
                msg("error", r.msg)
            }
        },
        error: function(r){
            msg("error", "服务端请求出错!")
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
                msg("success", r.msg)
            }else{
                msg("error", r.msg)
            }
        },
        error: function(r){
            msg("error", "服务端请求出错!")
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
                console.log(r.msg)
                msg("success", r.msg)
            }else{
                msg("error", r.msg)
            }
        },
        error: function(r){
            msg("error", "服务端请求出错!")
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
                console.log("current:" + st)
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

//点击叶子节点，设置模块信息
function choose_module(){
    $('.leaf-node').click(function () {
        let parent = $(this).parent().parent().parent().children('span').text()
        let module = $(this).text()
        let module_id = $(this).attr('id')
        $("#success_msg").empty()
        $(".module-parent").text("")
        $(".module-parent").text(parent)
        $(".module-name").text("")
        $(".module-name").text(module)
        $("#choosed-module-id").val(module_id)
    })
}

//两个编辑框实现粘贴图片功能
$(function () {
        document.getElementById('editor-one').addEventListener('paste',function(e){
        if ( !(e.clipboardData && e.clipboardData.items) ) {
            return;
        }
        for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
            let item = e.clipboardData.items[i];

            if (item.kind === "string") {
                item.getAsString(function (str) {
                    console.log(str);
                })
            } else if (item.type === "image/png") {
                let f= item.getAsFile();
                console.log(f.height)
                console.log(f.width)
                let reader=new FileReader();
                reader.readAsDataURL(f);
                		reader.onload=function(e){
                        let base64_str=this.result;
                        let img = new Image();

                        img.src = this.result.toString();
                        img.className = 'mg-responsive img-rounded';
                        img.style.maxWidth = '200px';
                        img.style.maxHeight = '180px';
                            $("#editor-one").append(img)
                		}
                console.log(item);
            }
        }
    });
        document.getElementById('editor-two').addEventListener('paste',function(e){
        if ( !(e.clipboardData && e.clipboardData.items) ) {
            return;
        }
        for (let i = 0, len = e.clipboardData.items.length; i < len; i++) {
            let item = e.clipboardData.items[i];

            if (item.kind === "string") {
                item.getAsString(function (str) {
                    console.log(str);
                })
            } else if (item.type === "image/png") {
                let f= item.getAsFile();
                console.log(f.height)
                console.log(f.width)
                let reader=new FileReader();
                reader.readAsDataURL(f);
                		reader.onload=function(e){
                        let base64_str=this.result;
                        let img = new Image();

                        img.src = this.result.toString();
                        img.className = 'mg-responsive img-rounded';
                        img.style.maxWidth = '200px';
                        img.style.maxHeight = '180px';
                            $("#editor-two").append(img)
                		}
                console.log(item);
            }
        }
    });
}
)

function save_case(){
    $("#save_case").click(function () {
        let product = $("#product_id").val()
        let module = $("#choosed-module-id").val()
        let name = $("#case_name").val()
        let type = $("#case_type").val()
        let priority = $("#case_priority").val()
        let spans = $("#tags_1_tagsinput").find('span.tag')
        let step = $("#editor-one").html()
        let expect = $("#editor-two").html()
        let tags = new Array();
        if(spans.length > 0){
            $.each(spans, function (i) {
                tags[i] = $.trim($(spans[i]).children('span').text())
            })
            console.log(tags)
        }
        if($.trim(module) === ""){
            msg("error", "请选择一个产品模块!")
            return
        }
        if($.trim(name) === ""){
            msg("error", "请填写用例名称！")
            return
        }
        if($.trim(step) === ""){
            msg("error", "请填写测试步骤")
            return
        }
        if($.trim(expect) === ""){
            msg("error", "请填写预期结果")
            return
        }
        let url = current_host + "/case/add"
        let data = "pd="+product
            +"&md="+module
            +"&name="+encodeURIComponent(name)
            +"&type="+type
            +"&p="+priority
            +"&tags="+tags
            +"&step="+encodeURIComponent(step)
            +"&expect="+encodeURIComponent(expect)
            $.ajax({
                type : "POST",
                url : url,
                dataType: "json",
                data : data,
                async : false,
                success : function(r){
                    $(".cancel_modal").click()
                    if(r.err == 0){
                        console.log(r.data._id)
                        msg("success", r.msg)
                        add_case_node(module, r.data._id, name)
                        $("#success_msg").text("")
                        $("#case_name").val('')
                        $("#editor-one").empty()
                        $("#editor-two").empty()
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

function upload_template(){
    $("#upload_template").click(function () {
        console.log("点击浏览")
        $("#template").click();
    });

    $("#template").on("change", function () {
        let file_name = $(this).val();
        let arr = file_name.split(".");
        let ext = arr[arr.length-1];
        if (ext == "xlsx" | ext == "xls"){
            $("#upload_template").val(file_name);

        }else{
            msg("error", "文件类型错误!")
        }
    });

    $("#confirm").click(function () {
        let url = current_host + "/case/batch"
        let name = "file";
        let product_id = $("#product_id").val();
        let formData = new FormData();
        formData.append('product_id', product_id)
        formData.append(name, $("#template")[0].files[0]);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                async : false,
                success : function(r){
                    if(r.err == 0){
                        msg("success", r.msg)
                        window.location.reload();
                    }else{
                        msg("error", r.msg)
                    }
                },
                error: function(r){
                    msg("error", "服务端请求出错!")
                }
            });
    })
}

function show_case_num(){
    let parents = $(".parent_li")
    $.each(parents, function (i) {
        let p = $(parents[i]).find('.case-node').length
        $(parents[i]).children('a').text("( "+p+" ) ");
    });
}

$(document).ready(function() {
    module_tree();
    save_module();
    change_order();
    choose_module();
    save_case();
    upload_template();
    show_case_num();
});
