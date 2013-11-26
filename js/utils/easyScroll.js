(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'scroll',
        pluginName = 'wordScroll';

    my[constructorFunName] = function(container, options) {
        this.container = container;
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        this.timer = null;
        // 获取宽高
        this.width = this.container.width();
        this.height = this.container.height();
        // 获取设置的层叠值
        // this.zIndex=settings.zIndex();
        // 获取设置的初始滚动下标
        this.startIndex = settings.startIndex;
        // 
        this.itemsLen = this.container.find('li').length;
        // 全局timer，动画状态判断
        this.timer = null;
        this.isAnimating = false;
        // 获取延迟
        this.duration = settings.duration;
        // 获取动画delay
        this.delay = settings.delay;
        // 是否创建播放数字
        this.isPlayNumber = settings.isPlayNumber;
        // 是否创建前进后退按钮
        this.isDirbtn = settings.isDirbtn;
        // 是否悬浮停止播放
        this.isHoverPause = settings.isHoverPause;

        // 初始化
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        // 滚动初始化
        init: function() {
            var self = this;
            this.container.find('li').eq(this.startIndex).addClass('prev');
            this.isPlayNumber && this.renderPlayNumber();
            this.isDirbtn && this.renderDirectionBtn();
            // 自动播放
            this.autoScroll();
            // 悬浮停止配置
            this.isHoverPause && this.container.on('mouseover', function() {
                self.stopSrcoll();
            }).on('mouseout', function() {
                self.autoScroll();
            });
        },
        // create switch wrapper
        createSwitchWrapper: function() {
            if (!this.isSwitchWrapperCreated) {
                this.isSwitchWrapperCreated = true;
                return '<div class="switch-wrapper"></div>';
            } else {
                return false;
            }
        },
        // create playNumber
        createPlayNumber: function() {
            var i = 0,
                j = this.itemsLen,
                tmp = '<div class="switch-number">';
            for (; i < j; i++) {
                if (i === this.startIndex) {
                    tmp += '<a href="#" class="current">' + (i + 1) + '</a>';
                } else {
                    tmp += '<a href="#">' + (i + 1) + '</a>';
                }
            }
            tmp += '</div>';
            return tmp;
        },
        // 渲染
        renderPlayNumber: function() {
            var switchWrapper = this.createSwitchWrapper(),
                self = this;
            // this.playNumber = self.createPlayNumber();
            if (switchWrapper) {
                this.container.wrap(switchWrapper);
            }
            this.container.parent().append(self.createPlayNumber());
            this.playNumberEvent();

        },
        // 绑定数字播放事件
        playNumberEvent: function() {
            var self = this;
            
            this.container.parent().find('.switch-number').on('click', 'a', function(e) {
                e.preventDefault();
                self.gotoIndex($(this).index(), self.startIndex);
            });
        },
        // play number
        playNumber: function(index) {
            var self = this;
            this.container.parent().find('.switch-number').find('a').eq(index).addClass('current').siblings().removeClass('current');
        },
        gotoIndex: function(index, prevIndex) {
            // 停止轮播
            var self = this;
            this.stopSrcoll();

            // self.startIndex = index;
            // 
            this.scroll(index, prevIndex);
            this.autoScroll();
        },

        // create next,prev button
        createDirectionBtn: function() {
            return '<a href="#" class="switch-prev">上一张</a><a href="#" class="switch-next">下一张</a>';
        },
        // render next,prev button
        renderDirectionBtn: function() {
            var switchWrapper = this.createSwitchWrapper(),
                self = this;

            if (switchWrapper) {
                this.container.wrap(switchWrapper);
            }
            this.container.parent().append(self.createDirectionBtn());
            this.prevBtnEvent();
            this.nextBtnEvent();
        },
        // 上一张按钮事件
        prevBtnEvent: function() {
            var self = this,
                clickIndex;

            this.container.parent().find('.switch-prev').on('click', function(e) {
                e.preventDefault();
                clickIndex = self.getPrev(self.startIndex);
                self.gotoIndex(clickIndex, self.startIndex);
            });
        },
        // 下一张按钮事件
        nextBtnEvent: function() {
            var self = this,
                clickIndex;
            this.container.parent().find('.switch-next').on('click', function(e) {
                e.preventDefault();
                clickIndex = self.getNext(self.startIndex);
                self.gotoIndex(clickIndex, self.startIndex);
            });
        },
        // get direction
        // 传入跳转后的下标，跳转之前的下标
        getDirection: function(gotoIndex, prevIndex) {
            // console.log(gotoIndex-prevIndex);
            var res = gotoIndex - prevIndex;
            if (res >= 1) {
                // 正向跳转
                return 1;
            } else if (res < 0) {
                // alert('-1');
                // 负向跳转
                return -1;
            } else {
                // 根本就没有跳转么
                return 0;
            }
        },
        // get Next
        getPrev: function(index) {
            return (index === 0) ? (this.itemsLen - 1) : (index - 1);
        },
        // 自动轮播下标控制
        getNext: function(index) {
            return (index + 1 === this.itemsLen) ? 0 : (index + 1);
        },
        // 获取移动的距离
        // 根据方向参数，自动播放/手动播放标识 来判断
        getMoveDistance: function(index, prevIndex) {
            return (this.timer) ? this.width : this.getDirection(index, prevIndex) * (this.width);
        },
        // 滚动回调
        scroll: function(index, prevIndex) {
            // console.log(this.isAnimating);
            if (this.isAnimating) {
                return;
            }

            this.isAnimating = true;
            // 更改开始的下标
            this.startIndex = index;
            var self = this,
                moveDistance = this.getMoveDistance(index, prevIndex),
                promiseCurrent,
                promisePrev;

            // 先移除current next类
            this.container.find('li').removeClass('current prev');

            promiseCurrent = this.container.find('li').eq(index).addClass('current').css({
                'left': moveDistance + 'px'
            }).stop(true, true).animate({
                'left': 0
            }, self.delay, 'linear', function() {
                $(this).siblings().removeClass('prev').attr('style', '');
                $(this).css('z-index', '1');
            }).promise();

            // 再进行定性添加
            promisePrev = this.container.find('li').eq(prevIndex).addClass('prev').stop(true, true).animate({
                'left': -moveDistance + 'px',
            }, self.delay, 'linear', function() {
                $(this).attr('style', '');
            }).promise();

            $.when(promiseCurrent, promisePrev).done(function() {
                self.isAnimating = false;
                self.isPlayNumber && self.playNumber(index);
            });
        },
        // 触发自动滚动
        autoScroll: function() {
            var self = this,
                perveIndex;
            this.timer = setInterval(function() {
                pervIndex = self.startIndex;
                // console.log(pervIndex);
                self.startIndex = self.getNext(self.startIndex);
                // console.log(self.startIndex);
                self.scroll(self.startIndex, pervIndex);
            }, self.duration);
        },
        // 阻止滚动
        stopSrcoll: function() {
            var self = this;
            if (this.timer) {
                clearInterval(self.timer);
                self.timer = null;
            }
        },
        /*以下是可自定义回调*/
        moveTo: function(left, top) {
            this.container.parent().css({
                'position': 'relative',
                'left': left + 'px',
                'top': top + 'px'
            });
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
    $.fn[pluginName].defaults = {
        'isHoverPause': true,
        'isPlayNumber': true,
        'isDirbtn': true,
        'startIndex': 0,
        'duration': 3000,
        'delay': 800
    };
})(window, jQuery);