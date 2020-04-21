/**
 * Created by jasonliang on 2017/8/24.
 */
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

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.unique = function(){
     var res = [];
     var json = {};
     for(var i = 0; i < this.length; i++){
          if(!json[this[i]]){
           res.push(this[i]);
           json[this[i]] = 1;
          }
     }
     return res;
}

function isJsonString(str) {
    try {
        if (typeof JSON.parse(str) == "object") {
            return true;
        }
    } catch(e) {
    }
    return false;
}