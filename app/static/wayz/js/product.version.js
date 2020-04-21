function add_product_version() {
    $("#add_product_version").click(function () {
        let url = current_host + '/product/version'
        let pd_ver = $("#pd_ver")
        let product_id = $("#product_id").val()
        let version = $("#product_version").val()
        let data = "product_id="+product_id+"&version="+version
        let option = "<option value=\""+version+"\">"+version+"</option>"
        console.log("产品ID:" + product_id)
        console.log("版本:" + version)
            $.ajax({
            type :"POST",
            url : url,
            dataType: "json",
            data : data,
            async : false,
            success : function(r){
                if(r.err == 0){
                    console.log(r.data._id);
                    pd_ver.prepend(option);
                    $("#add_product_version").prev().click();
                    msg("success", "添加成功！");
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
    add_product_version();
});
