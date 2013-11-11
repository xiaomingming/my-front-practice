// 目前缺少：
// offset位置计算
/*
 * 工具函数
 */
var document = window.document,
    docElem = document.documentElement;
var Utils = {};
Utils.trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};
Utils.isWindow = function(obj) {
    return obj != null && obj == obj.window;
};
Utils.getWindow=function(elem){
    return this.isWindow( elem ) ?
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
        }
    } else if (document.attachEvent) {
        return function(ele, evType, handler) {
            ele.attachEvent('on' + evType, function() {
                handler.call(ele, window.event);
            });
        }
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
    var e = E.getEvent(e);
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
        var e = self.getEvent(e),
            eTarget = self.getTarget(e);
        console.log(target, eTarget);
        if (eTarget === target) {
            fn(e);
        };
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
    if (typeof elem.getBoundingClientRect !== "undefined") {
        box = elem.getBoundingClientRect();
    }
    win = Utils.getWindow(doc);
    clientTop = docElem.clientTop || body.clientTop || 0;
    clientLeft = docElem.clientLeft || body.clientLeft || 0;
    scrollTop = win.pageYOffset || docElem.scrollTop;
    scrollLeft = win.pageXOffset || docElem.scrollLeft;
    console.log(box.top + scrollTop - clientTop);
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
    var event = E.getEvent(event);
    if (event.pageX === undefined) {
        return event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
    }
};
E.pageY = function(event) {
    var event = E.getEvent(event);
    if (event.pageY === undefined) {
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
// id选择器,类别选择器，标签选择器
// 仅仅D.$('#test')支持，但不支持$('div#test')，$('#div>p')
// 类别选择器，这里只支持class和html tag
// 比如：D.$$('.test'),D.$$('p.test'),D.$$('p'),D.$$('p',document.body)
// 注意，传入context限制条件时，必须传入一个唯一的dom选择器
D.$ = function(selectorString, context) {
    var selectorTag = selectorString[0],
        selectorStr = selectorString.slice(1);
    // 
    if (selectorTag === '#') {
        // id选择器
        return document.getElementById(selectorStr);
    } else {
        // 类别选择器，这里只支持class和html tag
        // 比如：D.$$('.test'),D.$$('p.test'),D.$$('p'),D.$$('p',document.body)
        // 注意，传入context限制条件时，必须传入一个唯一的dom选择器
        if (document.querySelectorAll) {
            return document.querySelectorAll(selectorString);
        } else {
            // console.log('here2 ,break');
            var eleInfo = selectorStr.split('.'),
                context = context || document,
                ele = null;
            // 循环遍历标签，判断dom节点类名是否匹配className
            var tagArr = [],
                tagReg;
            // 若只有html tag , p
            if (eleInfo.length === 1) {
                return context.getElementsByTagName(selectorStr);
            }
            // 若只有类名参数 .test
            if (eleInfo[0] === '') {
                // 高级浏览器
                if (context.getElementsByClassName) {
                    return context.getElementsByClassName(eleInfo[1]);
                } else {
                    ele = context.getElementsByTagName('*');
                }
            }
            ele = ele || context.getElementsByTagName(eleInfo[0]);
            // alert('tag and class');
            // 若为两者组合 p.test
            tagReg = new RegExp('(^|\\s)' + eleInfo[1] + '(\\s|$)', 'g');
            for (var i = 0, j = ele.length; i < j; i++) {
                if (tagReg.test(ele[i].className)) {
                    tagArr.push(ele[i]);
                }
            }
            return tagArr;
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
    ele.setAttribute('class', res);
};
// 移除类名
// className为空，则全部移除
// 此处有bug
D.removeClass = function(ele, className) {
    // 若该className不存在，则不执行附加操作
    // class属性名遍历
    var cName = Utils.trim(className),
        cNameArr = cName.split(' '), //预添加类名数组
        classNameCacheStr = Utils.trim(ele.className),
        classArr = classNameCacheStr.split(' '), //已存在类名数组
        classNameCopyArr = classNameCacheStr.split(' '),
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
    if (Utils.trim(baseEle) !== '') {

    }
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