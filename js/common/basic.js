// dom ready实现
// 参考百度 tangram
// 另外参考：https://github.com/addyosmani/jquery.parts/blob/master/jquery.documentReady.js
(function() {
    var ready = function() {
        var readyBound = false, // 不知为何物
            readyList = [],
            DOMContentLoaded;

        if (document.addEventListener) {
            DOMContentLoaded = function() {
                document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false); //立即解绑
                ready();
            };

        } else if (document.attachEvent) {
            DOMContentLoaded = function() {
                if (document.readyState === 'complete') {
                    document.detachEvent('onreadystatechange', DOMContentLoaded);
                    ready();
                }
            };
        }
        /**
         * @private
         */

        function ready() {
            if (!ready.isReady) {
                ready.isReady = true;
                for (var i = 0, j = readyList.length; i < j; i++) {
                    readyList[i]();
                }
            }
        }
        /**
         * @private
         */

        function doScrollCheck() {
            try {
                document.documentElement.doScroll('left');
            } catch (e) {
                setTimeout(doScrollCheck, 1);
                return;
            }
            ready();
        }

        function bindReady() {
            if (readyBound) {
                return;
            }
            readyBound = true;

            if (document.readyState === 'complete') {
                ready.isReady = true;
            } else {
                if (document.addEventListener) {
                    document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);
                    window.addEventListener('load', ready, false);
                } else if (document.attachEvent) {
                    document.attachEvent('onreadystatechange', DOMContentLoaded); //只执行一次回调
                    window.attachEvent('onload', ready);

                    var toplevel = false;

                    try {
                        toplevel = window.frameElement === null;
                    } catch (e) {}

                    if (document.documentElement.doScroll && toplevel) {
                        doScrollCheck();
                    }
                }
            }
        }
        bindReady();

        return function(callback) {
            ready.isReady ? callback() : readyList.push(callback);
        };
    }();

    ready.isReady = false; //设置这个标志，和匿名函数内部的isReady无关啊
    window.ready = ready;
})();
/*
 * 工具函数
 */
var docElem = document.documentElement;
var Utils = {};
Utils.trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};
Utils.isWindow = function(obj) {
    return obj !== null && obj === obj.window;
};
Utils.getWindow = function(elem) {
    return this.isWindow(elem) ?
        elem :
        elem.nodeType === 9 ?
        elem.defaultView || elem.parentWindow :
        false;
};
// 一个节点是否包含另一个节点
// 取自jquery　1.8.2
// 参考自： http://blog.csdn.net/huajian2008/article/details/3960343
Utils.contains = docElem.contains ?
    function(a, b) {
        var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
        return a === bup || !! (bup && bup.nodeType === 1 && adown.contains && adown.contains(bup));
} :
    docElem.compareDocumentPosition ?
    function(a, b) {
        return b && !! (a.compareDocumentPosition(b) & 16);
} :
    function(a, b) {
        while ((b = b.parentNode)) {
            if (b === a) {
                return true;
            }
        }
        return false;
};
/*
 * 事件编写
 */
var E = {};
// 添加事件
E.addEvent = (function() {
    if (document.addEventListener) {
        return function(ele, evType, handler) {
            ele.addEventListener(evType, handler, false);
        };
    } else if (document.attachEvent) {
        return function(ele, evType, handler) {
            ele.attachEvent('on' + evType, function() {
                handler.call(ele, window.event);
            });
        };
    }
})();
// 移除事件
E.removeEvent = (function() {
    if (document.removeEventListener) {
        return function(ele, evType, handler) {
            ele.removeEventListener(evType, handler, false);
        };
    } else if (document.detachEvent) {
        return function(ele, evType, handler) {
            ele.detachEvent('on' + evType, handler);
        };
    }
})();
// 获取事件
E.getEvent = function(event) {
    return event || window.event;
};
// 获取事件对象
E.getTarget = function(event) {
    return E.getEvent(event).target || E.getEvent(event).srcElement;
};
// 获取相关事件对象
// IE8 将其保存在event.fromElement(mouseover)和event.toElement(out)属性中
E.getRelatedTarget = function(event) {
    var evt = E.getEvent(event);
    return evt.relatedTarget || evt.fromElement || evt.toElement || null;
};
// keyCode IE8 及opera support
E.getKeyCode = function(e) {
    e = E.getEvent(e);
    if (typeof e.charCode === 'number') {
        return e.charCode;
    } else {
        return e.keyCode;
    }
};
// 事件委托
// 事件类型，委托的父元素，事件目标字符串，回调
// 事件目标字符串只支持html tag，class，id
E.delegate = function(eventType, context, target, fn) {
    var self = this;
    // 若父元素不存在
    // 介个。。。。
    if (Utils.trim(context) === '') {
        context = document.body;
    }
    self.addEvent(context, eventType, function(e) {
        e = self.getEvent(e);
        var eTarget = self.getTarget(e);
        // console.log(target, eTarget);
        if (eTarget === target) {
            fn(e);
        }
    });
};
// 鼠标按键
// 返回值为数字，0代表左键，1代表滚轮，2代表右键
E.getButton = function(event) {
    if (document.implementation.hasFeature('MouseEvents', '2.0')) {
        return E.getEvent(event).button;
    } else {
        // 针对IE8及版本之前的规范差异
        // IE8 规范的还挺啰嗦的
        switch (E.getEvent(event).button) {
            case 0:
            case 1:
            case 3:
            case 5:
            case 7:
                return 0;
            case 2:
            case 6:
                return 2;
            case 4:
                return 1;
        }
    }
};
// 获取鼠标滚轮信息
// 忽略opera version<9.5
E.getWheelData = function(e) {
    var evt = E.getEvent(e);
    // webkit
    if (evt.wheelDelta) {
        return evt.wheelDelta;
    } else {
        // moz
        return evt.detail;
    }
};
// 阻止默认行为
E.preventDefault = function(event) {
    if (event.preventDefault) {
        return event.preventDefault();
    }
    if (window.event.returnValue) {
        return window.event.returnValue = false;
    }
};
// 取消事件冒泡
E.stopPropagation = function(event) {
    if (event.stopPropagation) {
        return event.stopPropagation();
    }
    if (window.event.cancelBubble) {
        return window.event.cancelBubble = true;
    }
};
/*
 *获取事件坐标
 *参考：http://www.cnblogs.com/yaozhiyi/archive/2013/01/12/2855583.html
 *http://www.css88.com/archives/1772
 */
E.offset = function(elem) {
    var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
        box = {
            top: 0,
            left: 0
        },
        doc = elem && elem.ownerDocument;

    if (!doc) {
        return;
    }
    // 与其他元素计算不同的是，body的offsetLeft,offsetTop计算并没有包括margin
    if ((body = doc.body) === elem) {
        var top = body.offsetTop,
            left = body.offsetLeft;

        if (body.offsetTop !== 1) {
            top += parseFloat(body.style.marginTop) || 0;
            left += parseFloat(body.style.marginLeft) || 0;
        }

        return {
            top: top,
            left: left
        };
    }

    docElem = doc.documentElement;

    // Make sure it's not a disconnected DOM node
    if (!Utils.contains(docElem, elem)) {
        return box;
    }

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof elem.getBoundingClientRect !== 'undefined') {
        box = elem.getBoundingClientRect();
    }
    win = Utils.getWindow(doc);
    clientTop = docElem.clientTop || body.clientTop || 0;
    clientLeft = docElem.clientLeft || body.clientLeft || 0;


    scrollTop = win.pageYOffset || docElem.scrollTop;
    scrollLeft = win.pageXOffset || docElem.scrollLeft;
    return {
        top: box.top + scrollTop - clientTop,
        left: box.left + scrollLeft - clientLeft
    };
};
// 浏览器窗口位置
// 即使页面滚动了，鼠标只要相对浏览器窗口位置不变，那么x，y就不变
E.clientX = function(event) {
    return E.getEvent(event).clientX;
};
E.clientY = function(event) {
    return E.getEvent(event).clientY;
};
// 需要兼容IE8
// 这个就是相对于页面的坐标了，如果不满一屏，则数值同clientX,clientY
// 若是超过一屏，还要加上计算滚动坐标
E.pageX = function(event) {
    event = E.getEvent(event);
    // lte IE8
    if (event.pageX === undefined) {
        //混杂及标准模式下
        return event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
    }
};
E.pageY = function(event) {
    event = E.getEvent(event);
    // lte IE8
    if (event.pageY === undefined) {
        //混杂及标准模式下
        return event.clientY + (document.body.scrollTop || document.documentElement.scrollTop);
    }
};
// 相对电脑屏幕
E.screenX = function(event) {
    return E.getEvent(event).screenX;
};
E.screenY = function(event) {
    return E.getEvent(event).screenY;
};
E.focusin = function(ele, handler) {
    if (document.addEventListener) {
        return ele.addEventListener('focus', handler, true);
    } else {
        return E.addEvent(ele, 'focusin', handler);
    }
};
E.focusout = function(ele, handler) {
    if (document.addEventListener) {
        return ele.addEventListener('blur', handler, true);
    } else {
        return E.addEvent(ele, 'focusout', handler);
    }
};
/*
 * DOM
 */
var D = {};

var makeArray = function(obj) {
    if (!obj || obj.length === 0) {
        return [];
    }
    // 非伪类对象，直接返回最好
    if (!obj.length) {
        return obj;
    }
    // 针对IE8以前 DOM的COM实现
    try {
        return [].slice.call(obj);
    } catch (e) {
        var i = 0,
            j = obj.length,
            res = [];
        for (; i < j; i++) {
            res.push(obj[i]);
        }
        return res;
    }

};
// 去重
var distinctArr = function(arr) {
    // html去重和数组去重不同，单层循环搞不定啊
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
};
var getContext = function(selectorString, context) {

    var sArr = selectorString.split('.'), //选择器拆分
        tagName;

    var contextArr = [], //context筛选结果
        make = []; //makeArra结果

    var m, i, j, reg;
    // 规避掉类似p#box.box1的脑残写法
    if (/#/.test(selectorString)) {

        selectorString = selectorString.match(/#[a-zA-z\d]+/)[0].substring(1);
        return document.getElementById(selectorString);

    } else if (/\./g.test(selectorString)) {

        // 获取 context数组
        if (context.length === 0) {
            return [];
        } else if (!context.length) {
            contextArr = makeArray(context.getElementsByClassName(sArr[1]));
        } else {

            for (i = 0, j = context.length; i < j; i++) {
                make = makeArray(context[i].getElementsByClassName(sArr[1]));
                contextArr = contextArr.concat(make);
            }
        }
        context = contextArr;

        if (selectorString.charAt(0) !== '.') {
            // 标签配合类别选择器

            tagName = sArr[0];

            // 第一层为对比的类名
            //获取符合第一个类名的环境

            // 循环该环境对象，获取每个对象的className属性，并做比较
            for (m = 0; m < context.length; m++) {
                for (i = 1, j = sArr.length; i < j; i++) {
                    reg = new RegExp('(^|\\s)' + sArr[i] + '(\\s|$)');
                    if (context[m].tagName.toLowerCase() !== tagName || !reg.test(context[m].className)) {
                        context.splice(m, 1);
                        m--;
                        break;
                    }
                }
            }
            return context;
        } else {
            // 纯类别选择器
            // 可能为一个
            // 可能为多个
            if (selectorString.split('.').length === 2) {
                // 一个类别的情形
                // 遍历context
                // 寻找
                return context;

            } else {
                // 多个类别
                for (m = 0; m < context.length; m++) {
                    for (i = 1, j = sArr.length; i < j; i++) {
                        reg = new RegExp('(^|\\s)' + sArr[i] + '(\\s|$)');
                        if (!reg.test(context[m].className)) {
                            context.splice(m, 1);
                            m--;
                            break;
                        }
                    }
                }
                return context;
            }
        }
    } else {
        // 标签选择器咯
        // 获取 context数组
        if (context.length === 0) {
            return [];
        } else if (!context.length) {
            contextArr = makeArray(context.getElementsByTagName(sArr[0]));
        } else {

            for (i = 0, j = context.length; i < j; i++) {
                make = makeArray(context[i].getElementsByTagName(sArr[0]));
                contextArr = contextArr.concat(make);
            }
        }
        context = contextArr;
        return context;
    }
};

// 目前只是支持 id class 标签选择器组合
// 其它不支持
D.$ = function(selectorString, context) {

    var selectorArr = selectorString.split(' '),
        selectorEnd = selectorArr[selectorArr.length - 1];

    context = context || document;

    var i = 0,
        j = selectorArr.length,
        result = context;

    if (/#/.test(selectorEnd)) {
        // id选择器
        // 避免#box.test情况的出现
        return document.getElementById(selectorEnd.match(/^#[a-zA-z0-9-_]+/)[0].substring(1));
    } else {
        if (document.querySelectorAll) {
            return document.querySelectorAll(selectorString);
        } else {

            // 复合选择器判断

            for (; i < j; i++) {

                result = getContext(selectorArr[i], makeArray(result));
            }
            return distinctArr(result);
        }


    }
};
// 添加类名
// 应当支持空格分隔的多个类别添加，比如D.addClass(div,'box1 box2')
// div class="box1 box2"
D.addClass = function(ele, className) {
    // 若该className已经存在，则不执行附加操作
    // 否则执行
    // class属性名遍历
    var cName = Utils.trim(className),
        cNameArr = cName.split(' '), //预添加类名数组
        classNameCacheStr = Utils.trim(ele.className),
        classArr = classNameCacheStr.split(' '), //已存在类名数组
        iL = classArr.length,
        i = 0,
        jL = cNameArr.length,
        j = 0,
        resClass;
    // 若类名不为空
    // 有相同的类名，则进行置空
    // 循环结束后，进行拼接
    if (classNameCacheStr !== '') {
        for (j = 0; j < jL; j++) {
            for (i = 0; i < iL; i++) {
                if (classArr[i] === cNameArr[j]) {
                    // cNameCopyArr.splice(j, 1);
                    cNameArr[j] = '';
                    break;
                }
            }
        }
    }
    resClass = Utils.trim(cNameArr.concat(classArr).join(' '));
    ele.setAttribute('class', resClass);
};
// 移除类名
// className为空，则全部移除
D.removeClass = function(ele, className) {
    // 若该className不存在，则不执行附加操作
    // class属性名遍历
    var cName = Utils.trim(className),
        cNameArr = cName.split(' '), //预添加类名数组
        classNameCacheStr = Utils.trim(ele.className),
        classArr = classNameCacheStr.split(' '), //已存在类名数组
        // classNameCopyArr = classNameCacheStr.split(' '),
        iL = classArr.length,
        i = 0,
        jL = cNameArr.length,
        j = 0;

    if (cName === '') {
        ele.setAttribute('class', ''); // 移除全部
    } else if (classNameCacheStr !== '') {
        // 若类名不为空
        for (j = 0; j < jL; j++) {
            for (i = 0; i < iL; i++) {
                if (classArr[i] === cNameArr[j]) {
                    // 若相同，则将数组对应的位置补空
                    classArr[i] = '';
                }
            }
        }
        ele.setAttribute('class', Utils.trim(classArr.join(' ')));
    }
};
// 获取某个下标的元素
// 需要传入下标，默认基于兄弟元素顺序
// 若传入标签名，则依照此来排序
D.eq = function(ele, index, baseEle) {
    // if (Utils.trim(baseEle) !== '') {

    // }
};
// 获取下标
// 默认是dom同级的下标，也可以提供约束条件context
D.getIndex = function(ele, context) {

};
/*
 * 创建dom
 */

var UI = {};
UI.show = function(ele) {
    ele.style.display = 'block';
};
UI.hide = function(ele) {
    ele.style.display = 'none';
};
