;$(function () {

    $('#myCarousel').carousel({
	    interval: false,
        wrap: false
	});

    var potalPageCount = 0;
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
                    if (item.type == 1) {
                        if(businessCheckBoxs.length < 10) {
                            businessCheckBoxs.push('<button class="btn btn-round btn-label" value=' + item.id + ' type="button">'
                            + '<label class="text-center label-label">' + item.name + '</label><span class="badge icon-checked hidden">✔</span>');
                        }
                    } else if (item.type == 2) {
                        if (productCheckBoxs.length < 10) {
                            productCheckBoxs.push('<button class="btn btn-round btn-label" value=' + item.id + ' type="button">'
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
                selectProIds = [];
            } else {
                selectProIds = selIds;
            }
        } else {
            if(allChecked || noChecked) {
                selectBusIds = [];
            } else {
                selectBusIds = selIds;
            }
        }
        reloadProductList();
    });

    function reloadProductList() {
        var formData = new FormData();
        if(selectProIds.length > 0) {
            formData.append('proLabelIds', selectProIds.join(','));
        }
        if (selectBusIds.length > 0) {
            formData.append('busLabelIds', selectBusIds.join(','));
        }

        $.ajax({
            url: 'http://products.newayz.com/api/portalProducts',
            type: 'post',
            data: formData,
            scriptCharset: 'utf-8',
            processData: false,
            contentType: false,
            success: function success(result) {
                if (result.err == 0) {
                    productArray = result.data;
                    var count = productArray.length;

                    $('#left-arrow').addClass("hidden");
                    $('#right-arrow').addClass("hidden");
                    potalPageCount = Math.ceil(count/8);
                    if (potalPageCount > 1) {
                        $('#right-arrow').removeClass("hidden");
                    }
                    if (count == 0) {
                        $('.carousel-inner').addClass("hidden");
                        $('.carousel-empty').removeClass("hidden");
                        return;
                    }
                    else {
                        $('.carousel-empty').addClass("hidden");
                        $('.carousel-inner').removeClass("hidden");
                    }
                    var htmlContent = "";
                    for(var i=0; i<count; i++){
                        item = productArray[i];
                        if (i%8  == 0) {
                            if (i == 0) {
                                htmlContent += '<div class="item active">';
                            } else {
                                htmlContent += '<div class="item">';
                            }
                        }
                        if (i%4  == 0) {
                            htmlContent += '<div class="row" style="margin-top:10px;">';
                        }

                        var html_download_link = '';
                        if (item.download_link) {
                            html_download_link = '<a target="view_window" href="' + item.download_link + '" class="btn product-detail-download-icon" role="button"></a>\n';
                        }
                        var html_site_link = '';
                        if (item.site) {
                            html_site_link = '<a target="view_window" href="' + item.site + '" class="btn product-detail-link-icon" role="button"></a>\n';
                        }
                        var latest_version_time = item.latest_version_time ? "最近发版" + item.latest_version_time : "无最近发版";
                        var latest_version_desc = item.latest_version_desc ? item.latest_version_desc : "";
                        var next_version_time = item.next_version_time ? "下次发版" + item.next_version_time : "无下次发版";
                        var next_version_desc = item.next_version_desc ? item.next_version_desc : "";
                        htmlContent += '                      <div class="col-md-3 col-xs-6">' +
                            '                                    <div class="product-content">' +
                            '                                        <div class="row text-center"><span class="product-title" title="' + item.title + '">' + item.title + '</span></div>' +
                            '                                        <p class="version-desc">' + latest_version_time + '</p>' +
                            '                                        <p class="product-desc" title="' + latest_version_desc + '">' + latest_version_desc + '</p>' +
                            '                                        <hr style="width:90%" class="portal-line">' +
                            '                                        <p class="version-desc">' + next_version_time + '</p>' +
                            '                                        <p class="product-desc" title="' + next_version_desc + '">' + next_version_desc + '</p>'+
                            '                                        <div class="row">' +
                            '                                            <div class="col-md-4 col-xs-2">' +
                            '                                            </div>' +
                            '                                            <div class="col-md-4 col-xs-3 text-center">' +
                            '                                                <a class="btn product-detail" href="http://products.newayz.com/product/version?id='+ item.id +'&pos=1" role="button">查看详情></a>\n' +
                            '                                            </div>' +
                            '                                            <div class="col-md-4 col-xs-7">' +
                            '                                                <div class="row">' +
                            '                                                    <div class="col-md-3">' + html_download_link + '</div>' +
                            '                                                    <div class="col-md-3">' + html_site_link + ' </div>' +
                            '                                                </div>' +
                            '                                            </div>' +
                            '                                        </div>' +
                            '                                    </div>' +
                            '                                </div>';

                        if ((i+1)%4  == 0) {
                            htmlContent += '</div>';
                        }

                        if ((i+1)%8  == 0) {
                            htmlContent += '</div>';
                        }
                    }
                    htmlContent += '</div></div>';
                    $('.carousel-inner').html(htmlContent);
                }
            }
        });
    }

    function reloadCount() {
        var param = {};
        $.get("http://products.newayz.com/api/totals", param, function (result) {
            if (result.err == 0) {
                $('.total-number').text(result.data.total);
                $('.month-number').text(result.data.month_count);
                $('.week-number').text(result.data.week_count);
            }
        });
    }

     $('#myCarousel').on('slide.bs.carousel', function (event) {
         var $hoder = $('#myCarousel').find('.item'),
         $items = $(event.relatedTarget);
         var curIndex = $hoder.index($items);
         if(curIndex==0) {
             $('#left-arrow').addClass("hidden");
                 if (potalPageCount > 1) {
                    $('#right-arrow').removeClass("hidden");
                 }
         } else if(curIndex==potalPageCount-1) {
             $('#left-arrow').removeClass("hidden");
             $('#right-arrow').addClass("hidden");
         } else {
             $('#left-arrow').removeClass("hidden");
             $('#right-arrow').removeClass("hidden");
         }
     })

    reloadLabelList();
    reloadProductList();
    reloadCount();
});