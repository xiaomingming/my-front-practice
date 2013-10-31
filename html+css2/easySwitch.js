;
(function($, undefined) {
    /*
     * 书写一个jquery简单轮播
     * 支持上下左右四个方向
     * 每次轮播，起始转换无跳动
     */
    $.fn.EasySwitch = function(opts) {
        var that = $(this),
            defaults = {
                'switchDuration': 300,
                'switchInterval': 3000,
                'switchEffect': 'left'
            },
            settings = $.extend({}, defaults, opts);
        var switchItem = that.find('li'),
            switchListLen = switchItem.length,
            runSwitch, // 轮播的回调
            stopSwitch, // 停止轮播
            timer, // 定时器id
            switchIndex = 0,
            switchDuration = settings.switchDuration, //获取轮播的动画持续时间
            switchInterval = settings.switchInterval, //获取设置的轮播间隔时间
            switchEffect = settings.switchEffect, //获取设置的滚动方向
            switchWidth = that.width(), //获取容器宽度
            switchHeight = that.height(), //获取容器高度
            effectMoveObj = {
                'left': switchWidth,
                'right': -switchWidth,
                'top': switchHeight,
                'bottom': -switchHeight
            }, // 配置对应的移动距离
            effectPostionAttrObj = {
                'left': 'left',
                'right': 'left',
                'top': 'top',
                'bottom': 'top'
            },
            effectMoveRes = effectMoveObj[switchEffect], // 根据初始配置，计算最终位置信息
            effectPostionRes = effectPostionAttrObj[switchEffect],
            getPreIndex, // 获取前一个轮播下标
            getPreIndex, // 获取下一个轮播下标
            getIndex, // 获取当前的轮播下标
            switchAnimate; // 轮播的动画控制

        getPrevIndex = function(index) {
            return (index === 0) ? (switchListLen - 1) : (index - 1);
        };
        getNextIndex = function(index) {
            return (index === switchListLen - 1) ? 0 : (index + 1);
        };
        getIndex = function() {
            switchIndex++;
            if (switchIndex >= switchListLen) {
                switchIndex = 0;
            }
            return switchIndex;
        };
        switchAnimate = function(currentIndex) {
            var prevIndex = getPrevIndex(currentIndex),
                nextIndex = getNextIndex(currentIndex);

            // 轮播的元素个数超过3，过滤才有意义
            // 有没有更好的过滤方法，我这里效率有点低啊
            (switchListLen > 3) && $.each(switchItem, function(index, ele) {
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
            (switchListLen >= 3) && switchItem.eq(prevIndex).animate({
                'left': -effectMoveRes + 'px'
            }, switchDuration, 'linear').promise().then(function() {
                $(this).css({
                    'display': 'block',
                    'z-index': '0'
                });
            });

            // 当前
            switchItem.eq(currentIndex).animate({
                'left': '0'
            }, switchDuration, 'linear').promise().then(function() {
                $(this).css({
                    'display': 'block',
                    'z-index': '10'
                });
            });

            // 下一个
            switchItem.eq(nextIndex).css({
                'left': effectMoveRes + 'px',
                'z-index': '0',
                'display': 'block'
            });
        };

        runSwitch = function() {
            switchAnimate(getIndex());
        };

        timer = setInterval(runSwitch, switchInterval);

        // 初始化下一次轮播的位置
        (function() {
            // 为当前current,next，prev对应的dom元素，添加初始化样式
            // 前一个
            (switchListLen > 3) && switchItem.eq(getPrevIndex(switchIndex)).css({
                'display': 'block',
                'left': -effectMoveRes + 'px',
                'z-index': '0'
            });
            // 当前
            switchItem.eq(switchIndex).css({
                'display': 'block',
                'z-index': '10',
                'left': '0'
            });
            // 下一个
            switchItem.eq(getNextIndex(switchIndex)).css({
                'display': 'block',
                'z-index': '0',
                'left': effectMoveRes + 'px'
            });
        })();
    };
})(jQuery);