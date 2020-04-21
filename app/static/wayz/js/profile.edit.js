//编辑框实现粘贴图片功能
$(function () {
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
                            $("#editor-two").append(img);
                		}
                console.log(item);
            }
        }
    });
}
)

function save_profile(){
    const url = current_host + "/user/profile/edit"
    let skill_html = "<li>\n" +
        "<div class=\"tree-line skill-name\" contenteditable=\"true\"></div>\n" +
        "<div class=\"tree-line skill-point\" contenteditable=\"true\">0.0</div>\n" +
        "</li>"
    $("#add_skill").click(function () {
        $("#skill_list").append(skill_html);
    });
    $("#save_profile").click(function () {
        const user_id = $("#user_id").val();
        let addr = $("#user_addr").text();
        let title = $("#user_title").text();
        let sk = $("#skill_list").find('li');
        let skills = new Array();
        let phone = $("#user_phone").text();
        let favor = $("#user_favor").text();
        $.each(sk, function (i) {
            console.log($(sk[i]).html())
            let d = {}
            d['sk'] = $(sk[i]).find('.skill-name').text()
            d['sp'] = $(sk[i]).find('.skill-point').text()
            if(d['sk'] != ""){
                skills[i] = d['sk']+":"+d['sp']
            }
        })
        let intro = $("#editor-two").html();
        let data = "user_id="+user_id+"&title="+title+"&addr="+addr+"&skills="+skills+"&intro="+encodeURIComponent(intro)+
            "&phone="+phone+"&favor="+favor
        $.ajax({
            type : "PUT",
            url : url,
            dataType: "json",
            data : data,
            async : false,
            success : function(r){
                $(".cancel_modal").click()
                if(r.err == 0){
                    msg("success", r.msg)
                    window.location.href = r.data.url;
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
    save_profile();
});
