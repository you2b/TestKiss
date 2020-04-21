function init_product_categories(select_id){
    let url = current_host + "/product/categories/all"
    let $product_category = $(".pd-category")
    let options = '<option value="0">产品分类</option>'
        $.get(url, function (r, s) {
            if(r.err != 0){
                msg("error", "获取产品分类出错！");
                return;
            }
            d = r.data
            $.each(d, function (i,t) {
                if(d[i]['_id'] == select_id){
                    options += "<option value ='" + d[i].name + "' selected='selected'>" + d[i].name + "</option>"
                }else{
                    options += "<option value ='" + d[i].name + "'>" + d[i].name + "</option>"
                }
            })
            $product_category.empty();
            $product_category.append(options);
        });
}

function add_product(){
    $("#add_product").click(function(){
        let name = $("#pd_name").val();
        let desc = $("#pd_desc").val();
        let link = $("#pd_link").val();
        let category = $("#product_category").val();
        console.log(category)
        let data = "name=" + name + "&category=" + category + "&link=" + link + "&desc=" + desc
        let url = current_host + '/product/add'
        if (name == ""){
            msg("error", "请填写产品名称!");
            return;
        }
        if (category == "0"){
            msg("error", "请选择分类！");
            return;
        }
        $.ajax({
            type : "post",
            url : url,
            dataType: "json",
            data : data,
            async : false,
            success : function(r){
                $("#pd_msg").text("");
                if(r.err == 0){
                    msg("success", r.msg);
                    window.location.reload();
                }else{
                    msg("error", r.msg);
                }
            },
            error: function(r){
                msg("error","服务端请求出错!");
            }
        });
  });
}

function delete_product(){
    $(".delete-pd").click(function () {
        let $this = $(this);
        $("#delete_id").val($(this).val());
        $("#delete_name").text($this.parent().parent().children("td:eq(2)").text());
    });
    $("#delete_product").click(function () {
        let url = current_host + '/product/del'
        $.ajax({
            type : "delete",
            url : url,
            dataType: "json",
            data : "_id=" + $("#delete_id").val(),
            async : false,
            success : function(r){
                if(r.err == 0){
                    msg("success", r.msg)
                    window.location.reload();
                }else{
                    msg("error", r.msg);
                }
            },
            error: function(r){
                msg("error","服务端请求出错!");
            }
        });
    });
}

function update_product(){
    $(".update-pd").click(function () {
            let $tr = $(this).parent().parent()
            $("#edit_id").val($tr.children("td:eq(1)").text());
            $("#edit_name").val($tr.children("td:eq(2)").text());
            $("#edit_link").val($tr.children("td:eq(3)").text());
            $("#edit_desc").val($tr.children("td:eq(4)").text());
        });
        $("#edit_product").click(function () {
            let url = current_host + '/product/update'
            $.ajax({
                type : "put",
                url : url,
                dataType: "json",
                data : "_id=" + $("#edit_id").val() + "&name=" + $("#edit_name").val() +"&link=" + $("#edit_link").val()+ "&desc=" + $("#edit_desc").val(),
                async : false,
                success : function(r){
                    if(r.err == 0){
                        msg("success", r.msg);
                        window.location.reload();
                    }else{
                        msg("error", r.msg);
                    }
                },
                error: function(r){
                    msg("error","服务端请求出错!");
                }
            });
        });
}

$(document).ready(function() {
    add_product();
    delete_product();
    update_product();
    init_product_categories(0);
});
