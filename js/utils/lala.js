/*
 Date: 2013-11-28 
 */

function login() {
    return location.href = "https://passport.jd.com/new/login.aspx?ReturnUrl=" + escape(location.href).replace(/\//g, "%2F"), !1
}

function regist() {
    return location.href = "https://reg.jd.com/reg/person?ReturnUrl=" + escape(location.href), !1
}

function createCookie(a, b, c, d) {
    var d = d ? d : "/";
    if (c) {
        var e = new Date;
        e.setTime(e.getTime() + 1e3 * 60 * 60 * 24 * c);
        var f = "; expires=" + e.toGMTString()
    } else var f = "";
    document.cookie = a + "=" + b + f + "; path=" + d
}

function readCookie(a) {
    for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
        for (var e = c[d];
            " " == e.charAt(0);) e = e.substring(1, e.length);
        if (0 == e.indexOf(b)) return e.substring(b.length, e.length)
    }
    return null
}

function addToFavorite() {
    var a = "http://www.jd.com/",
        b = "\u4eac\u4e1cJD.COM-\u7f51\u8d2d\u4e0a\u4eac\u4e1c\uff0c\u7701\u94b1\u53c8\u653e\u5fc3";
    document.all ? window.external.AddFavorite(a, b) : window.sidebar && window.sidebar.addPanel ? window.sidebar.addPanel(b, a, "") : alert("\u5bf9\u4e0d\u8d77\uff0c\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6b64\u64cd\u4f5c!\n\u8bf7\u60a8\u4f7f\u7528\u83dc\u5355\u680f\u6216Ctrl+D\u6536\u85cf\u672c\u7ad9\u3002"), createCookie("_fv", "1", 30, "/;domain=jd.com")
}

function search(a) {
    var b = "http://search.jd.com/Search?keyword={keyword}&enc={enc}{additional}",
        c = search.additinal || "",
        d = document.getElementById(a),
        e = d.value;
    if (e = e.replace(/^\s*(.*?)\s*$/, "$1"), e.length > 100 && (e = e.substring(0, 100)), "" == e) return window.location.href = window.location.href, void 0;
    var f = 0;
    "undefined" != typeof window.pageConfig && "undefined" != typeof window.pageConfig.searchType && (f = window.pageConfig.searchType);
    var g = "&cid{level}={cid}",
        h = "string" == typeof search.cid ? search.cid : "",
        i = "string" == typeof search.cLevel ? search.cLevel : "",
        j = "string" == typeof search.ev_val ? search.ev_val : "";
    switch (f) {
        case 0:
            break;
        case 1:
            i = "-1", c += "&book=y";
            break;
        case 2:
            i = "-1", c += "&mvd=music";
            break;
        case 3:
            i = "-1", c += "&mvd=movie";
            break;
        case 4:
            i = "-1", c += "&mvd=education";
            break;
        case 5:
            var k = "&other_filters=%3Bcid1%2CL{cid1}M{cid1}[cid2]";
            switch (i) {
                case "51":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5272");
                    break;
                case "52":
                    g = k.replace(/\{cid1}/g, "5272"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}");
                    break;
                case "61":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5273");
                    break;
                case "62":
                    g = k.replace(/\{cid1}/g, "5273"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}");
                    break;
                case "71":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5274");
                    break;
                case "72":
                    g = k.replace(/\{cid1}/g, "5274"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}");
                    break;
                case "81":
                    g = k.replace(/\[cid2]/, ""), g = g.replace(/\{cid1}/g, "5275");
                    break;
                case "82":
                    g = k.replace(/\{cid1}/g, "5275"), g = g.replace(/\[cid2]/, "%3Bcid2%2CL{cid}M{cid}")
            }
            b = "http://search.e.jd.com/searchDigitalBook?ajaxSearch=0&enc=utf-8&key={keyword}&page=1{additional}";
            break;
        case 6:
            i = "-1", b = "http://music.jd.com/8_0_desc_0_0_1_15.html?key={keyword}"
    }
    if ("string" == typeof h && "" != h && "string" == typeof i) {
        var l = /^(?:[1-8])?([1-3])$/;
        i = "-1" == i ? "" : l.test(i) ? RegExp.$1 : "";
        var m = g.replace(/\{level}/, i);
        m = m.replace(/\{cid}/g, h), c += m
    }
    "string" == typeof j && "" != j && (c += "&ev=" + j), e = encodeURIComponent(e), sUrl = b.replace(/\{keyword}/, e), sUrl = sUrl.replace(/\{enc}/, "utf-8"), sUrl = sUrl.replace(/\{additional}/, c), ("undefined" == typeof search.isSubmitted || 0 == search.isSubmitted) && (setTimeout(function() {
        window.location.href = sUrl
    }, 10), search.isSubmitted = !0)
}
window.pageConfig = window.pageConfig || {}, pageConfig.wideVersion = function() {
    return screen.width >= 1210
}(), pageConfig.wideVersion && pageConfig.compatible && (document.getElementsByTagName("body")[0].className = "root61"), pageConfig.FN_getDomain = function() {
    var a = location.hostname;
    return /360buy.com/.test(a) ? "360buy.com" : "jd.com"
}, pageConfig.FN_GetUrl = function(a, b) {
    return "string" == typeof a ? a : pageConfig.FN_GetDomain(a) + b + ".html"
}, pageConfig.FN_StringFormat = function() {
    var a = arguments[0],
        b = arguments.length;
    if (b > 0)
        for (var c = 0; b > c; c++) a = a.replace(new RegExp("\\{" + c + "\\}", "g"), arguments[c + 1]);
    return a
}, pageConfig.FN_GetDomain = function(a) {
    var b = "http://{0}.jd.com/{1}";
    switch (a) {
        case 1:
            b = this.FN_StringFormat(b, "item", "");
            break;
        case 2:
            b = this.FN_StringFormat(b, "book", "");
            break;
        case 3:
            b = this.FN_StringFormat(b, "mvd", "");
            break;
        case 4:
            b = this.FN_StringFormat(b, "e", "");
            break;
        case 7:
            b = this.FN_StringFormat(b, "music", "")
    }
    return b
}, pageConfig.FN_GetImageDomain = function(a) {
    var b, a = String(a);
    switch (a.match(/(\d)$/)[1] % 5) {
        case 0:
            b = 10;
            break;
        case 1:
            b = 11;
            break;
        case 2:
            b = 12;
            break;
        case 3:
            b = 13;
            break;
        case 4:
            b = 14;
            break;
        default:
            b = 10
    }
    return "http://img{0}.360buyimg.com/".replace("{0}", b)
}, pageConfig.FN_ImgError = function(a) {
    for (var b = a.getElementsByTagName("img"), c = 0; c < b.length; c++) b[c].onerror = function() {
        var a = "",
            b = this.getAttribute("data-img");
        if (b) {
            switch (b) {
                case "1":
                    a = "err-product";
                    break;
                case "2":
                    a = "err-poster";
                    break;
                case "3":
                    a = "err-price";
                    break;
                default:
                    return
            }
            this.src = "http://misc.360buyimg.com/lib/img/e/blank.gif", this.className = a
        }
    }
}, pageConfig.FN_SetPromotion = function(a) {
    if (0 != a) {
        var b = "\u9650\u91cf,\u6e05\u4ed3,\u9996\u53d1,\u6ee1\u51cf,\u6ee1\u8d60,\u76f4\u964d,\u65b0\u54c1,\u72ec\u5bb6,\u4eba\u6c14,\u70ed\u5356",
            c = b.split(",")[parseInt(a) - 1],
            d = "<b class='pi{0}'>{1}</b>";
        switch (c.length) {
            case 1:
                d = d.replace("{0}", " pix1 pif1");
                break;
            case 2:
                d = d.replace("{0}", " pix1");
                break;
            case 4:
                d = d.replace("{0}", " pix1 pif4")
        }
        return d.replace("{1}", c)
    }
}, pageConfig.FN_GetRandomData = function(a) {
    for (var b, c = 0, d = 0, e = [], f = 0; f < a.length; f++) b = a[f].weight ? parseInt(a[f].weight) : 1, e[f] = [], e[f].push(c), c += b, e[f].push(c);
    d = Math.ceil(c * Math.random());
    for (var f = 0; f < e.length; f++)
        if (d > e[f][0] && d <= e[f][1]) return a[f]
}, pageConfig.FN_GetCompatibleData = function(a) {
    var b = screen.width < 1210;
    return b && (a.width = a.widthB ? a.widthB : a.width, a.height = a.heightB ? a.heightB : a.height, a.src = a.srcB ? a.srcB : a.src), a
}, pageConfig.FN_InitSlider = function(a, b) {
    var c = function(a, b) {
        return a.group - b.group
    };
    b.sort(c);
    var d, e = b[0].data,
        f = [],
        g = 3 == e.length ? "style2" : "style1";
    f.push('<div class="slide-itemswrap"><ul class="slide-items"><li class="'), f.push(g), f.push('" data-tag="'), f.push(b[0].aid), f.push('">');
    for (var h = 0; h < e.length; h++) d = this.FN_GetCompatibleData(e[h]), f.push('<div class="fore'), f.push(h + 1), f.push('" width="'), f.push(d.width), f.push('" height="'), f.push(d.height), f.push('"><a target="_blank" href="'), f.push(d.href), f.push('" title="'), f.push(d.alt), f.push('"><img src="'), 0 == h ? f.push(d.src) : (f.push('http://misc.360buyimg.com/lib/img/e/blank.gif" style="background:url('), f.push(d.src), f.push(") no-repeat center 0;")), f.push('" width="'), f.push(d.width), f.push('" height="'), f.push(d.height), f.push('" /></a></div>');
    f.push('</li></ul></div><div class="slide-controls"><span class="curr">1</span></div>'), document.getElementById(a).innerHTML = f.join("")
}, pageConfig.getHashProbability = function(a, b) {
    function c(a) {
        for (var b = 0, c = 0; c < a.length; c++) b = (b << 5) - b + a.charCodeAt(c), b &= b;
        return b
    }
    return Math.abs(c(a)) % b
};
var CookieUtil = {};
CookieUtil.setASCIICookie = function(a, b, c, d, e, f) {
    "string" == typeof a && "string" == typeof b && (b = escape(b), CookieUtil.setCookie(a, b, c, d, e, f))
}, CookieUtil.setUnicodeCookie = function(a, b, c, d, e, f) {
    "string" == typeof a && "string" == typeof b && (b = encodeURIComponent(b), CookieUtil.setCookie(a, b, c, d, e, f))
}, CookieUtil.setCookie = function(a, b, c, d, e, f) {
    if ("string" == typeof a && "string" == typeof b) {
        var g = a + "=" + b;
        c && (g += "; expires=" + c.toGMTString()), d && (g += "; path=" + d), e && (g += "; domain=" + e), f && (g += "; secure"), document.cookie = g
    }
}, CookieUtil.getUnicodeCookie = function(a) {
    if (getCookie(a), "string" == typeof a) {
        var b = getCookie(a);
        return null == b ? null : decodeURIComponent(b)
    }
    var c = document.cookie;
    return c
}, CookieUtil.getASCIICookie = function(a) {
    if (getCookie(a), "string" == typeof a) {
        var b = getCookie(a);
        return null == b ? null : unescape(b)
    }
    var c = document.cookie;
    return c
}, CookieUtil.getCookie = function(a) {
    var b = document.cookie;
    if ("string" == typeof a) {
        var c = "(?:; )?" + a + "=([^;]*);?",
            d = new RegExp(c);
        return d.test(b) ? RegExp.$1 : null
    }
    return b
}, CookieUtil.deleteCookie = function(a, b, c) {
    CookieUtil.setCookie(a, "", new Date(0), b, c)
};
var searchlog = function() {
    var a = "http://sstat." + pageConfig.FN_getDomain() + "/scslog?args=",
        b = "{keyword}^#psort#^#page#^#cid#^" + encodeURIComponent(document.referrer),
        c = "2",
        d = "",
        e = "",
        f = function() {
            var f = "",
                g = "",
                h = "",
                i = "0";
            if (arguments.length > 0)
                if (0 == arguments[0]) f = a + c + "^" + b + "^^^58^^" + e + "^" + d;
                else
            if (1 == arguments[0]) {
                f = 10 != c ? a + "1^" + b + "^" : a + "11^" + b + "^";
                for (var j = 1; j < arguments.length; j++) f += encodeURI(arguments[j]) + "^";
                arguments.length > 3 && "51" == arguments[3] && (g = arguments[1]), arguments.length > 3 && "55" == arguments[3] && (h = arguments[1]), arguments.length > 3 && "56" == arguments[3] && (i = arguments[1]);
                for (var j = 0, k = 5 - arguments.length; k > j; j++) f += "^";
                f += e + "^" + d
            }
            f = f.replace("#cid#", g), f = f.replace("#psort#", h), f = f.replace("#page#", i), $.getScript(f)
        };
    return f
}();
document.domain = pageConfig.FN_getDomain();