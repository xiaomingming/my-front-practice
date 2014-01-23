define(['jquery'], function($) {
    // 积分计算
    var score = {};
    score = {
        getScores: function() {
            return Number(this.bar.data('scores'));
        },
        getLevel: function(s) {
            s = s || this.getScores();
            var i = 0,
                j = this.levelArr.length;
            for (; i < j; i++) {
                if (s < this.levelArr[i]) {
                    break;
                }
            }
            return i - 1;
        },
        // 获取到了第几步骤
        getStep: function() {
            var l = this.getLevel(),
                lStep = 0,
                rStep = Math.ceil(l / 5) * 5;
            if (l % 5 === 0) {
                // 5的倍数，过度阶段时，要算到下一个阶段
                if (this.getScores() - this.levelArr[rStep] > 0) {
                    rStep += 5;
                }
            }
            if (!rStep) {
                rStep = 5;
            }
            lStep = rStep - 5;
            return {
                lStep: lStep,
                rStep: rStep
            };
        },
        // 获取每个步骤显示的宽度
        render: function() {
            var w = this.eachWidth,
                levelArr = this.levelArr,
                step = this.getStep(),
                rStep = step.rStep,
                lStep = step.lStep,
                index = Math.floor(lStep / 5),
                endW = (this.getScores() - levelArr[lStep] - 1) * w / (levelArr[rStep] - levelArr[lStep] - 1),
                userPos = Number(index * this.borderW + index * w + endW - this.userBgW);
            userPos = (userPos > 1) ? userPos : 0;

            this.bar.find('li:lt(' + (index + 1) + ')>span').addClass('active-status');
            this.bar.find('li').eq(index).find('.active-status').css({
                'width': endW + 'px'
            }).text(this.getScores());
            this.rankWrap.find('.user-pos').css({
                'left': userPos + 'px'
            });

        }
    };
    // dom配置，以及空白边框宽度预定义
    score.config = function(opts) {
        this.rankWrap = opts.rankWrap;
        this.bar = this.rankWrap.find('.all-step');
        this.borderW = opts.borderW || 2;
        this.userBgW = this.rankWrap.find('.user-pos').width();
        this.eachWidth = this.rankWrap.find('.all-step li').width();
        // 等级参数配置
        this.levelArr =opts.levelArr;
    };
    // 提供启动
    score.run = function(opts) {
        this.config(opts);
        this.render();
    };
    return score;
});