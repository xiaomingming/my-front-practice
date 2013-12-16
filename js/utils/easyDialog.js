/*
 * author:leweiming
 * gmail:xmlovecss 艾特 gmail dot com
 * 创建一个简单的dialog
 * 自定义弹层包含块（这样可以有效地设计不同的弹层样式），自定义内容宽高，自定义位置（比如上左，上右，下左，下右）
 * 弹层可以定义在多少秒后自动关闭
 * 设置内容宽高，否则，将使用系统默认宽高
 * 自定义填充内容
 * 自定义关闭回调
 * 支持内容异步获取（这个为嘛好难）
 * 异步阻塞会产生一个问题，未响应时，内容区为空，没有高度；响应后，还得重新计算高度
 * 对于这个问题，还是自行定义内容区高度，用户体验会更好，不至于产生抖动
 * 支持显示关闭的特效（暂时没想法）
 * example:
 *       $('.easy-dialog').easyDialog({
 *           'dTitle':'lallalala',
 *           'dContentTmp':'<p>ixixixixixixixixii</p>'
 *       });
 */
;
(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'EDialog',
        pluginName = 'easyDialog';
    /*
     * 判断数据类型是否为你预想的数据类型
     */
    my.isYourType = function(obj, type) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === type;
    };
    // 弹层模板
    my.dialogTmp = [
        '<div class="easy-dialog-header">',
        '<h1>弹层名</h1>',
        '<a href="#" class="easy-dialog-close">关闭</a>',
        '</div>',
        '<div class="easy-dialog-content">',
        '<div class="inner"></div>',
        '</div>',
        '<div class="easy-dialog-footer">',
        '<p>',
        '<button type="button" class="btn-confirm">确定</button>',
        '</p>',
        '</div>'
    ].join('');
    // 遮罩模板
    my.dialogFilterTmp = '<div class="easy-dailog-filter"></div>';
    // 启动渲染模板
    my.renderTmp = function(wrapper) {
        // 先清空，再填充，避免产生重复填充的问题
        wrapper.html('').append(my.dialogTmp);
    };

    // 构造函数开始
    my[constructorFunName] = function(container, options) {
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        // 初始化
        this.container = container;
        // 模板渲染
        my.renderTmp(this.container);
        // 头部
        this.header = container.find('.easy-dialog-header');
        // 内容区域
        this.cont = container.find('.easy-dialog-content .inner');
        // 底部
        this.footer = container.find('.easy-dialog-footer');

        // 弹层层叠值
        this.zindex = settings.zindex;
        // 弹层标题
        this.dTitle = settings.dTitle;
        // 弹层关闭内容
        this.dCloseTxt = settings.dCloseTxt;
        // 弹层填充内容
        // 目前仅仅支持html片段
        this.dContentTmp = settings.dContentTmp;

        // 弹层内容宽度设置
        // 此时还不是精确宽高
        // 需要等到内容填充完成后获取
        this.cWidth = Number(settings.cWidth || 0);
        // 弹层内容高度
        this.cHeight = Number(settings.cHeight || 0);
        // 关闭
        this.closeBtn = this.header.find('.easy-dialog-close');
        // 确定，取消按钮
        this.confirmBtn = this.footer.find('.btn-confirm');
        // this.cancelBtn = this.footer.find('.btn-cancel');

        // 获取回调
        this.cancel = settings.cancel;
        this.OK = settings.OK;

        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        init: function() {
            this
                .renderDialogContent()
                .renderDialogTitle()
                .renderDialogModel()
                .renderFilterContent()
                .eventControl();
        },
        // 计算弹层总体高度
        // 应当在内容填充成功以后作为回调
        // 配置的内容宽度，高度，加上弹层本身的头部和底部高度
        getDialogModelStyle: function() {
            // 精确获取内容实际宽高
            // 弹层内容宽度
            this.cWidth = this.cWidth || this.cont.outerWidth();
            // 弹层内容高度
            this.cHeight = this.cHeight || this.cont.outerHeight();

            var _this = this,
                headerHeight = this.header.outerHeight(),
                footerHeight = this.footer.outerHeight(),
                containerHeight = this.cHeight + headerHeight + footerHeight;

            // console.log(_this.cHeight, headerHeight, footerHeight);

            return {
                headerHeight: headerHeight,
                footerHeight: footerHeight,
                containerHeight: containerHeight
            }

        },
        // 渲染弹层相关盒子样式
        renderDialogModel: function() {
            var _this = this,
                containerHeight = this.getDialogModelStyle().containerHeight,
                windowScrollTop = $(window).scrollTop();
            /*
             * 内容区填充
             */
            this.cont.parent('.easy-dialog-content').css({
                'width': _this.cWidth + 'px',
                'height': _this.cHeight + 'px'
            });
            /*
             * 包含框样式定义
             */
            this.container.css({
                'position': 'absolute',
                'width': _this.cWidth + 'px',
                'height': containerHeight + 'px',
                'left': '50%',
                'top': '50%',
                'marginTop': (-containerHeight / 2) + windowScrollTop + 'px',
                'marginLeft': (-_this.cWidth / 2) + 'px',
                'zIndex': _this.zindex
            }).show();
            return this;
        },
        // 盒模型确定好后，
        // 开始进行内容渲染
        // 渲染头，内容，底部
        setDialogTitle: function() {
            return this.dTitle;
        },
        renderDialogTitle: function() {
            this.header.find('h1').text(this.setDialogTitle());
            this.header.find('.easy-dialog-close').text(this.dCloseTxt);
            return this;
        },
        setDialogContent: function(cont) {
            if (my.isYourType(this.dContentTmp, 'function')) {
                return this.dContentTmp(cont);
            } else if (my.isYourType(this.dContentTmp, 'string')) {
                return this.dContentTmp;
            }

        },
        // 渲染弹层内容
        // 确定和取消的回调函数应当在此处执行
        // 关闭不受此影响
        renderDialogContent: function() {
            var _this = this;

            // 判断设置内容回调
            // 若是返回串，则插入到this.cont
            // 否则传入this.cont，进行回调
            if (my.isYourType(this.setDialogContent(), 'string')) {
                this.cont.html(this.setDialogContent());
            } else {
                this.setDialogContent(this.cont);
            }

            // 确定，取消
            this.confirmBtn.on('click', $.proxy(_this.confirmEvent, _this));
            // this.cancelBtn.on('click', $.proxy(_this.cancelEvent, _this));
            return this;
        },
        // 渲染遮罩层
        renderFilterContent: function() {
            // 若遮罩层存在，则不进行重复插入
            !($('.easy-dailog-filter').length) && $('body').append(my.dialogFilterTmp);
            // 为了兼容IE6，设置遮罩层高度
            // 高度为浮层高度和document高度中最大的
            var filterHeight = Math.max(this.getDialogModelStyle().containerHeight, $(document).height());
            // console.log(this.container);
            $('.easy-dailog-filter').css('height', filterHeight + 'px').show();
            return this;
        },
        // 隐藏遮罩层
        hideFilter: function() {
            return $('.easy-dailog-filter').hide();
        },
        // 事件控制
        eventControl: function() {
            var _this = this;
            // 关闭事件
            // 使用代理，事件回调中的this已经变成了当前的事件DOM对象
            this.closeBtn.on('click', $.proxy(_this.closeEvent, _this));

            $(window).on('scroll', $.proxy(_this.scrollEvent, _this))
            return this;
        },
        // 浏览器滚动条滚动事件
        // 滚动时，是否要更改弹层的位置
        scrollEvent: function() {
            var w = $(window),
                containerHeight = this.getDialogModelStyle().containerHeight;
            scrollTop = w.scrollTop(),
            scrollLeft = w.scrollLeft();

            this.container.css({
                'marginTop': (-containerHeight / 2) + scrollTop + 'px',
                'marginLeft': (-this.cWidth / 2) + scrollLeft + 'px'
            });
        },
        // 按钮关闭
        // 这里要考虑，关闭按钮后，是否清空内容区，还是仅仅隐藏
        closeEvent: function() {
            // console.log('close filter');
            this.container.hide();
            // 若有弹层，关闭弹层
            this.hideFilter();
        },
        // 确定事件
        // 始终会调用默认关闭
        // 是应当先关闭，再执行回调
        // 还是应当先执行完回调，再关闭呢
        confirmEvent: function() {
            // 此处对于是否存在回调，要做进一步的判断
            this.closeEvent();
            my.isYourType(this.OK, 'function') && this.OK();

        },
        // 取消事件
        cancelEvent: function() {
            my.isYourType(this.cancel, 'function') && this.cancel();
            // 取消是否绑定默认关闭呢。。。
            this.closeEvent();
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

            // 若存在该实例，则不需要进行new
            if (!that.data('plugin-' + pluginName)) {
                return that.data('plugin-' + pluginName, s1);
            }

        });

    };
    /*
     * 默认配置
     */
    $.fn[pluginName].defaults = {
        'cWidth': 300,
        'dContentTmp': function() {
            return ''
        },
        'zindex': 4,
        'cancel': function() {},
        'OK': function() {}
    };
})(window, jQuery);