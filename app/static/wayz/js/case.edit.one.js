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
                            $("#editor-one").append(img);
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
                console.log(f.height);
                console.log(f.width);
                let reader=new FileReader();
                reader.readAsDataURL(f);
                		reader.onload=function(e){
                        let base64_str=this.result;
                        let img = new Image();
                        img.src = this.result.toString();
                        img.className = 'mg-responsive img-rounded';
                        img.style.maxWidth = '200px';
                        img.style.maxHeight = '180px';
                            $("#editor-two").append(img);
                		}
                console.log(item);
            }
        }
    });
}
)

function update_case(){
    $("#update_case").click(function () {
        let _id = $("#case_id").val();
        let name = $("#case_name").val();
        let type = $("#case_type").val();
        let priority = $("#case_priority").val();
        let spans = $("#edit-tags").find('span.tag');
        let step = $("#editor-one").html();
        let expect = $("#editor-two").html();
        let tags = new Array();
        if(spans.length > 0){
            $.each(spans, function (i) {
                tags[i] = $.trim($(spans[i]).children('span').text());
                console.log("标签:"+tags[i]);
            })
            console.log(tags);
        }
        if($.trim(name) === ""){
            msg("error", "请填写用例名称！");
            return;
        }
        if($.trim(step) === ""){
            msg("error", "请填写测试步骤");
            return;
        }
        if($.trim(expect) === ""){
            msg("error", "请填写预期结果");
            return;
        }
        let url = current_host + "/case/edit"
        let data = "_id="+_id
            +"&name="+encodeURIComponent(name)
            +"&type="+type
            +"&p="+priority
            +"&tags="+tags
            +"&step="+encodeURIComponent(step)
            +"&expect="+encodeURIComponent(expect)
            $.ajax({
                type : "PUT",
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
                error: function(r){
                    msg("error", "服务端请求出错!");
                }
            });
    });
}

function remove_tag(){
    $("span.tag").children('a').click(function () {
        $(this).parent().remove();
    });
}

$(document).ready(function() {
    update_case();
    remove_tag();
});
