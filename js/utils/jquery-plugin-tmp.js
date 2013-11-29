/*
* author:leweiming
* gmail:xmlovecss 艾特 gmail dot com
* 
* example:
*/

;(function(window, $, undefined) {
    var my = {},
        constructorFunName = '',
        pluginName = '';

    my[constructorFunName] = function(container, options) {
        var settings=$.extend({},$.fn[pluginName].defaults,options);
        // 初始化
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        // 滚动初始化
        init: function() {
            
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
        
    };
})(window, jQuery);