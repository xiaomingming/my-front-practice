;
(function($, undefined) {
    'use strict';
    /*
     * 书写一个jquery简单轮播
     * 支持data-api设置
     * 支持上下左右四个方向
     * 每次轮播，起始转换无跳动，霸气！
     * 支持显示/去除播放数字
     * 支持悬浮滚动/停止
     */
    var pluginName = 'easySwitch',
        EasySwitch = (function() {
            function EasySwitch(ele, opts) {
                var that = ele,
                    settings = $.extend({}, $.fn.easySwitch.defaults, opts),
                    self = this;
                this.container = ele;
                this.switchItem = that.find('li');
                this.switchListLen = this.switchItem.length;

                this.timer = null; // 定时器id
                this.startIndex = settings.startIndex;
                this.switchIndex = this.startIndex;
                this.switchDuration = settings.switchDuration; //获取轮播的动画持续时间
                this.switchInterval = settings.switchInterval; //获取设置的轮播间隔时间
                this.switchEffect = settings.switchEffect; //获取设置的滚动方向
                this.isPlayNumber = settings.isPlayNumber; //设置是否显示播放数字
                this.isHoverPause = settings.isHoverPause; //设置是否悬浮停止轮播
                this.isAnimating = false; //设置动画状态

                this.switchWidth = that.width(); //获取容器宽度
                this.switchHeight = that.height(); //获取容器高度
                this.effectMoveObj = {
                    'left': self.switchWidth,
                    'right': -self.switchWidth,
                    'top': self.switchHeight,
                    'bottom': -self.switchHeight
                }; // 配置对应的移动距离
                // 配置对应的移动属性
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
                    // 是否显示轮换数字
                    this.isPlayNumber && this.renderPlayNumber();
                    // 是否悬浮停止轮播
                    this.isHoverPause && this.switchItem.hover(function() {
                        self.stopRun();
                    }, function() {
                        self.autoRun();
                    });

                    // 初始化位置，需要加1，这样被处理减去1后，可以正确归位
                    this.intializeSwitchPostion(self.getNextIndex(self.startIndex));
                    // 自动轮播
                    this.autoRun();
                },
                // 初始化图片位置，为切换做预备
                intializeSwitchPostion: function(currentIndex) {
                    // 初始化下一次轮播的位置，
                    // 所以，这个初始化的位置应当是基于 (currentIndex-1)
                    // console.log('now next index is:' + currentIndex);
                    var self = this,
                        cIndex = this.getPrevIndex(currentIndex),
                        pIndex = this.getPrevIndex(cIndex),
                        nIndex = this.getNextIndex(cIndex);

                    var readyStyleConfig = {
                        prev: {
                            common: {
                                'display': 'block',
                                'z-index': '0'
                            },
                            left: -self.effectMoveRes + 'px',
                            top: -self.effectMoveRes + 'px'
                        },
                        current: {
                            common: {
                                'display': 'block',
                                'z-index': '10'
                            },
                            left: '0',
                            top: '0'
                        },
                        next: {
                            common: {
                                'display': 'block',
                                'z-index': '0'
                            },
                            left: self.effectMoveRes + 'px',
                            top: self.effectMoveRes + 'px'
                        },
                        others: {
                            common: {
                                'display': 'none',
                                'z-index': '0'
                            },
                            left: '0',
                            top: '0'
                        }
                    };
                    var getReadyStyleConfig = function(orderStr) {
                        var position = self.effectPostionRes,
                            orderObj = readyStyleConfig[orderStr],
                            commonObj = orderObj.common;
                        commonObj[position] = readyStyleConfig[orderStr][position];
                        return commonObj;
                    };
                    // 上一个
                    (this.switchListLen > 3) && this.switchItem.eq(pIndex).css(getReadyStyleConfig('prev'));
                    // 当前
                    this.switchItem.eq(cIndex).css(getReadyStyleConfig('current'));
                    // 下一个
                    this.switchItem.eq(nIndex).css(getReadyStyleConfig('next'));
                    // 其它

                },
                // 创建播放数字
                createPlayNumber: function() {
                    var tpl = '<ul class="switch-number">',
                        i = 1,
                        j = this.switchListLen;
                    for (; i <= j; i++) {
                        tpl += '<li><a href="#">' + i + '</a></li>';
                    }
                    tpl += '</ul>';
                    return tpl;
                },
                // 渲染播放数字
                renderPlayNumber: function() {
                    var self = this,
                        tpl = this.createPlayNumber();
                    this.container.wrap('<div class="easy-switch-wrapper"></div>');
                    this.container.after(tpl);

                    // 绑定跳转事件
                    this.container.parent().find('.switch-number').on('click', 'li', function(e) {
                        // e.preventDefault();
                        // 判断动画是否完成
                        self.goTo($(this).index());
                    });

                    // 初始化开始轮播的数字状态
                    this.setStartPlayNuberStatus();
                },
                // 设置开始的播放数字状态
                setStartPlayNuberStatus: function() {
                    var self = this;
                    this.playNumber(self.startIndex);
                },
                // 数字跳转
                goTo: function(index) {
                    // 停止轮播
                    this.stopRun();
                    // 更改轮播的下标
                    this.switchIndex = index;
                    // 调用轮播
                    this.switchAnimate(index);
                    // 恢复轮播
                    this.autoRun();
                },
                // 数字自动播放
                playNumber: function(index) {
                    var playNumberItems = this.container.parent().find('.switch-number>li');
                    playNumberItems.eq(index).addClass('current').siblings('li').removeClass('current');
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
                    // 应当先执行预备工作
                    this.intializeSwitchPostion(currentIndex);
                    // 然后执行滚动
                    var self = this,
                        prevIndex = this.getPrevIndex(currentIndex),
                        nextIndex = this.getNextIndex(currentIndex);
                    var animateConfig = {
                        current: {
                            common: {},
                            left: '0',
                            top: '0'
                        },
                        next: {
                            common: {
                                'z-index': '0',
                                'display': 'block'
                            },
                            left: self.effectMoveRes + 'px',
                            top: self.effectMoveRes + 'px'
                        },
                        prev: {
                            common: {},
                            left: -self.effectMoveRes + 'px',
                            top: -self.effectMoveRes + 'px'
                        },
                        others: {
                            common: {
                                'display': 'none',
                                'z-index': '0'
                            },
                            left: '0',
                            top: '0'
                        }
                    };
                    var getAnimateConfig = function(orderStr) {
                        var position = self.effectPostionRes,
                            orderObj = animateConfig[orderStr],
                            commonObj = orderObj.common;
                        commonObj[position] = animateConfig[orderStr][position];
                        return commonObj;

                    };
                    // 轮播的元素个数超过3，过滤才有意义
                    // 有没有更好的过滤方法，我这里效率有点低啊
                    (this.switchListLen > 3) && $.each(self.switchItem, function(index, ele) {
                        // 其它会被隐藏在next动画完成后变成current的同一位置
                        if (index !== currentIndex && index !== prevIndex && index !== nextIndex) {
                            $(ele).css(getAnimateConfig('others'));
                        }
                    });
                    // 轮播的元素个数至少为3的情况下，才有当前活动对象的之前位置设置，
                    // 否则，只有两个的话，就只需要设置下一个的位置信息
                    if (this.isAnimating) {
                        return;
                    }
                    this.isAnimating = true;
                    // 上一个
                    var prevPromise = this.switchItem.eq(prevIndex).stop(true, true).animate(getAnimateConfig('prev'), self.switchDuration, 'linear').promise().then(function() {
                        $(this).css({
                            'display': 'block',
                            'z-index': '0'
                        });
                    });
                    // 下一个
                    var currentPromise = this.switchItem.eq(currentIndex).stop(true, true).animate(getAnimateConfig('current'), self.switchDuration, 'linear').promise().then(function() {
                        $(this).css({
                            'display': 'block',
                            'z-index': '10'
                        });
                    });
                    // 同时完成后，设置回isAniamting标志
                    $.when((this.switchListLen >= 3) && prevPromise, currentPromise).done(function() {
                        // 若设置了数字播放，则执行播放
                        self.isPlayNumber && self.playNumber(currentIndex);
                        self.isAnimating = false;
                    }).fail(function(){
                        throw new Error('animate bug');
                    });

                    // 下一个
                    this.switchItem.eq(nextIndex).css(getAnimateConfig('next'));
                    
                },
                // 切换回调
                runSwitch: function(self) {
                    var myIndex = self.getIndex();
                    self.switchAnimate(myIndex);
                },
                // 自动播放
                autoRun: function() {
                    var self = this;
                    this.timer = setInterval(function() {
                        // 修正this指向
                        self.runSwitch.call(null, self);
                    }, self.switchInterval);
                },
                // 停止轮播
                stopRun: function() {
                    this.timer && clearInterval(this.timer);
                    this.timer = null;
                }
            };
            return EasySwitch;
        })();

    // each回调中只需要传入绑定的DOM对象，以及参数，其它事情就在构造函数中去做
    $.fn[pluginName] = function(opts) {
        if (typeof opts === 'string') {
            if (opts === 'api') {
                return $(this).data('plugin-' + pluginName);
            } else {
                throw new Error('error string ,here supports "api" only!');
            }
        }
        return this.each(function() {
            var that = $(this),
                s1 = new EasySwitch(that, opts);

            if (!that.data('plugin-' + pluginName)) {
                return that.data('plugin-' + pluginName, s1);
            }

        });
    };
    // 提供公用的对外接口设置
    $.fn[pluginName].defaults = {
        'startIndex': 0, //开始播放的下标
        'switchDuration': 300, //动画持续时间
        'switchInterval': 3000, //间隔时间
        'switchEffect': 'left', //移动的方向，支持,top,bottom,left,right
        'isPlayNumber': true, // 是否显示播放数字
        'isHoverPause': false
    };
    // 指定版本号
    $.fn[pluginName].version = 0.1;
    // 提供DATA-API绑定支持
    // 此处有个疑问，就是如何避免方法调用和DATA-API调用产生的冲突？
    $(function() {
        var $plugin = $('[data-plugin="' + pluginName + '"],.easySwitch');
        $plugin.each(function() {
            var self = $(this),
                opts = {}, dataSet = $(this).data();
            opts.switchDuration = dataSet.switchDuration;
            opts.switchInterval = dataSet.switchInterval;
            opts.switchEffect = dataSet.switchEffect;

            return self[pluginName](opts);
        });
    });
})(jQuery);