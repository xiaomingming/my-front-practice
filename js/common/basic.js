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

    ready.isReady = false;
    window.ready = ready;
})();
var docElem = document.documentElement;
/*
 * DOM编写
 */
var D = {};
/*
 * 事件编写
 */
var E = {};
/*
 * 工具函数
 */
var Utils = {};
Utils.error = function(msg) {
    throw new Error(msg);
};
// 扩展函数
// 对象拷贝
// 不支持深拷贝
Utils.extend = function(defaults) {
    var result = {}, key, key1, source, i = 0,
        j = arguments.length;
    for (key in defaults) {
        if (defaults.hasOwnProperty(key)) {
            result[key] = defaults[key];
        }
    }
    for (; i < j; i++) {
        source = arguments[i];
        for (key1 in source) {
            if (source.hasOwnProperty(key1)) {
                result[key1] = source[key1];
            }
        }
    }

    return result;
};

Utils.trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};
// 伪数组转化成数组
Utils.makeArray = function(obj) {
    // 对于函数或者对象，应当返回[]
    if (!obj || obj.length === 0 || this.isType(obj, 'object') || this.isType(obj, 'function')) {
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
Utils.distinctArr = function(arr) {
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
// 判断是否为一个DOM集合
Utils.isDomArr = function(ele) {
    return !ele.length ? false : true;
};
// 是否为你期待的数据类型
// IE对于function判断的bug，暂时不做修复
// 参考详见：http://www.planabc.net/2010/01/23/repair_the_bug_of_isfunction_method_in_jquery/
Utils.isType = function(data, type) {
    return (type === 'null' && type === null) || (type === 'undefined' && type === undefined) || Object.prototype.toString.call(data).slice(8, -1).toLowerCase() === type;
};
// 遍历数组和对象
Utils.each = function(obj, callback) {
    if (this.isType(obj, 'object')) {
        // 对象
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                callback.call(null, key, obj[key]);
            }
        }
    } else if (this.isType(obj, 'array') || this.isType(obj, 'nodeList')) {
        // 数组
        // 你想不到的是，nodelist类型
        for (var i = 0, j = obj.length; i < j; i++) {
            callback.call(null, i, obj[i]);
        }
    }
};
// 函数柯里化
Utils.curry = function(fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        args = args.concat([].slice.call(arguments));
        return fn.call(null, args);
    };
};
// 执行一次回调函数
// 但是，并不销毁该函数
Utils.once = function(fn) {
    var flag = false,
        args = [].slice.call(arguments, 1);

    return function() {
        if (!flag) {
            args = args.concat([].slice.call(arguments));
            flag = true;
            return fn.apply(null, args);
            // /fn = null;
        }
        return undefined;
    };
};
// 以下三个函数不可以为工具函数
// 有待整理
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

// 添加事件
E.addEvent = (function() {
    if (document.addEventListener) {
        return function(ele, evType, handler) {
            if (Utils.isDomArr(ele)) {
                Utils.each(ele, function(i, v) {
                    v.addEventListener(evType, function(e) {
                        handler(e);
                    }, false);
                });
            } else {
                ele.addEventListener(evType, function(e) {
                    handler(e);
                }, false);
            }
        };
    } else if (document.attachEvent) {
        return function(ele, evType, handler) {
            if (Utils.isDomArr(ele)) {
                Utils.each(ele, function(i, v) {
                    v.attachEvent('on' + evType, function() {
                        handler.call(v, window.event);
                    });
                });
            } else {
                ele.attachEvent('on' + evType, function() {
                    handler.call(ele, window.event);
                });
            }
        };
    }
})();

// 移除事件
E.removeEvent = (function() {
    if (document.removeEventListener) {
        return function(ele, evType, handler) {
            if (Utils.isDomArr(ele)) {
                Utils.each(ele, function(i, v) {
                    v.removeEventListener(evType, handler, false);
                });
            } else {
                ele.removeEventListener(evType, handler, false);
            }

        };
    } else if (document.detachEvent) {
        return function(ele, evType, handler) {
            if (Utils.isDomArr(ele)) {
                Utils.each(ele, function(i, v) {
                    v.detachEvent('on' + evType, handler);
                });
            } else {
                ele.detachEvent('on' + evType, handler);
            }
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
E.delegate = function(eType, context, target, fn) {
    var self = this,
        tag = '',
        className = '',
        sArr = target.split('.');

    // 此处针对target做一个处理
    // 只允许传入标签和类
    // li.item .item1.item2 li div

    context = D.$(context);

    self.addEvent(context, eType, function(e) {
        e = self.getEvent(e);
        var eTarget = self.getTarget(e);

        var eTag = eTarget.tagName.toLowerCase(),
            eCName = eTarget.className;

        var i = 0,
            j = 0,
            reg;
        if (/\./.test(target)) {
            className = sArr.slice(1);

            for (i = 0, j = className.length; i < j; i++) {
                reg = new RegExp('(^|\\s)' + className[i] + '(\\s|$)');
                if (!reg.test(eCName)) {
                    return false;
                }

            }
            if (target.charAt(0) !== '.') {
                // 标签混合
                tag = sArr[0];
                if (eTag === tag) {
                    fn(e);
                }
            } else {
                fn(e);
            }
        } else {
            if (eTag === target) {
                fn(e);
            }
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
// 兼容性的getClassName方法
// context只能是一个具体的环境对象
// 不需要htmlCollection
D.getClassName = function(cName, context) {
    context = context || document;
    if (document.getElementsByClassName) {
        return context.getElementsByClassName(cName);
    } else {
        // IE8以下的非主流
        var domArr = context.getElementsByTagName('*'),
            i = 0,
            j = domArr.length,
            reg = new RegExp('(^|\\s)' + cName + '(\\s|$)'),
            resultArr = [];

        for (; i < j; i++) {
            if (reg.test(domArr[i].className)) {
                resultArr.push(domArr[i]);
            }
        }
        return resultArr;
    }
};

D.getTagName = function(tagName, context) {
    return context.getElementsByTagName(tagName);
};
// 获取当前DOM上下文环境
// 传入一个选择器，一个父类选择环境
D.getContext = function(selectorString, context) {

    var _this = this;
    var sArr = selectorString.split('.'), //选择器拆分
        tagName;
    var contextArr = [], //context筛选结果
        make = []; //makeArra结果

    var m, i, j, reg;

    var regObj = {
        'id': function(s) {
            return (/#/.test(s));
        },
        'className': function(s) {
            return (/\./.test(s));
        },
        'tagName': function(s) {
            return (/[^\.#]/.test(s));
        }
    };

    // 初始化dom方法
    var getDom = function(context) {
        if (regObj.className(selectorString)) {
            return _this.getClassName(sArr[1], context);
        } else if (regObj.tagName(selectorString)) {
            return _this.getTagName(sArr[0], context);
        }
    };


    // 获取 context数组
    if (context.length === 0) {
        return [];
    } else if (!context.length) {
        contextArr = Utils.makeArray(getDom(context));
    } else {
        for (i = 0, j = context.length; i < j; i++) {
            make = Utils.makeArray(getDom(context[i]));
            contextArr = contextArr.concat(make);
        }
    }
    context = contextArr;

    // 规避掉类似p#box.box1的脑残写法
    if (regObj.id(selectorString)) {

        selectorString = selectorString.match(/#[a-zA-z\d]+/)[0].substring(1);
        return document.getElementById(selectorString);

    } else if (regObj.className(selectorString)) {

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
                            // m--;
                            break;
                        }
                    }
                }
                return context;
            }
        }
    }
    return context; //纯标签情形
};
// 只支持简单的选择器组合
// 包括id，类别，标签组合
// 比如：$('.box.box2 p span'),$('#myMod .box span'),$('div span')
D.$ = function(selectorString, context) {
    var _this = this;

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
            return Utils.makeArray(document.querySelectorAll(selectorString));
        } else {
            // 复合选择器判断
            // for <IE8
            for (; i < j; i++) {

                result = _this.getContext(selectorArr[i], Utils.makeArray(result));
            }
            return Utils.distinctArr(result);
        }
    }
};
// set get attribute
D.attr = function(ele, atr, val) {
    if (arguments.length === 2) {
        return ele.getAttribute(atr);
    } else if (arguments.length === 3) {
        ele.setAttribute(atr, val);
    }
};
// 
D.addClass = function(ele, className) {
    // 若为单独的DOM对象
    // 直接给该对象添加 className
    // 否则，遍历添加
    var reg = new RegExp('(^|\\s)' + className + '(\\s|$)'),
        i = 0,
        j;
    var addOne = function(oneEle) {
        var originClass = oneEle.className;
        if (!reg.test(ele.className)) {
            oneEle.className = originClass + (originClass === '' ? '' : ' ') + className;
        }
    };
    if (!ele.length) {
        addOne(ele);
    } else {
        for (j = ele.length; i < j; i++) {
            addOne(ele[i]);
        }
    }
};
// 不设置第二个参数时，默认移除所有类名
D.removeClass = function(ele, className) {
    // 若为单独的DOM对象
    // 直接给该对象删除 className
    // 否则，遍历删除
    var reg = new RegExp('(^|\\s)' + className + '(\\s|$)'),
        i = 0,
        j,
        argsLen = arguments.length;
    var delOne = function(oneEle) {
        var originClass = oneEle.className;
        oneEle.className = (argsLen === 1) ? '' : originClass.replace(reg, function() {
            return '';
        });
    };
    if (!ele.length) {
        delOne(ele);
    } else {

        for (j = ele.length; i < j; i++) {
            delOne(ele[i]);
        }

    }
};
D.toggleClass = function(ele, className) {
    var i = 0,
        j;
    var toggleOne = function(oneEle) {
        D.hasClass(oneEle, className) ? D.removeClass(oneEle, className) : D.addClass(oneEle, className);
    };
    if (!ele.length) {
        toggleOne(ele);
    } else {
        for (j = ele.length; i < j; i++) {
            toggleOne(ele[i]);
        }
    }
};
D.getFirstChild = function(parentNode) {
    var firstChild = parentNode.firstChild;
    while (firstChild !== null && firstChild.nodeType !== 1) {
        firstChild = firstChild.nextSibling;
    }
    return firstChild;
};
// 获取最后一个子元素
D.getLastChild = function(parentNode) {
    var lastChild = parentNode.lastChild;
    while (lastChild !== null && lastChild.nodeType !== 1) {
        lastChild = lastChild.previousSibling;
    }
    return lastChild;
};
// 获取子节点标签
// 其实，ele.childreen就可以了
D.getChilds = function(parentNode) {
    var childNodes = parentNode.childNodes,
        childArr = [];
    for (var i = 0, j = childNodes.length; i < j; i++) {
        if (childNodes[i].nodeType === 1) {
            childArr.push(childNodes[i]);
        }
    }
    return childArr;
};

// 获取下一个兄弟节点
D.getNext = function(node) {
    var next = node.nextSibling;
    while (next !== null && next.nodeType !== 1) {
        next = next.nextSibling;
    }
    return next;
};

// 获取所有兄弟节点
D.getNextAll = function(node) {
    var next = this.getNext(node),
        nextArr = [];
    nextArr.push(next);
    while (this.getNext(next) !== null) {
        next = this.getNext(next);
        nextArr.push(next);
    }
    return nextArr;
};

// 获取前一个兄弟节点
D.getPrev = function(node) {
    var prev = node.previousSibling;
    while (prev !== null && prev.nodeType !== 1) {
        prev = prev.previousSibling;
    }
    return prev;
};

// 获取所有兄弟节点
D.getPrevAll = function(node) {
    var prev = this.getPrev(node),
        prevArr = [];
    prevArr.push(prev);
    while (this.getPrev(prev) !== null) {
        prev = this.getPrev(prev);
        prevArr.push(prev);
    }
    return prevArr;
};
// 创建一个插入某个元素之后
// 判断当前元素后面是否存在元素
// 若不存在，使用appendChild方法
// 否则，对其后的元素调用insertBefore方法模拟
D.insertAfter = function(parentNode, newNode, currentNode) {
    // currentNode不存在时
    if (arguments.length === 2) {
        return parentNode.appendChild(newNode);
    }
    var next = this.getNext(currentNode);

    if (next !== null) {
        return parentNode.insertBefore(newNode, next);
    }
    // 下一个元素不存在时
    return parentNode.appendChild(newNode);
};

// 获取某个下标的元素
// 传入选择器，或者DOM对象
// 第二个为下标
D.eq = function(ele, index) {
    if (typeof ele === 'string') {
        ele = this.$(ele);
    }
    return ele[index];
};
// 获取元素的下标
// 第二个参数为可选参数
// 忽略第二个参数时，下标为该元素的在兄弟元素中的位置
// 否则，为第二个参数提供的参考列表中的位置
D.getIndex = function(ele, context) {
    var ct = context || [],
        i = 0,
        j = ct.length;
    if (typeof ele === 'string') {
        ele = this.$(ele);
    }
    // 
    if (arguments.length === 1) {
        return this.getPrevAll(ele).length;
    }
    for (; i < j; i++) {
        if (ele === ct[i]) {
            break;
        }
    }
    return i;
};
// 某个DOM对象是否有指定className
// 类名只能指定一个，或者多个，但是，多个必须使用'|'分隔
// class1|class2|class3
D.hasClass = function(ele, cName) {
    // 单独的类别
    if (!/\|/.test(cName)) {
        return new RegExp('(^|\\s)' + cName + '(\\s|$)').test(ele.className);
    }
    // 多个类别
    var classArr = cName.split('|'),
        targetClass = ele.className;

    for (var i = 0, j = classArr.length; i < j; i++) {
        var reg = new RegExp('(^|\\s)' + classArr[i] + '(\\s|$)');
        if (!reg.test(targetClass)) {
            return false;
        }
    }
    return true;
};
// 文本操作
// 不支持DOM数组
// 只支持单个DOM对象的html插入
D.html = function(ele, str) {
    if (arguments.length === 1) {
        return ele.innerHTML;
    }
    ele.innerHTML = str;
};
// 文本获取和设置
D.text = function(ele, str) {
    if (arguments.length === 1) {
        return ele.innerText;
    }
    var txt = document.createTextNode(str);
    this.html(ele, '');
    ele.appendChild(txt);
};
// style获取，设置
// 盒模型宽高此方法无法获取
D.css = function(ele, sty) {
    var prop;
    var setOneStyle = function(ele) {
        for (var key in sty) {
            if (sty.hasOwnProperty(key)) {
                prop = key.replace(/(-[a-z])/gi, function(m, group, i, t) {
                    return group.charAt(1).toUpperCase();
                });
                ele.style[prop] = sty[key];
            }
        }
    };
    // get style 只可以针对单个DOM对象
    var getStyle = function(ele) {
        if (Utils.isType(sty, 'string')) {

            prop = sty.replace(/(-[a-z])/gi, function(m, group, i, t) {
                return group.charAt(1).toUpperCase();
            });
            return ele.style[prop];
        }
        return '';
    };

    if (Utils.isType(sty, 'object')) {
        if (Utils.isDomArr(ele)) {
            for (var i = 0, j = ele.length; i < j; i++) {
                setOneStyle(ele[i]);
            }
        } else {
            setOneStyle(ele);
        }

    } else {
        if (Utils.isDomArr(ele)) {
            ele = ele[0];
        }
        return getStyle(ele);
    }
};
// 控制样式显示与隐藏
D.show = function(ele) {
    var i = 0,
        j,
        showOne = function(ele) {
            ele.style.display = 'block';
        };
    if (Utils.isDomArr(ele)) {
        for (j = ele.length; i < j; i++) {
            showOne(ele[i]);
        }
    } else {
        showOne(ele);
    }

};
D.hide = function(ele) {
    var i = 0,
        j,
        hideOne = function(ele) {
            ele.style.display = 'none';
        };
    if (Utils.isDomArr(ele)) {
        for (j = ele.length; i < j; i++) {
            hideOne(ele[i]);
        }
    } else {
        hideOne(ele);
    }

};
//
D.data = function(ele, obj) {
    if (Utils.isType(ele, 'array')) {
        // 此时是一个DOM对象

    }
};
// worklist 
// data缓存和移除，promise简单实现，animate实现，ajax实现
