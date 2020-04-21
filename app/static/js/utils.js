function formatDateTime(inputTime) {
    var d = new Date(inputTime);
    var utc_d = Date.UTC(d.getFullYear(),d.getMonth() ,d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds());
    var local_d  = new Date(utc_d);
    var y = local_d.getFullYear();
    var m = local_d.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var day = local_d.getDate();
    d = day < 10 ? ('0' + day) : day;
    var h = local_d.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = local_d.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = local_d.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h +':' + minute + ':' + second;
};

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};

function timestampToTime(timestamp) {
    var date = new Date(timestamp);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D+h+m+s;
 };