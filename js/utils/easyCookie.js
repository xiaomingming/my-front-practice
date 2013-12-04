/*
 * author:leweiming
 * gmail:xmlovecss
 * 参考：https://github.com/ScottHamper/Cookies
 * 本来，设置max-age比设置expires要可靠的多
 * 但是，暂时不这么支持
 */
(function(window, undefined) {
    var dk = document.cookie;
    var ckUtils = {};
    // 基本配置
    // 对外可更改
    ckUtils.defaults = {
        expires: '0',
        domain: '',
        path: '/',
        secure: false
    };
    // 获取cookie
    // 通过字符串的indexOf匹配name来获取初始的名称位置
    // 再根据继indexOf匹配‘；’获得结束位置
    ckUtils.get = function(key) {
        var dkRes = dk.indexOf(key),
            startIndex, endIndex, value = '';
        if (dkRes !== -1) {
            startIndex = dkRes + key.length + 1;
            endIndex = dk.indexOf(';', startIndex), value;

            if (endIndex == -1) {
                value = dk.substring(startIndex, dk.length);
            } else {
                value = dk.substring(startIndex, endIndex);
            }
            return value = decodeURIComponent(value);
        }
        return false

    };
    // 获取设置
    ckUtils.extendOpt = function(opts) {
        var d = this.defaults;
        // console.log(opts);
        opts=opts||{};
        return {
            expires: opts.expires || d.expires,
            path: opts.path || d.path,
            domain: opts.domain || d.domain,
            secure: opts.secure ? 'secure' : (d.secure ? 'secure' : '')
        }
    };
    // 获取设置
    ckUtils.getCookieConfig = function(key, value, opts) {
        opts = this.extendOpt(opts);
        key = encodeURIComponent(key);
        value = value + ''.replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);

        var str = '; ';

        str = key + '=' + value;
        str += opts.expires ? '; expires=' + opts.expires : '0';
        str += opts.path ? '; path=' + opts.path : '';
        str += opts.domain ? '; domain=' + opts.domain : '';
        str += opts.secure ? '; secure' : ';';
        return str;
    };
    // 设置cookie
    ckUtils.set = function(key, value, opts) {
        // opts.cookiename, opts.path,opt.nax-page,opts.domain,opts.expires,opts.secure
        // 保留特有名称
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
            return false;
        }
        document.cookie = this.getCookieConfig(key, value, opts);
        return this;
    };
    // 判断cookie是否存在
    ckUtils.hasCookie = function(key) {
        if (!dk.length) {
            return;
        }
        var dkRes = dk.indexOf(key);
        if (dkRes === -1) {
            return false;
        }
        return true;
    };
    // 删除cookie
    ckUtils.del = function(key) {
        if (!key || !this.hasCookie(key)) {
            return false;
        } else {
            this.set(key, undefined, {
                expires: 'Thu, 01 Jan 1970 00:00:00 GMT'
            });
        }
    };
    // 暴露接口
    window.easyCookie = ckUtils;
})(window);