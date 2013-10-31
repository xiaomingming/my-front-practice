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
E.getRelatedTarget=function(event){
    var evt=E.getEvent(event);
    return evt.relatedTarget||evt.fromElement||evt.toElement||null;
};
// 鼠标按键
// 返回值为数字，0代表左键，1代表滚轮，2代表右键
E.getButton=function(event){
    if(document.implementation.hasFeature('MouseEvents','2.0')){
        return E.getEvent(event).button;
    }else{
        // 针对IE8及版本之前的规范差异
        // IE8 规范的还挺啰嗦的
        switch(E.getEvent(event).button){
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
// 浏览器窗口位置
E.clientX = function(event) {
    return E.getEvent(event).clientX;
};
E.clientY = function(event) {
    return E.getEvent(event).clientY;
};
// 需要兼容IE8
E.pageX = function(event) {
    var event = E.getEvent(event);
    if (event.pageX === undefined) {
        return event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
    }
};
E.pageY = function(event) {
    var event = E.getEvent(event);
    if (event.pageY === undefined) {
        return event.clientY + (document.body.scrollLeft || document.documentElement.scrollLeft);
    }
};
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
// id选择器
D.$ = function(id) {
    return document.getElementById(id.toString());
};
// 类别选择器，这里只支持class和html tag
// 比如：D.$$('.test'),D.$$('p.test'),D.$$('p'),D.$$('p',document.body)
// 注意，传入context限制条件时，必须传入一个唯一的dom选择器
D.$$ = function(selectorStr, context) {
    if (document.querySelectorAll) {
        // console.log('here ,break');
        return document.querySelectorAll(selectorStr);
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
