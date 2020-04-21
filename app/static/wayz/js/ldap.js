function SHA256(p){var k=8;var n=0;function i(q,t){var s=(q&65535)+(t&65535);var r=(q>>16)+(t>>16)+(s>>16);return(r<<16)|(s&65535)}function e(r,q){return(r>>>q)|(r<<(32-q))}function f(r,q){return(r>>>q)}function a(q,s,r){return((q&s)^((~q)&r))}function d(q,s,r){return((q&s)^(q&r)^(s&r))}function g(q){return(e(q,2)^e(q,13)^e(q,22))}function b(q){return(e(q,6)^e(q,11)^e(q,25))}function o(q){return(e(q,7)^e(q,18)^f(q,3))}function j(q){return(e(q,17)^e(q,19)^f(q,10))}function c(r,s){var E=new Array(1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298);var t=new Array(1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225);var q=new Array(64);var G,F,D,C,A,y,x,w,v,u;var B,z;r[s>>5]|=128<<(24-s%32);r[((s+64>>9)<<4)+15]=s;for(var v=0;v<r.length;v+=16){G=t[0];F=t[1];D=t[2];C=t[3];A=t[4];y=t[5];x=t[6];w=t[7];for(var u=0;u<64;u++){if(u<16){q[u]=r[u+v]}else{q[u]=i(i(i(j(q[u-2]),q[u-7]),o(q[u-15])),q[u-16])}B=i(i(i(i(w,b(A)),a(A,y,x)),E[u]),q[u]);z=i(g(G),d(G,F,D));w=x;x=y;y=A;A=i(C,B);C=D;D=F;F=G;G=i(B,z)}t[0]=i(G,t[0]);t[1]=i(F,t[1]);t[2]=i(D,t[2]);t[3]=i(C,t[3]);t[4]=i(A,t[4]);t[5]=i(y,t[5]);t[6]=i(x,t[6]);t[7]=i(w,t[7])}return t}function h(t){var s=Array();var q=(1<<k)-1;for(var r=0;r<t.length*k;r+=k){s[r>>5]|=(t.charCodeAt(r/k)&q)<<(24-r%32)}return s}function m(r){r=r.replace(/\r\n/g,"\n");var q="";for(var t=0;t<r.length;t++){var s=r.charCodeAt(t);if(s<128){q+=String.fromCharCode(s)}else{if((s>127)&&(s<2048)){q+=String.fromCharCode((s>>6)|192);q+=String.fromCharCode((s&63)|128)}else{q+=String.fromCharCode((s>>12)|224);q+=String.fromCharCode(((s>>6)&63)|128);q+=String.fromCharCode((s&63)|128)}}}return q}function l(s){var r=n?"0123456789ABCDEF":"0123456789abcdef";var t="";for(var q=0;q<s.length*4;q++){t+=r.charAt((s[q>>2]>>((3-q%4)*8+4))&15)+r.charAt((s[q>>2]>>((3-q%4)*8))&15)}return t}p=m(p);return l(c(h(p),p.length*k))};
	(function(f){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",l="",j=[256],e=[256],g=0;var d={encode:function(c){var i=c.replace(/[\u0080-\u07ff]/g,function(n){var m=n.charCodeAt(0);return String.fromCharCode(192|m>>6,128|m&63)}).replace(/[\u0800-\uffff]/g,function(n){var m=n.charCodeAt(0);return String.fromCharCode(224|m>>12,128|m>>6&63,128|m&63)});return i},decode:function(i){var c=i.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(n){var m=((n.charCodeAt(0)&15)<<12)|((n.charCodeAt(1)&63)<<6)|(n.charCodeAt(2)&63);return String.fromCharCode(m)}).replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(n){var m=(n.charCodeAt(0)&31)<<6|n.charCodeAt(1)&63;return String.fromCharCode(m)});return c}};while(g<256){var h=String.fromCharCode(g);l+=h;e[g]=g;j[g]=b.indexOf(h);++g}function a(z,u,n,x,t,r){z=String(z);var o=0,q=0,m=z.length,y="",w=0;while(q<m){var v=z.charCodeAt(q);v=v<256?n[v]:-1;o=(o<<t)+v;w+=t;while(w>=r){w-=r;var p=o>>w;y+=x.charAt(p);o^=p<<w}++q}if(!u&&w>0){y+=x.charAt(o<<(r-w))}return y}var k=f.base64=function(i,c,m){return c?k[i](c,m):i?null:this};k.btoa=k.encode=function(c,i){c=k.raw===false||k.utf8encode||i?d.encode(c):c;c=a(c,false,e,b,8,6);return c+"====".slice((c.length%4)||4)};k.atob=k.decode=function(n,c){n=n.replace(/[^A-Za-z0-9\+\/\=]/g,"");n=String(n).split("=");var m=n.length;do{--m;n[m]=a(n[m],true,j,l,6,8)}while(m>0);n=n.join("");return k.raw===false||k.utf8decode||c?d.decode(n):n}}(jQuery));

(function (window) {
    let query = {
        response_type: 'code',
        state: 'wayz'
    }
    if (location.search) {
        let st = location.search.replace('?', '')
        st.split('&').forEach(function(par) {
            let arr = par.split('=');
            query[arr[0]] = decodeURIComponent(arr[1]);
        })
    }

    // 事件
    $('.tab-btn span').on('click', function () {
        $('.tab-btn span').removeClass('active');
        $(this).addClass('active');
        let form = $(this).attr('data-form');
        $('form').hide();
        $('#' + form + 'Form').show();
    });

    let loginUrl = "https://openapi.newayz.com";
    let authUrl = "https://oauth.newayz.com";
    function submitLogin() {
        let account = $('#account').val();
        let password = $('#password').val();
        if (!account || !password) {
            return;
        }
        let ut = "wayz"
        password = $.base64.btoa(password);
        let data = {
            "account_name": account,
            "password": password,
            "ut": ut
        }
        $.ajax({
            type: "POST",
            url: loginUrl + "/barrack/identity/v1/login",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (message) {
                if (message.code) {
                    msg("error", message.msg);
                }
                if (message.code == 0) {
                    //成功，跳转
                    location.href = authUrl + "/oauth2/authorize?response_type=" + query.response_type + "&client_id=" + query.client_id
                        + "&redirect_uri=" + encodeURIComponent( query.redirect_uri) + "&state=" + query.state + "&au=" + message.data.user_token;
                }
            },
            error: function (message) {
                msg("error", "提交数据失败！");
            }
        });
        return false;
    }
    window.submitLogin = submitLogin;
})(window);
