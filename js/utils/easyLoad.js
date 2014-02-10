/*
 * author:leweiming
 * github:xiaomingming
 * gmail:xmlovecss 艾特 gmail dot com
 *
 * example:
 */
(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'EasyLoad',
        pluginName = 'easyLoad';

    my[constructorFunName] = function(container, options) {
        var settings = $.extend({}, {
            attr: 'lazy-src',
            cName: 'lazy-img',
            distance: 0, //垂直或水平方向，滚动多少距离时，显示图片，默认为0，即到了图片位置时就加载
            container: window,
            event: 'scroll',
            isVertical: true
        }, options);

        this.container = $(settings.container);
        this.event = settings.event;
        this.isVertical = settings.isVertical;
        this.lazyAttrName = settings.attr;
        this.cName = settings.cName;
        this.dataName = 'easy-lazy';
        this.allImgArr = container.find('.' + this.cName);
        // 初始化
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        // 滚动初始化
        init: function() {
            var _this = this;
            this.eCallback();
            // 绑定事件
            this.bindEvent();
        },
        bindEvent: function() {
            var _this=this;
            this.container.on(this.event, function(e) {
                _this.eCallback();
            });
            $(window).on('resize', function() {
                _this.eCallback();
            });
            return this;
        },
        offEvent: function() {
            var _this=this;
            this.container.off(this.event, function(e) {
                _this.eCallback();
            });
            $(window).off('resize', function() {
                _this.eCallback();
            });
            return this;
        },
        // 触发滚动事件
        eCallback: function() {
            // 获取可视区域内的所有图片，进行显示
            var imgsArr = this.getVisionImgs(),
                i = 0,
                j = imgsArr.length,
                lazySrc;
            if (imgsArr.length===this.allImgArr.length) {
                this.offEvent();
                return;
            }
            for (; i < j; i++) {
                lazySrc = imgsArr[i].attr(this.lazyAttrName);
                if (lazySrc !== imgsArr[i].attr('src')) {
                    imgsArr[i].attr('src', lazySrc);
                    imgsArr[i].removeData(this.dataName);
                }
            }
            return this;
        },
        getVisionImgs: function() {
            var visonImgArr = [],
                container = this.container,
                allImgArr = this.allImgArr,
                isVertical = this.isVertical,
                winSize = isVertical ? container.height() : container.width(),
                scroll = isVertical ? container.scrollTop() : container.scrollLeft(),
                offsetKey = isVertical ? 'top' : 'left';
            // container可视高度+滚动条高度>当前元素的offset(top or left)
            var i = 0,
                offsetCache, ele, dataName = this.dataName;

            for (; i < allImgArr.length; i++) {
                ele = $(allImgArr[i]);
                if (ele.attr('src') === ele.attr(this.lazyAttrName)) {
                    continue;
                }
                offsetCache = ele.data(dataName);
                // 缓存
                if (offsetCache === undefined) {
                    offsetCache = ele.offset()[offsetKey];
                    ele.data(dataName, offsetCache);
                }

                if (winSize + scroll > offsetCache) {
                    visonImgArr.push($(allImgArr[i]));
                }
            }

            return visonImgArr;
        }
    };
    $.fn[pluginName] = function(opts) {
        // 可初始化并自定义属性及函数
        if (typeof opts === 'string') {
            if (opts === 'api') {
                return $(this).data('plugin-' + pluginName);
            } else {
                throw new Error('error string ,here supports "api" only!');
            }
        }
        return this.each(function() {
            var that = $(this),
                s1 = new my[constructorFunName](that, opts);

            if (!that.data('plugin-' + pluginName)) {
                return that.data('plugin-' + pluginName, s1);
            }

        });

    };
})(window, jQuery);