(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'scroll',
        pluginName = 'wordScroll';

    my[constructorFunName] = function(container, options) {
        var self = this;
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
        // 特效支持
        // 包括移动展示，fadeIn fadeOut
        this.effect = settings.effect;
        // 移动方向
        this.moveDirection = settings.moveDirection;
        // 移动的宽度或者高度
        this.moveLenConfig = {
            'left': self.width,
            'top': self.height
        };
        this.moveLen = this.moveLenConfig[this.moveDirection];
        // 移动的动画配置
        this.moveAnimateConfig={
            currentE:{
                animate:{},
                css:{}
            },
            prevE:{
                animate:{},
                css:{}
            }
        };

        this.moveAnimateConfig.currentE.animate[self.moveDirection]=0;
        this.moveAnimateConfig.prevE.animate[self.moveDirection]=0;

        this.moveAnimateConfig.currentE.css[self.moveDirection]=0;
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
                return '<div class="switch-wrapper" style="width:' + this.width + 'px;height:' + this.height + 'px"></div>';
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
                self.gotoIndex($(this).index(), self.startIndex, '');
            });
        },
        // play number
        playNumber: function(index) {
            var self = this;
            this.container.parent().find('.switch-number').find('a').eq(index).addClass('current').siblings().removeClass('current');
        },
        gotoIndex: function(index, prevIndex, directionFlag) {
            // 停止轮播
            var self = this;
            this.stopSrcoll();

            // self.startIndex = index;
            // 
            this.scroll(index, prevIndex, directionFlag);
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
                self.gotoIndex(clickIndex, self.startIndex, -1);
            });
        },
        // 下一张按钮事件
        nextBtnEvent: function() {
            var self = this,
                clickIndex;
            this.container.parent().find('.switch-next').on('click', function(e) {
                e.preventDefault();
                clickIndex = self.getNext(self.startIndex);
                self.gotoIndex(clickIndex, self.startIndex, 1);
            });
        },
        // get direction
        // 传入跳转后的下标，跳转之前的下标
        getDirection: function(gotoIndex, prevIndex) {
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
        // get 前一张
        getPrev: function(index) {
            return (index === 0) ? (this.itemsLen - 1) : (index - 1);
        },
        // 获取下一张
        getNext: function(index) {
            return (index + 1 === this.itemsLen) ? 0 : (index + 1);
        },
        // 获取移动的距离
        // 根据方向参数，自动播放/手动播放标识 来判断
        // 由于上一页，下一页按钮行为特殊，比如，下一页点到最后时，它的下一页就是起始，在两者跳转时，就不同于在分页上的点击那样跳转方向不一致，这个必须一致
        getMoveDistance: function(index, prevIndex, directionFlag) {
            var moveLen = this.moveLen;
            if (directionFlag === '') {
                //前进或后退，首尾图片切换方向不一致时
                return (this.timer) ? moveLen : this.getDirection(index, prevIndex) * moveLen;
            } else {
                return directionFlag * moveLen;
            }

        },
        // 滚动回调
        scroll: function(index, prevIndex, directionFlag) {
            if (this.isAnimating) {
                return;
            }

            this.isAnimating = true;
            // 更改开始的下标
            // 这句相当关键，动画状态正在运动时，就不能让startIndex更改了，而放置的最佳位置，就是这里
            this.startIndex = index;
            var self = this,
                moveDistance = 0,
                container = this.container,
                currentEle = container.find('li').eq(index),
                prevEle = container.find('li').eq(prevIndex),
                promiseCurrent,
                promisePrev;
            // 先移除current next类
            container.find('li').removeClass('current prev');

            // 移动效果
            if (this.effect === 'moveEffect') {
                moveDistance = this.getMoveDistance(index, prevIndex, directionFlag);
                self.moveAnimateConfig.currentE.css[self.moveDirection]=moveDistance+'px';
                self.moveAnimateConfig.prevE.animate[self.moveDirection]=-moveDistance+'px';

                // 当前
                promiseCurrent = currentEle.addClass('current').css(self.moveAnimateConfig.currentE.css).stop(true, true).animate(self.moveAnimateConfig.currentE.animate, self.delay, 'linear', function() {
                    $(this).siblings().removeClass('prev').attr('style', '');
                    $(this).css('z-index', '1');
                }).promise();

                // 当前图片的前一个
                promisePrev = prevEle.addClass('prev').stop(true, true).animate(self.moveAnimateConfig.prevE.animate, self.delay, 'linear', function() {
                    $(this).attr('style', '');
                }).promise();
            }
            // fade 效果
            if (this.effect === 'fadeEffect') {
                promiseCurrent = currentEle.stop(true, true).fadeIn(self.delay).promise();

                promisePrev = prevEle.stop(true, true).fadeOut(self.delay).promise();
            }
            // 效果这里控制，本来使用key/value来进行控制，这样代码显得优雅
            // 但是，在$.when()中，作为参数，产生了问题，于是这里代码就先ugly着
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
                self.startIndex = self.getNext(self.startIndex);
                self.scroll(self.startIndex, pervIndex, 1);
            }, self.duration);
        },
        // 阻止滚动
        stopSrcoll: function() {
            var self = this;
            if (this.timer) {
                clearInterval(self.timer);
                self.timer = null;
            }
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
        'effect': 'moveEffect', // fadeEffect or moveEffect
        'moveDirection': 'left', //left or top
        'isHoverPause': true,
        'isPlayNumber': true,
        'isDirbtn': true,
        'startIndex': 0,
        'duration': 3000,
        'delay': 800
    };
})(window, jQuery);