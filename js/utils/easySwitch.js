;
(function($, undefined) {
    'use strict';
    /*
     * 书写一个jquery简单轮播
     * 支持上下左右四个方向
     * 每次轮播，起始转换无跳动
     */
    var pluginName = 'easySwitch',
        EasySwitch = (function() {

            function EasySwitch(ele, opts) {
                var that = ele,
                    settings = $.extend({}, $.fn.easySwitch.defaults, opts),
                    self = this;
                this.switchItem = that.find('li');
                this.switchListLen = this.switchItem.length;

                this.timer = null; // 定时器id
                this.switchIndex = 0;
                this.switchDuration = settings.switchDuration; //获取轮播的动画持续时间
                this.switchInterval = settings.switchInterval; //获取设置的轮播间隔时间
                this.switchEffect = settings.switchEffect; //获取设置的滚动方向
                this.switchWidth = that.width(); //获取容器宽度
                this.switchHeight = that.height(); //获取容器高度
                this.effectMoveObj = {
                    'left': self.switchWidth,
                    'right': -self.switchWidth,
                    'top': self.switchHeight,
                    'bottom': -self.switchHeight
                }; // 配置对应的移动距离
                this.effectPostionAttrObj = {
                    'left': 'left',
                    'right': 'left',
                    'top': 'top',
                    'bottom': 'top'
                };
                this.effectMoveRes = this.effectMoveObj[self.switchEffect]; // 根据初始配置，计算最终位置信息
                this.effectPostionRes = this.effectPostionAttrObj[self.switchEffect];
                this.init();
            }
            // 原型扩展
            EasySwitch.prototype = {
                constructor: EasySwitch,
                init: function() {
                    var self = this;
                    this.intializeSwitchPostion();
                    this.timer = setInterval(function() {
                        // 修正this指向
                        self.runSwitch.call(null, self);
                    }, self.switchInterval);
                },
                // 初始化图片位置，为切换做预备
                intializeSwitchPostion: function() {
                    // 初始化下一次轮播的位置
                    var self = this;
                    (this.switchListLen > 3) && this.switchItem.eq(self.getPrevIndex(self.switchIndex)).css({
                        'display': 'block',
                        'left': -self.effectMoveRes + 'px',
                        'z-index': '0'
                    });
                    // 当前
                    this.switchItem.eq(self.switchIndex).css({
                        'display': 'block',
                        'z-index': '10',
                        'left': '0'
                    });
                    // 下一个
                    this.switchItem.eq(self.getNextIndex(self.switchIndex)).css({
                        'display': 'block',
                        'z-index': '0',
                        'left': self.effectMoveRes + 'px'
                    });
                },
                // 获取前一个下标
                getPrevIndex: function(index) {
                    return (index === 0) ? (this.switchListLen - 1) : (index - 1);
                },
                // 获取下一个下标
                getNextIndex: function(index) {
                    return (index === this.switchListLen - 1) ? 0 : (index + 1);
                },
                // 获取当前下标
                getIndex: function() {
                    this.switchIndex++;
                    if (this.switchIndex >= this.switchListLen) {
                        this.switchIndex = 0;
                    }
                    return this.switchIndex;
                },
                // 切换逻辑
                switchAnimate: function(currentIndex) {
                    var self = this,
                        prevIndex = this.getPrevIndex(currentIndex),
                        nextIndex = this.getNextIndex(currentIndex);
                    // 轮播的元素个数超过3，过滤才有意义
                    // 有没有更好的过滤方法，我这里效率有点低啊
                    (this.switchListLen > 3) && $.each(self.switchItem, function(index, ele) {
                        // 其它会被隐藏在next动画完成后变成current的同一位置
                        if (index !== currentIndex && index !== prevIndex && index !== nextIndex) {
                            $(ele).css({
                                'display': 'none',
                                'z-index': '0',
                                'left': '0'
                            });
                        }
                    });
                    // 轮播的元素个数至少为3的情况下，才有当前活动对象的之前位置设置，
                    // 否则，只有两个的话，就只需要设置下一个的位置信息
                    (this.switchListLen >= 3) && this.switchItem.eq(prevIndex).animate({
                        'left': -self.effectMoveRes + 'px'
                    }, self.switchDuration, 'linear').promise().then(function() {
                        $(this).css({
                            'display': 'block',
                            'z-index': '0'
                        });
                    });

                    // 当前
                    this.switchItem.eq(currentIndex).animate({
                        'left': '0'
                    }, self.switchDuration, 'linear').promise().then(function() {
                        $(this).css({
                            'display': 'block',
                            'z-index': '10'
                        });
                    });

                    // 下一个
                    this.switchItem.eq(nextIndex).css({
                        'left': self.effectMoveRes + 'px',
                        'z-index': '0',
                        'display': 'block'
                    });
                },
                // 切换回调
                runSwitch: function(self) {
                    var myIndex = self.getIndex();
                    self.switchAnimate(myIndex);
                }

            };
            return EasySwitch;
        })();

    // each回调中只需要传入绑定的DOM对象，以及参数，其它事情就在构造函数中去做
    $.fn[pluginName] = function(opts) {
        return this.each(function() {
            var that = $(this);
            if (!$.data(that, 'plugin-' + pluginName)) {
                return $.data(that, 'plugin-' + pluginName, new EasySwitch(that, opts));
            }
        }); //
    };
    // 提供公用的对外接口设置
    $.fn[pluginName].defaults = {
        'switchDuration': 300,
        'switchInterval': 3000,
        'switchEffect': 'left'
    };
    // 指定版本号
    $.fn[pluginName].version = 0.1;
    // 提供DATA-API绑定支持
    $(window).on('load',function(){
        $('[data-plugin="easySwitch"]').each(function(){
            var self=$(this),opts={},dataSet=$(this).data();
            opts.switchDuration=dataSet.switchDuration;
            opts.switchInterval=dataSet.switchInterval;
            opts.switchEffect=dataSet.switchEffect;
            return new EasySwitch($(this),opts);
        });
    });
})(jQuery);