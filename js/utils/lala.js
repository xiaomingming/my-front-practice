(function(window, $, undefined) {
    var my = {}, constructorFunName = "Eswitch",
        pluginName = "easySwitch";
    my[constructorFunName] = function(container, options) {
        var self = this,
            imgEle;
        this.container = container;
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        this.timer = null;
        this.startIndex = settings.startIndex;
        this.switchWrapperName = settings.switchWrapperName;
        this.switchItemName = settings.switchItemName;
        this.switchNumberName = settings.switchNumberName;
        this.prevBtnName = settings.prevBtnName;
        this.nextBtnName = settings.nextBtnName;
        this.containerHeight = settings.containerHeight;
        this.containerWidth = settings.containerWidth;
        imgEle = container.find("." + this.switchItemName + " img").eq(this.startIndex);
        imgEle.parents("." + this.switchItemName).addClass("prev");
        this.width = this.containerWidth || imgEle.width();
        this.height = this.containerHeight || imgEle.height();
        this.itemsLen = this.container.find("." + this.switchItemName).length;
        this.timer = null;
        this.isAnimating = false;
        this.intervalTime = settings.intervalTime;
        this.effectDuration = settings.effectDuration;
        this.isPlayNumber = settings.isPlayNumber;
        this.isDirbtn = settings.isDirbtn;
        this.isHoverPause = settings.isHoverPause;
        this.effect = settings.effect;
        this.moveDirection = settings.moveDirection;
        this.moveLenConfig = {
            left: self.width,
            top: self.height
        };
        this.moveLen = this.moveLenConfig[this.moveDirection];
        this.moveAnimateConfig = {
            currentE: {
                animate: {},
                css: {}
            },
            prevE: {
                animate: {},
                css: {}
            }
        };
        this.moveAnimateConfig.currentE.animate[self.moveDirection] = 0;
        this.moveAnimateConfig.prevE.animate[self.moveDirection] = 0;
        this.moveAnimateConfig.currentE.css[self.moveDirection] = 0;
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        init: function() {
            var self = this;
            this.setContainerStyle();
            this.isPlayNumber && this.renderPlayNumber();
            this.isDirbtn && this.renderDirectionBtn();
            this.autoSwitch();
            this.isHoverPause && this.container.on("mouseover", function() {
                self.stopSwitch();
            }).on("mouseout", function() {
                self.autoSwitch();
            });
        },
        setContainerStyle: function() {
            var self = this;
            this.container.css({
                width: self.width,
                height: self.height
            });
        },
        createSwitchWrapper: function() {
            if (!this.isSwitchWrapperCreated) {
                this.isSwitchWrapperCreated = true;
                return '<div class="' + this.switchWrapperName + '" style="width:' + this.width + "px;height:" + this.height + 'px"></div>';
            } else {
                return false;
            }
        },
        createPlayNumber: function() {
            var i = 0,
                j = this.itemsLen,
                tmp = '<div class="' + this.switchNumberName + '">';
            for (; i < j; i++) {
                if (i === this.startIndex) {
                    tmp += '<a href="#" class="current">' + (i + 1) + "</a>";
                } else {
                    tmp += '<a href="#">' + (i + 1) + "</a>";
                }
            }
            tmp += "</div>";
            return tmp;
        },
        renderPlayNumber: function() {
            var switchWrapper = this.createSwitchWrapper(),
                self = this;
            if (switchWrapper) {
                this.container.wrap(switchWrapper);
            }
            this.container.parent().append(self.createPlayNumber());
            this.playNumberEvent();
        },
        playNumberEvent: function() {
            var self = this;
            this.container.parent().find("." + this.switchNumberName).on("click", "a", function(e) {
                e.preventDefault();
                self.gotoIndex($(this).index(), self.startIndex, "");
            });
        },
        playNumber: function(index) {
            var self = this;
            this.container.parent().find("." + this.switchNumberName).find("a").eq(index).addClass("current").siblings().removeClass("current");
        },
        gotoIndex: function(index, prevIndex, directionFlag) {
            var self = this;
            this.stopSwitch();
            this.scroll(index, prevIndex, directionFlag);
            this.autoSwitch();
        },
        createDirectionBtn: function() {
            return '<a href="#" class="' + this.prevBtnName + '">上一张</a><a href="#" class="' + this.nextBtnName + '">下一张</a>';
        },
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
        prevBtnEvent: function() {
            var self = this,
                clickIndex;
            this.container.parent().find("." + this.prevBtnName).on("click", function(e) {
                e.preventDefault();
                clickIndex = self.getPrev(self.startIndex);
                self.gotoIndex(clickIndex, self.startIndex, -1);
            });
        },
        nextBtnEvent: function() {
            var self = this,
                clickIndex;
            this.container.parent().find("." + this.nextBtnName).on("click", function(e) {
                e.preventDefault();
                clickIndex = self.getNext(self.startIndex);
                self.gotoIndex(clickIndex, self.startIndex, 1);
            });
        },
        getDirection: function(gotoIndex, prevIndex) {
            var res = gotoIndex - prevIndex;
            if (res >= 1) {
                return 1;
            } else if (res < 0) {
                return -1;
            } else {
                return 0;
            }
        },
        getPrev: function(index) {
            return index === 0 ? this.itemsLen - 1 : index - 1;
        },
        getNext: function(index) {
            return index + 1 === this.itemsLen ? 0 : index + 1;
        },
        getMoveDistance: function(index, prevIndex, directionFlag) {
            var moveLen = this.moveLen;
            if (directionFlag === "") {
                return this.timer ? moveLen : this.getDirection(index, prevIndex) * moveLen;
            } else {
                return directionFlag * moveLen;
            }
        },
        scroll: function(index, prevIndex, directionFlag) {
            if (this.isAnimating) {
                return;
            }
            this.isAnimating = true;
            this.startIndex = index;
            var self = this,
                moveDistance = 0,
                container = this.container,
                currentEle = container.find("." + this.switchItemName).eq(index),
                prevEle = container.find("." + this.switchItemName).eq(prevIndex),
                promiseCurrent, promisePrev;
            container.find("." + this.switchItemName).removeClass("current prev");
            if (this.effect === "moveEffect") {
                moveDistance = this.getMoveDistance(index, prevIndex, directionFlag);
                self.moveAnimateConfig.currentE.css[self.moveDirection] = moveDistance + "px";
                self.moveAnimateConfig.prevE.animate[self.moveDirection] = -moveDistance + "px";
                promiseCurrent = currentEle.addClass("current").css(self.moveAnimateConfig.currentE.css).stop(true, true).animate(self.moveAnimateConfig.currentE.animate, self.effectDuration, "linear", function() {
                    $(this).siblings().removeClass("prev").attr("style", "");
                    $(this).css("z-index", "1");
                }).promise();
                promisePrev = prevEle.addClass("prev").stop(true, true).animate(self.moveAnimateConfig.prevE.animate, self.effectDuration, "linear", function() {
                    $(this).attr("style", "");
                }).promise();
            }
            if (this.effect === "fadeEffect") {
                promiseCurrent = currentEle.stop(true, true).fadeIn(self.effectDuration).promise();
                promisePrev = prevEle.stop(true, true).fadeOut(self.effectDuration).promise();
            }
            $.when(promiseCurrent, promisePrev).done(function() {
                self.isAnimating = false;
                self.isPlayNumber && self.playNumber(index);
            });
        },
        autoSwitch: function() {
            var self = this,
                perveIndex;
            this.timer = setInterval(function() {
                pervIndex = self.startIndex;
                self.startIndex = self.getNext(self.startIndex);
                self.scroll(self.startIndex, pervIndex, 1);
            }, self.intervalTime);
        },
        stopSwitch: function() {
            var self = this;
            if (this.timer) {
                clearInterval(self.timer);
                self.timer = null;
            }
        }
    };
    $.fn[pluginName] = function(opts) {
        if (typeof opts === "string") {
            if (opts === "api") {
                return $(this).data("plugin-" + pluginName);
            } else {
                throw new Error('error string ,here supports "api" only!');
            }
        }
        return this.each(function() {
            var that = $(this),
                s1 = new my[constructorFunName](that, opts);
            if (!that.data("plugin-" + pluginName)) {
                return that.data("plugin-" + pluginName, s1);
            }
        });
    };
    $.fn[pluginName].defaults = {
        switchWrapperName: "switch-wrapper",
        switchItemName: "switch-item",
        switchNumberName: "switch-number",
        prevBtnName: "switch-prev",
        nextBtnName: "switch-next",
        effect: "moveEffect",
        moveDirection: "left",
        containerWidth: 0,
        containerHeight: 0,
        isHoverPause: true,
        isPlayNumber: true,
        isDirbtn: true,
        startIndex: 0,
        intervalTime: 3e3,
        effectDuration: 800
    };
})(window, jQuery);