/*
 * author: leweiming
 * gmail: xmlovecss
 * date: 2013/12/12
 * description: website common functions
 */

/*
 * 登录状态提示
 */
(function() {
    var userStatus = {};
    // 判断是否登录
    userStatus.isLogin = function() {
        return $_conf['islogin'] !== '';
    };
    // 未登录提示
    userStatus.loginTipsy = function() {
        if (!this.isLogin()) {
            $('#login-notification').miniNotification({
                closeButton: true,
                closeButtonText: '关闭'
            });
            return false;
        }
        return true;
    };
    // 暴露接口
    window.utils_userStatus = userStatus;
})();
/*
 * 排名
 */
$(function() {
    $('#rank .rank-list').on('mouseover', 'li', function() {
        $(this).addClass('current').siblings('').removeClass('current');
    });
});
/*
 * 人气，下载量切换
 */
$(function() {
    $('#rank .radio-check').on('click', 'a', function(e) {
        e.preventDefault();
        var self = $(this),
            sIndex = self.index(),
            rankWrap = self.parents('.rank');
        self.addClass('current').siblings('a').removeClass('current');
        rankWrap.find('.rank-list').eq(sIndex).removeClass('hide').siblings().addClass('hide');
    });
});
/*
 * 图片悬浮显示遮罩
 */
$(function() {
    var themeEffect = {
        showList: $('.show-list'),
        hoverEvent: function() {
            this.showList.on('mouseover', '.list-item', function() {
                $(this).find('.shilter-box').show();
                return false; // fix IE6 bug,貌似是冒泡产生的bug
            }).on('mouseout', '.list-item', function() {
                $(this).find('.shilter-box').hide();
                return false;
            });
        },
        start: function() {
            this.hoverEvent();
        }
    };
    themeEffect.start();
});
/*
 * 广告轮播
 */
$(function() {
    $('.switch-list').easySwitch({
        'containerWidth': 820,
        'containerHeight': 230,
        'effect': 'moveEffect', // fadeEffect or moveEffect
        'moveDirection': 'left', //left or top 
        'isHoverPause': true,
        'isPlayNumber': true,
        'isDirbtn': false,
        'startIndex': 0,
        'intervalTime': 4000,
        'effectDuration': 300
    });
});
/*
 * 搜索功能
 */
$(function() {
    // 边框效果
    var onEffect = function() {
        var sForm = $(this).parents('.search-form');
        sForm.find('.search-box').addClass('search-selected');
        sForm.find('.arrow-down').attr('class', 'arrow-up');
        $(this).find('.drop-down').removeClass('hide');
    }, outEffect = function() {
            var sForm = $(this).parents('.search-form');
            sForm.find('.search-box').removeClass('search-selected');
            sForm.find('.arrow-up').attr('class', 'arrow-down');
            $(this).find('.drop-down').addClass('hide');
        };
    $('#search-form .select-box').on('mouseover', onEffect);
    $('#search-form .select-box').on('mouseout', outEffect);
    $('#search-form .search-box .txt').on('focus', onEffect);
    $('#search-form .search-box .txt').on('blur', outEffect);
    // 选中文字
    $('#search-form .select-box').find('.drop-down a').on('click', function(e) {
        e.preventDefault();
        var selectedItem = $(this).parents('.selected-txt').find('.selected-item'),
            originText = selectedItem.text();
        selectedItem.text($(this).text());
        $(this).text(originText);
        $(this).parents('.drop-down').addClass('hide');
    });
});
/*
 * 猜你喜欢换一换
 */
$(function() {
    var favoriteSwitch = {};
    // 处理地址
    favoriteSwitch.switchAction = '/th/json.php?do=Theme.Like';
    var $themeCateSelected = $('#theme-cate .bd').find('li.current'),
        themeCate = $themeCateSelected.length ? $themeCateSelected.find('a').text() : '';
    // 获取分类
    favoriteSwitch.themeCate = themeCate;
    // 请求回调
    favoriteSwitch.getRes = function(opts, callback, renderContainer) {
        var self = this;
        // window.console&&console.log('start request');
        $.post(self.switchAction, opts).done(function(res) {
            callback(res, renderContainer);
        });
    };
    // 渲染
    favoriteSwitch.renderTmp = function(res, renderContainer) {
        // window.console&&console.log('start render ...');
        res = res.data.like;
        // window.console&&console.log(res);
        var str = '',
            i = 0,
            j = res.length;
        for (; i < j; i++) {
            str += [
                '<li class="list-item">',
                '<a href="#" class="img"><img src="' + res[i].preview + '/120" alt="' + res[i].title + '"  /></a>',
                '<div class="shilter-box">',
                '<span class="shilter"></span>',
                '<a href="?do=Theme.Show&id=' + res[i].id + '" target="_blank" class="desc" title="' + res[i].title + '">' + res[i].title + '</a>',
                '</div>',
                '</li>'
            ].join('');
        }
        renderContainer.html(str);
    };
    // 启动
    favoriteSwitch.start = function(switchEle, renderContainer) {
        var self = this;
        switchEle.on('click', function(e) {
            e.preventDefault();
            // window.console&&console.log('you click switch');
            self.getRes({
                    cate: self.themeCate
                },
                self.renderTmp, renderContainer);
        });
    };
    // 对外暴露接口
    window.utils_favoriteSwitch = favoriteSwitch;
    favoriteSwitch.start($('#favorite .switch'), $('#favorite').find('.show-list ul'));
});
/*
 * 摸一下
 * 更改文字及按钮状态
 */
$(function() {
    var mo = {};
    // 初始化事件对象
    mo.getEle = null;
    mo.action = '/th/json.php?do=User.Relation.Following.Mo';
    // 请求回调
    mo.resCallback = function(data) {
        // 一厢情愿的摸
        var moBtn = mo.getEle;
        moBtn.addClass('moed').attr('disabled', true);
        if (data.code === 200) {
            // 摸成功
            if (data.data.relation === 2) {
                moBtn.text('已mo');
            } else if (data.data.relation === 3) {
                moBtn.text('已互mo');
            }

        } else if (data.code === 413) {
            moBtn.text('我去火星了');
        }
    };
    // 请求
    // 实际上只接受被摸的用户的ID
    mo.req = function(opts, callback) {
        var self = this;
        $.post(self.action, opts, function(data) {
            callback(data);
        });
    };
    // 启动摸一下
    mo.start = function(ele, opts) {
        var self = this;
        mo.getEle = ele;
        ele.on('click', function(e) {
            e.preventDefault(); !! utils_userStatus.loginTipsy() && self.req(opts, self.resCallback);
        });
    };
    // 考虑对外暴露mo接口
    window.utils_mo = mo;
    mo.start($('.mo'), {
        uid: $('#user_id').val()
    });
});
/*
 * 赞主题
 * 接受被赞主题id
 */
/*$(function() {
    var zan = {};
    // 获取事件对象
    zan.getEle = null;
    zan.action = '/th/json.php?do=Act.Digg';
    // 赞回调
    zan.resCallback = function(data) {
        $('#theme-zan-notification').find('p').text(data.message);
        $('#theme-zan-notification').miniNotification({
            closeButton: true,
            closeButtonText: '关闭'
        });
        if (data.code === 200) {
            // 赞成功，进行加一操作
            var zanNum = zan.getEle.find('strong'),
                originText = zanNum.text();
            zanNum.text(Number(originText) + 1);
        }
    };
    // 赞请求
    zan.req = function(opts, callback) {
        var self = this;
        $.post(self.action, opts, function(data) {
            callback(data);
        });
    };
    // 开始
    zan.start = function(ele, opts) {
        var self = this;
        this.getEle = ele;
        ele.on('click', function(e) {
            e.preventDefault(); !! utils_userStatus.loginTipsy() && self.req(opts, self.resCallback);
        });
    };
    // 对外暴露赞接口
    window.utils_zan = zan;
    // 启动赞
    zan.start($('.theme-share .zan a'), {
        id: $("#theme_id").val()
    });
});*/
/*
 * 收藏主题
 */
$(function() {
    // 发送参数：处理地址，收藏的主题id
    // 请求处理函数
    var collectTheme = {};
    collectTheme.getEle = null;
    collectTheme.action = '/th/json.php?do=Act.Mo';
    collectTheme.resCallback = function(data) {
        var message = data.message;
        if (data.code === 200) {
            // 收藏成功
            if (message.collect) {
                collectTheme.getEle.addClass('current');
            }
            // 取消成功
            if (message.cancel) {
                collectTheme.getEle.removeClass('current');
            }
        }
    };
    // 请求发送
    collectTheme.req = function(opts, callback) {
        var self = this;
        $.post(self.action, opts, function(data) {
            callback(data);
        });
    };
    collectTheme.start = function(ele, opts) {
        var self = this;
        this.getEle = ele;
        ele.on('click', function(e) {
            e.preventDefault(); !! utils_userStatus.loginTipsy() && self.req(opts, self.resCallback);
        });
    };
    // 对外暴露接口
    window.utils_collectTheme = collectTheme;

    collectTheme.start($('.theme-share .collect a'), {
        id: $("#theme_id").val()
    });
});
/* 分享监听 */
$(function() {
    var postData = function(opts) {
        // 若用户没有登录，啥也不做
        if (!utils_userStatus.isLogin()) {
            return false;
        }
        $.post(opts.action, {
            userId: opts.userId,
            themeId: opts.themeId
        }).done(function(data) {

        }).fail(function(err) {

        });
    };
    $('#bdshare').on('click', 'a.share-btn', function() {
        postData({
            action: '/th/json.php?do=Act.Share',
            userId: $_conf['uid'],
            themeId: $('#theme_id').val()
        });
    });
});