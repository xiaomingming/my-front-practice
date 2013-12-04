/*
 * author:leweiming
 * gmail:xmlovecss 艾特 gmail dot com
 * 创建一个简单的dialog
 * 自定义内容宽高
 * 自定义填充内容
 * 自定义关闭回调
 * 支持内容异步获取
 * example:
 */
;
(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'EDialog',
        pluginName = 'easyDialog';

    my[constructorFunName] = function(container, options) {
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        // 初始化
        this.container = container;
        // 头部
        this.header = container.find('.easy-dialog-header');
        // 内容区域
        this.cont = container.find('.easy-dialog-content');
        // 底部
        this.footer = container.find('.easy-dialog-footer');
        // 弹层内容宽度
        this.cWidth = settings.cWidth;
        // 弹层内容高度
        this.cHeight = settings.cHeight;
        // 关闭
        this.closeBtn = this.header.find('.easy-dialog-close');
        // 确定，取消按钮
        this.confirmBtn = this.footer.find('.btn-confirm');
        this.cancelBtn = this.footer.find('.btn-cancel');
        // 生成一个唯一的区分的id
        this.roleId = 0;
        // 弹层标题
        this.dTitle = settings.dTitle;
        // 弹层关闭内容
        this.dCloseTxt = settings.dCloseTxt;
        // 弹层填充内容
        // 目前仅仅支持html片段
        this.dContentTmp = settings.dContentTmp;

        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        init: function() {
            this.setDialogModelStyle().renderDialogContent().eventControl();
            // this.renderDialogContent();
            // this.eventControl();
        },
        // 计算弹层总体高度
        // 配置的内容宽度，高度，加上弹层本省的头部和底部高度
        setDialogModelStyle: function() {
            var _this = this,
                headerHeight = this.header.outerHeight(),
                footerHeight = this.footer.outerHeight();
            this.container.css({
                'width': _this.cWidth + 'px',
                'height': _this.cHeight + headerHeight + footerHeight + 'px'
            });
            return this;
        },
        // 盒模型确定好后，
        // 开始进行内容渲染
        setDialogContent: function() {
            return this.dContentTmp;
        },
        // 渲染
        renderDialogContent: function() {
            var _this = this;
            this.cont.html(_this.setDialogContent());
            return this;
        },
        // 事件控制
        eventControl: function() {
            var _this = this;
            // 关闭事件
            this.closeBtn.on('click', _this.closeEvent);
            // 确定，取消
            this.confirmBtn.on('click', _this.confirmEvent);
            this.cancelBtn.on('click', _this.cancelEvent);
            return this;
        },
        // 按钮关闭
        // 这里要考虑，关闭按钮后，是否清空内容区，还是仅仅隐藏
        closeEvent: function() {
            this.hide();
        },
        // 确定事件
        // 始终会调用默认关闭
        confirmEvent: function(callback) {
            // 此处对于是否存在回调，要做进一步的判断
            callback();
            this.closeEvent();
        },
        // 取消事件
        cancelEvent: function(callback) {
            callback();
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

            if (!that.data('plugin-' + pluginName)) {
                return that.data('plugin-' + pluginName, s1);
            }

        });

    };
    $.fn[pluginName].defaults = {
        'cWidth': 300,
        'cHeight': 80
    };
})(window, jQuery);