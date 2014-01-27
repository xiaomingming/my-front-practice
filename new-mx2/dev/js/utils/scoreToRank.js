define(['jquery'], function($) {
    // 积分计算
    var score = {};
    score = {
        getScores: function() {
            return Number(this.rankWrap.data('scores'));
        },
        getLevel: function() {
            return Number(this.rankWrap.data('level'));
            // return i - 1;
        },
        // 渲染进度条
        renderStepBar: function() {
            var barS = '<ul class="all-step">',
                i = 0,
                j = 6;
            for (; i < j - 1; i++) {
                barS += '<li style="width:' + (20 * this.d) + 'px"><span style="width:' + (20 * this.d) + 'px"></span></li>';
            }
            barS += '<li style="width:' + (20 * this.d) + 'px" class="last-child"><span style="width:' + (20 * this.d) + 'px"></span></li></ul>';
            this.rankWrap.append(barS);
            this.bar = this.rankWrap.find('.all-step');
            return this;
        },
        // 渲染Lv和分数
        renderRank: function() {
            // 插入等级html
            var rankS = '<ul class="rank-scores-list clearfix">',
                i = 0,
                j = this.levelArr.length,
                r = 0;
            for (; i < j; i++) {
                r = (i === 0) ? 1 : (i * 5);
                rankS += '<li style="width:' + (20 * this.d + this.borderW) + 'px"><p class="rank">LV' + r + '</p><p class="scores">(<span>' + this.levelArr[i] + '</span>)</p></li>';
            }
            rankS += '</ul>';
            this.rankWrap.append(rankS);
            return this;
        },
        // 获取每个步骤显示的宽度
        render: function() {
            this.renderStepBar().renderRank();

            var w = this.rankWrap.find('.all-step li>span').width(),
                l = this.getLevel(),
                index = Math.floor(l / 5),
                stepW = ((l <= 5) ? (w / 4) : (w / 5)),
                stepAllW = stepW * ((l <= 5) ? (l % 5 - 1) : (l % 5)),
                userPos = Number(index * this.borderW + index * w + stepAllW - this.userBgW);
            userPos = (userPos > 1) ? userPos : 0;

            this.bar.find('li:lt(' + (index + 1) + ')>span').addClass('active-status');
            this.bar.find('li').eq(index).find('.active-status').css({
                'width': stepAllW + 'px'
            }).text(this.getScores());
            this.rankWrap.find('.user-pos').css({
                'left': userPos + 'px'
            });


        }
    };
    // dom配置，以及空白边框宽度预定义
    score.config = function(opts) {
        this.rankWrap = opts.rankWrap;
        this.d = opts.d;
        this.bar = this.rankWrap.find('.all-step');
        this.borderW = opts.borderW || 2;
        this.userBgW = this.rankWrap.find('.user-pos').width();
        // 等级参数配置
        this.levelArr = opts.levelArr;
    };
    // 提供启动
    score.run = function(opts) {
        this.config(opts);
        this.render();
    };
    return score;
});