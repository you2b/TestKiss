;$(function () {
    var product_info = null;
    var addModal = $('#addModal');
    addModal.on('show.bs.modal',function (e) {
        var target = e.relatedTarget;
        if (target === undefined) return;
        var selectObj = null;
        var selectList = $('#versionTable').bootstrapTable('getSelections');
        if (target.id == "add-btn") {
            $('#addModalLabel').text("新增");
        } else if (target.id == "edit-version-btn") {
            if(selectList.length <= 0){
                alert("请选择版本！");
                return false;
            }
            $('#addModalLabel').text("修改");
            selectObj = selectList[0]
        }
        $('#error-msg').addClass('hide');
        $('#form-id').val(selectObj ? selectObj.id: "");
        $('#form-num').val(selectObj ? selectObj.version_num: "");
        $('#form-publish').val(selectObj ? timestampToTime(selectObj.publish_time): timestampToTime( Date.parse(new Date())));
        $('#form-owner').val(selectObj ? selectObj.owner: "");
        $('#form-developOwner').val(selectObj ? selectObj.develop_owner: "");
        $('#form-testOwner').val(selectObj ? selectObj.test_owner: "");
        $('#form-verifyOwner').val(selectObj ? selectObj.verify_owner: "");
        $('#form-download').val(selectObj ? selectObj.download_link: "");
        $('#form-status').val(selectObj ? selectObj.status: 1)
        $('#form-desc').val(selectObj ? selectObj.desc: "");
    });

    $('#form-num').on('focus',function () {
        $('#error-msg').addClass('hide');
    });

    $('#form-desc').on('focus',function () {
        $('#error-msg').addClass('hide');
    });

    $('#edit-btn').click(function () {
        $('#descTextarea').removeAttr("disabled");
        $('#descTextarea').focus();
        $('#edit-btn').addClass("hidden");
        $('#save-btn').removeClass("hidden");
        $('#back-btn').removeClass("hidden");
    });

    $('#save-btn').click(function () {
        var formData = new FormData();
        formData.append('id', product_info.id);
        formData.append('desc', $('#descTextarea').val().trim());
        $.ajax({
            url: 'http://products.newayz.com/api/updateProduct',
            type: 'post',
            data: formData,
            scriptCharset: 'utf-8',
            processData: false,
            contentType: false,
            success: function success(data) {
                if (data.err == 0) {
                    $('#descTextarea').attr("disabled", "disabled");
                    $('#edit-btn').removeClass("hidden");
                    $('#save-btn').addClass("hidden");
                    $('#back-btn').addClass("hidden");
                    product_info.desc = formData.get('desc');
                } else {
                    alert('保存失败！');
                    console.log(data);
                }
            }
        });
    });

    $('#back-btn').click(function () {
        if(confirm("确认放弃修改内容？")){
            $('#descTextarea').val(product_info.desc);
            $('#descTextarea').attr("disabled", "disabled");
            $('#edit-btn').removeClass("hidden");
            $('#save-btn').addClass("hidden");
            $('#back-btn').addClass("hidden");
        }
    });

    $('#save-version-btn').click(function () {
        var errMsg = $('#error-msg');
        var num = $('#form-num').val().trim();
        if(!num.length){
            errMsg.html('请输入版本号！').removeClass('hide');
            return;
        }
        var owner = $('#form-owner').val().trim();
        if(!owner.length){
            errMsg.html('请输入产品owner！').removeClass('hide');
            return;
        }
        var desc = $('#form-desc').val().trim();
        if(!desc.length){
            errMsg.html('请输入产品版本说明！').removeClass('hide');
            return;
        } else if(desc.length > 500) {
            errMsg.html('版本说明限制字数500！').removeClass('hide');
            return;
        }

        var formData = new FormData();
        var versionId = $('#form-id').val().trim();
        if (versionId.length > 0) {
            formData.append('id', versionId);
        }
        formData.append('productId', product_info.id);
        formData.append('num', num);
        formData.append('publishTime', $('#form-publish').val());
        formData.append('owner', owner);
        formData.append('developOwner', $('#form-developOwner').val().trim());
        formData.append('testOwner', $('#form-testOwner').val().trim());
        formData.append('verifyOwner', $('#form-verifyOwner').val().trim());
        formData.append('downloadLink', $('#form-download').val().trim());
        formData.append('desc', desc);
        formData.append('status', $('#form-status').val());
        $.ajax({
            url: 'http://products.newayz.com/api/addVersion',
            type: 'post',
            data: formData,
            scriptCharset: 'utf-8',
            processData: false,
            contentType: false,
            success: function success(data) {
                if (data.err == 0) {
                    addModal.modal('hide');
                    $('#versionTable').bootstrapTable('refresh');
                } else if (data.err == 100005) {
                     errMsg.html('版本号重复！').removeClass('hide');
                     return;
                } else {
                    alert('添加失败！');
                    console.log(data);
                }
            }
        });
    });

    $('#delete-btn').click(function () {
        var selectList = $('#versionTable').bootstrapTable('getSelections');
        if(selectList.length <= 0) {
            alert('请选择版本！');
            return;
        }

        var selectObj = selectList[0];
        if(confirm("确认删除该版本？")){
            $.get("http://products.newayz.com/api/delVersion", {'id': selectObj.id}, function (result) {
                if (result.err == 0) {
                    $('#versionTable').bootstrapTable('refresh');
                } else {
                    alert('删除失败！');
                }
            });
        }
    });

    $('#send-email-btn').click(function () {
        var selectList = $('#versionTable').bootstrapTable('getSelections');
        if(selectList.length <= 0) {
            alert('请选择版本！');
            return;
        }

        var selectObj = selectList[0];
        if(confirm("确认发送邮件到该产品的邮件组？")){
            $.get("http://products.newayz.com/api/sendEmail", {'versionId': selectObj.id, 'name':product_info.name}, function (result) {
                if (result.err == 0) {
                    // alert('发送成功！');
                } else {
                    alert('发送失败！');
                }
            });
        }
    });

    $('#form-publish').click(function () {
        $(this).blur();
    });

    var pos = getUrlParam("pos");
    if (pos == 1) {
        $('#nav-link').text("potal页");
        $('#nav-link').attr("href", "http://products.newayz.com");
    } else if(pos == 2) {
        $('#nav-link').text("产品列表页");
        $('#nav-link').attr("href", "http://products.newayz.com/product");
    }

    $.get("http://products.newayz.com/api/getProduct", {'id': getUrlParam('id')}, function (result) {
        if (result.err == 0) {
            product_info = result.data;
            if (!product_info) {
                return
            }
            if (product_info.name) {
                $('#product-title').text(product_info.name);
            }
            if (product_info.desc) {
                $('#descTextarea').val(product_info.desc);
            }
            if (product_info.site) {
                $('#site-row').removeClass("hidden");
                $('#site-row a:first').text(product_info.site);
                $('#site-row a:first').attr('href', product_info.site);
            }
            else {
                $('#site-row').addClass("hidden");
            }
            if (product_info.product_doc) {
                $('#prodoc-row').removeClass("hidden");
                $('#prodoc-row a:first').text(product_info.product_doc);
                $('#prodoc-row a:first').attr('href', product_info.product_doc);
            } else {
                $('#prodoc-row').addClass("hidden");
            }
            if (result.data.business_doc) {
                $('#busdoc-row').removeClass("hidden");
                $('#busdoc-row a:first').text(product_info.business_doc);
                $('#busdoc-row a:first').attr('href', product_info.business_doc);
            } else {
                $('#busdoc-row').addClass("hidden");
            }
        }
    });
});