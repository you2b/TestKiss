function add_product_category(){
    $("#add_category").click(function(){
        let name = $("#pc_name").val()
        let desc = $("#pc_desc").val()
        let url = current_host + '/product/categories'
        if (name == ""){
            msg("error", "产品分类名称不能为空!")
            return
        }
        $.ajax({
            type : "post",
            url : url,
            dataType: "json",
            data : "name=" + name + "&desc=" + desc,
            async : false,
            success : function(r){
                $("#pc_msg").text("")

                if(r.err == 0){
                    msg("success", r.msg);
                    window.location.reload();
                }else{
                    msg("error", r.msg);
                }
            },
            error: function(r){
                msg("error", "服务端请求出错!");
            }
        });
  });
}

function delete_product_category(){
    $(".delete-pc").click(function () {
        let $this = $(this)
            $("#delete_id").val($(this).val())
            $("#delete_name").text($this.parent().parent().children("td:eq(2)").text())
        });
        $("#delete_category").click(function () {
            let url = current_host + '/product/categories'
            $.ajax({
                type : "delete",
                url : url,
                dataType: "json",
                data : "_id=" + $("#delete_id").val(),
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
                    msg("error", "服务端请求出错!");
                }
            });
        });
}

function update_product_category(){
    $(".update-pc").click(function () {
            let $tr = $(this).parent().parent();
            $("#edit_id").val($tr.children("td:eq(1)").text());
            $("#edit_name").val($tr.children("td:eq(2)").text());
            $("#edit_desc").val($tr.children("td:eq(3)").text());
        });
        $("#edit_category").click(function () {
            let url = current_host + '/product/categories'
            console.log($("#edit_id").val());
            console.log($("#edit_name").val());
            console.log($("#edit_desc").val());
            $.ajax({
                type : "put",
                url : url,
                dataType: "json",
                data : "_id=" + $("#edit_id").val() + "&name=" + $("#edit_name").val() + "&desc=" + $("#edit_desc").val(),
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
                    msg("error", "服务端请求出错!");
                }
            });
        });
}

$(document).ready(function() {
    add_product_category();
    delete_product_category();
    update_product_category();
});
