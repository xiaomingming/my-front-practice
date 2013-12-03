/*!
 * Cookies.js - 0.3.1
 * Wednesday, April 24 2013 @ 2:28 AM EST
 *
 * Copyright (c) 2013, Scott Hamper
 * Licensed under the MIT license,
 * http://www.opensource.org/licenses/MIT
 */
(function (undefined) {
    'use strict';

    var Cookies = function (key, value, options) {
        return arguments.length === 1 ?
            Cookies.get(key) : Cookies.set(key, value, options);
    };

    // Allows for setter injection in unit tests
    Cookies._document = document;
    Cookies._navigator = navigator;

    Cookies.defaults = {
        path: '/'
    };
    // 获取cookie
    Cookies.get = function (key) {
        // 若缓存cookie对象不存在
        if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
            // 则进行cookie缓存，并格式化cookie，赋值给Cookies的_cache 属性
            Cookies._renewCache();
        }

        return Cookies._cache[key];
    };
    // 设置cookie
    Cookies.set = function (key, value, options) {
        options = Cookies._getExtendedOptions(options);
        options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);
        // 调用生成函数
        Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

        return Cookies;
    };
    // 这个函数没有被调用到
    // 看来是对外的接口
    // 设置某个cookie 的过期
    Cookies.expire = function (key, options) {
        return Cookies.set(key, undefined, options);
    };
    // 配置extend
    Cookies._getExtendedOptions = function (options) {
        return {
            path: options && options.path || Cookies.defaults.path,
            domain: options && options.domain || Cookies.defaults.domain,
            expires: options && options.expires || Cookies.defaults.expires,
            secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
        };
    };
    // 判断是否为日期对象
    // 还要判断getTime是否为数字
    // 。。。
    Cookies._isValidDate = function (date) {
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    };
    // 获取失效日期
    Cookies._getExpiresDate = function (expires, now) {
        now = now || new Date();
        switch (typeof expires) {
            case 'number': expires = new Date(now.getTime() + expires * 1000); break;
            case 'string': expires = new Date(expires); break;
        }

        if (expires && !Cookies._isValidDate(expires)) {
            throw new Error('`expires` parameter cannot be converted to a valid Date instance');
        }

        return expires;
    };
    // 生成cookie串
    Cookies._generateCookieString = function (key, value, options) {
        key = encodeURIComponent(key);
        value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
        options = options || {};

        var cookieString = key + '=' + value;
        cookieString += options.path ? ';path=' + options.path : '';
        cookieString += options.domain ? ';domain=' + options.domain : '';
        cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
        cookieString += options.secure ? ';secure' : '';

        return cookieString;
    };
    // 格式化document.cookie
    // 格式化为键值对对象
    // { cookieName:'cookievalue'}
    Cookies._getCookieObjectFromString = function (documentCookie) {
        var cookieObject = {};
        var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

        for (var i = 0; i < cookiesArray.length; i++) {
            var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

            if (cookieObject[cookieKvp.key] === undefined) {
                cookieObject[cookieKvp.key] = cookieKvp.value;
            }
        }

        return cookieObject;
    };
    // 得到单个cookie对象
    // 包括name ，value
    Cookies._getKeyValuePairFromCookieString = function (cookieString) {
        // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
        var separatorIndex = cookieString.indexOf('=');

        // IE omits the "=" when the cookie value is an empty string
        separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

        return {
            key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
            value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
        };
    };
    // 将格式化的cookie对象赋值给Cookies的_cache属性
    // 将原汁原味的cookie对象赋值给Cookies的_cachedDocumentCookie属性
    Cookies._renewCache = function () {
        Cookies._cache = Cookies._getCookieObjectFromString(Cookies._document.cookie);
        Cookies._cachedDocumentCookie = Cookies._document.cookie;
    };

    // 判断cookie是否被禁用
    Cookies._areEnabled = function () {
        return Cookies._navigator.cookieEnabled ||
            Cookies.set('cookies.js', 1).get('cookies.js') === '1';
    };

    Cookies.enabled = Cookies._areEnabled();

    // 模块化支持
    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return Cookies; });
    // CommonJS and Node.js module support.
    } else if (typeof exports !== 'undefined') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Cookies;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = Cookies;
    } else {
        window.Cookies = Cookies;
    }
})();