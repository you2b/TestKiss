function delete_plan(){
    $(".delete-pl").click(function () {
        let delete_id = $(this).val();
        $("#delete_id").val(delete_id);
        $("#delete_name").text($(this).parent().parent().children("td:eq(2)").text());

    })
    $("#delete_plan").click(function () {
        let url = current_host + '/plan/del'
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
            error: function(){
                msg("error", "服务端请求出错!");
            }
        });
    });


}

$(document).ready(function() {
    delete_plan();
});
