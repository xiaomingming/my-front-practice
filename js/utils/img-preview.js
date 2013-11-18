;
(function($, window, undefined) {
    var pluginName = 'imgPreview';
    var ImgPreview = function(self, opts) {
        var settings = $.extend({}, $.fn[pluginName].defaults, opts);
        this.container = self;
        this.imgWidth = settings.imgWidth;
        this.dialogId = settings.dialogId;
        this.dialogMaskId = settings.dialogMaskId;
        return this.init();
    };
    ImgPreview.prototype = {
        constructor: ImgPreview,
        init: function() {
            var self = this;
            this.renderDialog();
        },
        createDialog: function() {
            return ['<div id="' + this.dialogId + '" class="img-preview-dialog"><h1 class="hd"><a href="#" class="close">关闭</a></h1><div class="bd"></div></div>'].join('');

        },
        // 创建弹层遮罩
        createDialogMask: function() {
            return '<div id="' + this.dialogMaskId + '" class="u-dialog-mask"></div>';
        },
        // 获取弹层宽高属性
        getModel: function(box) {
            return {
                width: box.outerWidth(true),
                height: box.outerHeight(true)
            }
        },
        // 设置弹层位置
        // 根据宽高以及浏览器窗口的滚动条位置确定
        setDialogPosition: function(box) {
            var self = this,
                getModel = self.getModel(box),
                wScrollTop = $(window).scrollTop();
            box.css({
                marginLeft: -getModel.width / 2 + 'px',
                marginTop: -getModel.height / 2 + wScrollTop + 'px'
            });
        },
        renderDialog: function() {
            var self = this;
            // 创建独一的弹层
            !$('#' + self.dialogId).size() && $('body').append(self.createDialog()) && $('body').append(self.createDialogMask());
            // 
            $('#' + self.dialogId).find('a.close').on('click', function(e) {
                e.preventDefault();
                $('#' + self.dialogId).hide().css({margin:0});
                $('#' + self.dialogMaskId).hide();
            });
            // 点击元素图片时再渲染
            this.container.find('img').on('click', function() {
                // 填充图片
                self.renderImg();
                // 设置弹层位置
                
                // 显示弹层及其遮罩
                $('#' + self.dialogId).show();
                self.setDialogPosition($('#' + self.dialogId));
                $('#' + self.dialogMaskId).show();
                // 滚动条滚动时，更改弹层位置
                $(window).scroll(function() {
                    self.setDialogPosition($('#' + self.dialogId));
                });
            });
            this.container.find('a').on('click', function(e) {
                e.preventDefault();
            });
        },
        getSplitURL: function(url, widthStr) {
            var arr = url.split('/');
            arr.splice(-1, 1);
            arr.push(widthStr);
            return arr.join('/');
        },
        getImgURL: function() {
            var imgs = this.container.find('img'),
                URLArr = [],
                url, self = this;
            $.each(imgs, function(index, ele) {
                url = self.getSplitURL($(ele).attr('src'), '' + self.imgWidth);
                URLArr.push(url);
            });
            return URLArr;
        },
        createImg: function() {
            var self = this,
                URLArr = self.getImgURL(),
                L = self.getImgURL().length,
                i = 0,
                s = '<div class="img-content">';

            for (; i < L; i += 1) {
                s += '<img src="' + URLArr[i] + '"/>';
            }
            return s;
        },
        renderImg: function() {
            var self = this;
            $('#' + self.dialogId).find('.bd').html(self.createImg());
        }
    };

    $.fn[pluginName] = function(opts) {
        return this.each(function() {
            var that = $(this);
            var s1 = new ImgPreview(that, opts);
            if (!that.data('plugin-' + pluginName)) {
                return that.data('plugin-' + pluginName, s1);
            }
        });
    };
    $.fn[pluginName].defaults = {
        'imgWidth': '300',
        'dialogId': 'u-preview-dialog',
        'dialogMaskId': 'u-dialog-mask'
    };
})(jQuery, this);