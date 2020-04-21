;$(function () {

    var addModal = $('#addModal');
    addModal.on('show.bs.modal',function (e) {
        var target = e.relatedTarget;
        if (target === undefined) return;

        var selectObj = null;
        var selectList = $('#labelTable').bootstrapTable('getSelections');
        if (target.id == "add-btn") {
        } else if (target.id == "edit-btn") {
            if(selectList.length <= 0){
                alert("请选择标签！");
                return false;
            }
            selectObj = selectList[0]
        } else if (target.id == "delete-btn") {
            if(selectList.length <= 0){
                alert("请选择标签！");
                return false;
            }
            selectObj = selectList[0]
        }

        $('#error-msg').addClass('hide');
        $('#form-id').val(selectObj ? selectObj.id: "");
        $('#form-name').val(selectObj ? selectObj.name: "");
        $('#form-type').val(selectObj ? selectObj.type: 1);
    });


    $('#form-name').on('focus',function () {
        $('#error-msg').addClass('hide');
    });

    $('#save-btn').click(function () {
        var errMsg = $('#error-msg');
        var name = $('#form-name').val().trim();
        if(!name.length){
            errMsg.html('请输入标签名称！').removeClass('hide');
            return;
        }

        var formData = new FormData();
        var labelId = $('#form-id').val().trim();
        if (labelId.length > 0) {
            formData.append('id', labelId);
        }
        formData.append('name', name);
        formData.append('type', $('#form-type').val());
        $.ajax({
            url: 'http://products.newayz.com/api/addLabel',
            type: 'post',
            data: formData,
            scriptCharset: 'utf-8',
            processData: false,
            contentType: false,
            success: function success(data) {
                if (data.err == 0) {
                    $('#labelTable').bootstrapTable('refresh');
                    addModal.modal('hide');
                } else if (data.err == 100005) {
                     errMsg.html('标签名称重复！').removeClass('hide');
                }else {
                    alert('保存失败！');
                    console.log(data);
                }
            }
        });
    });

    $('#delete-btn').click(function () {
        var selectList = $('#labelTable').bootstrapTable('getSelections');
        if(selectList.length <= 0){
            alert("请选择标签！");
            return;
        }
        if(confirm("确认删除该标签？")){
            $.get("http://products.newayz.com/api/delLabel", {'id': selectList[0].id}, function (result) {
                if (result.err == 0) {
                    $('#labelTable').bootstrapTable('refresh');
                } else {
                    alert('删除失败！');
                }
            });
        }
    });


});