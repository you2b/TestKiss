function delete_run(){
    let delete_id = ''
    $(".delete-run").click(function () {
        delete_id = $(this).val();
        let name = $(this).parent().parent().children("td:eq(2)").text();
        $("#delete_id").val(delete_id);
        $("#delete_name").text(name);
    });

    $("#delete_run").click(function () {
        let url = current_host + '/run/del/'+delete_id
        $.ajax({
                type : "delete",
                url : url,
                dataType: "json",
                async : false,
                success : function(r){
                    if(r.err == 0){
                        msg("success", r.msg);
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
    delete_run();
});
