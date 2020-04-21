;$(function () {
    var labelArray = [];
    function reloadLabelList() {
        var param = {};
        $.get("http://products.newayz.com/api/labels", param, function (result) {
            if (result.err == 0) {
                labelArray = result.data;
                var count = labelArray.length;
                var productCheckBoxs = [' <button class="btn btn-round btn-label btn-round-checked" data-check="1" value="all" type="button">\n' +
                '                                <label class="text-center label-label">全部</label>\n' +
                '                                <span class="badge icon-checked">✔</span>\n' +
                '                            </button>'];
                var businessCheckBoxs = [' <button class="btn btn-round btn-label btn-round-checked" data-check="1" value="all" type="button">\n' +
                '                                <label class="text-center label-label">全部</label>\n' +
                '                                <span class="badge icon-checked">✔</span>\n' +
                '                            </button>'];
                for(var i=0; i<count; i++){
                    item = labelArray[i];
                    if (item.type == 2) {
                        if (productCheckBoxs.length < 10) {
                            productCheckBoxs.push('<button class="btn btn-round btn-label" value=' + item.id + ' type="button">'
                            + '<label class="text-center label-label">' + item.name + '</label><span class="badge icon-checked hidden">✔</span>');
                        }
                    } else if (item.type == 1) {
                        if(businessCheckBoxs.length < 10) {
                            businessCheckBoxs.push('<button class="btn btn-round btn-label" value=' + item.id + ' type="button">'
                            + '<label class="text-center label-label">' + item.name + '</label><span class="badge icon-checked hidden">✔</span>');
                        }
                    }
                }

                $('.product-label-row').html(productCheckBoxs.join(''));
                $('.business-label-row').html(businessCheckBoxs.join(''));
            }
        });
    }

    $('body').on('click','.btn-label',function () {
        var allChecked = false;
        var $this = $(this);
        var selIds = [];
        var checked = $this.data("check");
        if (this.value == "all") {
            if (checked == 1) {
                return
            } else {
                allChecked = true;
                $this.data("check", 1);
                $this.addClass("btn-round-checked");
                $(this.lastElementChild).removeClass("hidden");
            }
        } else {
            if (checked == 1) {
                $this.data("check", 0);
                $this.removeClass("btn-round-checked");
                $(this.lastElementChild).addClass("hidden");
            } else {
                $this.data("check", 1);
                $this.addClass("btn-round-checked");
                $(this.lastElementChild).removeClass("hidden");
            }
        }

        var allBtnObj = null;
        var noChecked = true;
        var labelBtnArray = $this.parent().children();
        for (var i = 0; i <labelBtnArray.length; i++) {
            if (labelBtnArray[i].value == "all") {
                allBtnObj = labelBtnArray[i];
            } else {
                if ($(labelBtnArray[i]).data("check") == 1) {
                    if (allChecked) {
                        $(labelBtnArray[i]).data("check", 0);
                        $(labelBtnArray[i]).removeClass("btn-round-checked");
                        $(labelBtnArray[i].lastElementChild).addClass("hidden")
                    } else {
                        selIds.push(labelBtnArray[i].value);
                    }
                    noChecked = false;
                }
            }
        }
        if (!allChecked) {
            if (noChecked) {
                $(allBtnObj).data("check", 1);
                $(allBtnObj).addClass("btn-round-checked");
                $(allBtnObj.lastElementChild).removeClass("hidden");
            } else {
                $(allBtnObj).data("check", 0);
                $(allBtnObj).removeClass("btn-round-checked");
                $(allBtnObj.lastElementChild).addClass("hidden");
            }
        }

        if ($this.parent().attr("class") == "product-label-row") {
            if(allChecked || noChecked) {
                selectProIds = null;
            } else {
                selectProIds = selIds;
            }
        } else {
            if(allChecked || noChecked) {
                selectBusIds = null;
            } else {
                selectBusIds = selIds;
            };
        }
        $('#productTable').bootstrapTable('refreshOptions',{pageNumber:1});
    });

    var addModal = $('#addModal');
    addModal.on('show.bs.modal',function (e) {
        var target = e.relatedTarget;
        var selectObj = null;
        var selectList = $('#productTable').bootstrapTable('getSelections');
        if (target.id == "add-btn") {
            $('#addModalLabel').text("新增");
        } else if (target.id == "edit-btn") {
            if(selectList.length <= 0){
                alert("请选择产品！");
                return false;
            }
            $('#addModalLabel').text("修改");
            selectObj = selectList[0]
        }

        $('#error-msg').addClass('hide');
        $('#form-id').val(selectObj ? selectObj.id: "");
        $('#form-name').val(selectObj ? selectObj.name: "");
        $('#form-site').val(selectObj ? selectObj.site: "");
        $('#form-doc').val(selectObj ? selectObj.product_doc: "");
        $('#form-business').val(selectObj ? selectObj.business_doc: "");
        var selectLabelids = selectObj ? selectObj.label_ids: [];
        var htmlContent = "";
        var count = labelArray.length;
        var productCheckBoxs = [];
        var businessCheckBoxs = [];
        for(var i=0; i<count; i++){
            item = labelArray[i];
            if (item.type == 2) {
                if ($.inArray(item.id, selectLabelids) >= 0) {
                    productCheckBoxs.push('<button class="btn btn-round btn-round-checked form-label-btn"  data-check="1" value=' + item.id + ' type="button">'
                            + '<label class="text-center label-label">' + item.name + '</label>' +
                             '<span class="badge icon-checked">✔</span>' +
                      '</button>');
                }
                else {
                    productCheckBoxs.push('<button class="btn btn-round form-label-btn" value=' + item.id + ' type="button">'
                            + '<label class="text-center label-label">' + item.name + '</label>' +
                             '<span class="badge icon-checked hidden">✔</span>' +
                      '</button>');
                }

            } else if (item.type == 1) {
                if ($.inArray(item.id, selectLabelids) >= 0) {
                    businessCheckBoxs.push('<button class="btn btn-round btn-round-checked form-label-btn"  data-check="1" value=' + item.id + ' type="button">'
                            + '<label class="text-center label-label">' + item.name + '</label>' +
                              '<span class="badge icon-checked">✔</span>'+
                       '</button>');
                } else {
                    businessCheckBoxs.push('<button class="btn btn-round form-label-btn" value=' + item.id + ' type="button">'
                            + '<label class="text-center label-label">' + item.name + '</label>' +
                              '<span class="badge icon-checked hidden">✔</span>'+
                       '</button>');
                }
            }
        }

        var htmlContent = "";
        for(var i=0; i<productCheckBoxs.length; i++) {
            if (i%5  == 0) {
                htmlContent += '<div class="col-sm-12" style="margin-bottom: 10px;">';
            }
            htmlContent += productCheckBoxs[i];
            if ((i+1)%5  == 0) {
                htmlContent += '</div>';
            }
        }
        $('#form-pro-type').html(htmlContent);
        htmlContent = "";
        for(var i=0; i<businessCheckBoxs.length; i++) {
            if (i%5  == 0) {
                htmlContent += '<div class="col-sm-12" style="margin-bottom: 10px;">';
            }
            htmlContent += businessCheckBoxs[i];
            if ((i+1)%5  == 0) {
                htmlContent += '</div>';
            }
        }
        $('#form-bus-type').html(htmlContent);
    });

    $('body').on('click', '.form-label-btn',function () {
        $('#error-msg').addClass('hide');
        var $this = $(this);
        var checked = $this.data("check");
        if (checked == 1) {
            $this.data("check", 0);
            $this.removeClass("btn-round-checked");
            $(this.lastElementChild).addClass("hidden");
        } else {
            $this.data("check", 1);
            $this.addClass("btn-round-checked");
            $(this.lastElementChild).removeClass("hidden");

            var labelBtnArray = $this.parent().children();
            for (var i = 0; i <labelBtnArray.length; i++) {
                if (labelBtnArray[i] != this) {
                    $(labelBtnArray[i]).data("check", 0);
                    $(labelBtnArray[i]).removeClass("btn-round-checked");
                    $(labelBtnArray[i].lastElementChild).addClass("hidden");
                }
            }
        }
    });

    $('#form-name').on('focus',function () {
        $('#error-msg').addClass('hide');
    });

    $('body').on('click','#save-product-btn',function () {
        var errMsg = $('#error-msg');
        var name = $('#form-name').val().trim();
        if(!name.length){
            errMsg.html('请输入产品名称！').removeClass('hide');
            return;
        }
        var selProIds = [];
        var selBusIds = [];
        $('#form-pro-type button').each(function(index){
            if ($(this).data("check") == 1) {
                selProIds.push(this.value);
            }
        });
        $('#form-bus-type button').each(function(index){
            if ($(this).data("check") == 1) {
                selBusIds.push(this.value);
            }
        });

        if (selProIds.length == 0) {
            errMsg.html('请选择产品类型！').removeClass('hide');
            return;
        }
        if (selBusIds.length == 0) {
            errMsg.html('请选择业务标签！').removeClass('hide');
            return;
        }

        var formData = new FormData();
        var productId = $('#form-id').val().trim();
        if (productId.length > 0) {
            formData.append('id', productId);
        }
        formData.append('name', name);
        formData.append('proLabelIds', selProIds);
        formData.append('busLabelIds', selBusIds);
        formData.append('site', $('#form-site').val().trim());
        formData.append('doc', $('#form-doc').val().trim());
        formData.append('business', $('#form-business').val().trim());
        $.ajax({
            url: 'http://products.newayz.com/api/addProduct',
            type: 'post',
            data: formData,
            scriptCharset: 'utf-8',
            processData: false,
            contentType: false,
            success: function success(data) {
                if (data.err == 0) {
                    $('#productTable').bootstrapTable('refreshOptions',{pageNumber:1});
                    addModal.modal('hide');
                } else if (data.err == 100005) {
                     errMsg.html('产品名称重复！').removeClass('hide');
                } else {
                    alert('添加失败！');
                    console.log(data);
                }
            }
        });
    });

    $('body').on('click', '#delete-btn',function () {
        var selectList = $('#productTable').bootstrapTable('getSelections');
        if(selectList.length <= 0){
            alert("请选择产品！");
            return;
        }
        if(confirm("删除产品的同时，该产品的所有版本信息将同步删除，请慎重操作~，继续删除？")){
            $.get("http://products.newayz.com/api/delProduct", {'id': selectList[0].id}, function (result) {
                if (result.err == 0) {
                    $('#productTable').bootstrapTable('refreshOptions',{pageNumber:1});
                } else {
                    alert('删除失败！');
                }
            });
        }
    });
    reloadLabelList();
});