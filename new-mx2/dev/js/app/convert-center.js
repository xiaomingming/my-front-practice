// tab切换
require(['jquery'], function($) {
    $(function() {
        var $convertTab = $('#convert-tab'),
            $convertCont = $('#convert-cont');
        $convertTab.on('click', 'a', function(e) {
            e.preventDefault();
            var index = $(this).index();
            $convertCont.find('.convert-cont-item').eq(index).show().siblings().hide();
        });
    });
});
// 升级配置
require(['jquery', 'easyDialog'], function($, dialog) {
    // 此处尚未进行积分和升级的配置
    $(function() {
        var $upgradeBtn = $('#upgrade-btn'),
            level = $upgradeBtn.data('level'),
            reach = $upgradeBtn.data('reach'),
            need = $upgradeBtn.data('need');
        if (reach < need) {
            $upgradeBtn.attr('disabled', 'disabled').addClass('upgrade-disabled');
            return false;
        }
        var updateDialog = function() {
            $('#upgrade-dialog').easyDialog({
                'cWidth': 460,
                'cHeight': 204,
                'dTitle': '',
                'dContentTmp': '<p class="tip">是否消耗<span class="t1">' + need + '</span>积分，升级至<span class="t1">Lv' + level + '</span></p>',
                'dCloseTxt': '×',
                'dOKVal': '确定升级',
                'OK': function() {
                    var target = window.location.href;
                    // 发送请求
                    $.post('/th/json.php?do=User.Upgrade.Upgrade', {})
                        .done(function(data) {
                            if (data.data === 200) {
                                window.location.href = target;
                            }
                        }).fail(function(err) {

                        });

                }
            });
        };
        $('#upgrade-btn').on('click', updateDialog);
    });
});
// 兑换配置
/*require(['jquery', 'easyDialog'], function($, dialog) {
    $(function() {
        var getRewardDialog = function(opts) {
            $('#get-reward-dialog').easyDialog({
                'cWidth': 460,
                'cHeight': 298,
                'dTitle': '',
                dContentTmp: ['<div class="get-reward-cont">',
                    '<p class="reward-tip1">是否消耗<span>' + opts.scores + '</span>积分兑换<span>' + opts.rewardName + '</span></p>',
                    '<div class="present-to">',
                    '<p class="frm-item"><label for="user-name">姓名：</label><input type="text" id="user-name" /></p>',
                    '<p class="frm-item"><label for="user-call">联系电话：</label><input type="text" id="user-call" /></p>',
                    '<p class="frm-item"><label for="user-address">收件地址：</label><input type="text" id="user-address" /></p>',
                    '</div>',
                    '<div class="reward-tip2">',
                    '<h3>温馨提醒：</h3>',
                    '<p>请您务必认真填写地址及收件人信息，如果由于没有填写地址或 者信息不正确导致无法发货，视为用户放弃奖品，责任由用户本人承担。</p>',
                    '</div>',
                    '</div>'
                ].join(''),
                'dCloseTxt': '×',
                'dOKVal': '确定兑换',
                OK: function() {
                    // 确认回调
                    var uName = encodeURIComponent($('#user-name').val()),
                        uCall = $('#user-call').val(),
                        uAddress = encodeURIComponent($('#user-address').val());
                    // console.log(uName,uCall,uAddress);
                    $.get(opts.action, {
                        name: uName,
                        call: uCall,
                        address: uAddress
                    }).done(function(data) {
                        alert('success');
                    }).fail(function(data) {
                        alert('failed');
                    });
                }
            });
        };
        var getReward = function() {
            $('.presents-list>ul').on('click', '.presents-item .convert-abled', function(e) {
                e.preventDefault();
                getRewardDialog({
                    'scores': 1000,
                    'rewardName': '无色香炉',
                    'action': 'http://www.baidu.com'
                });
            });
        };
        getReward();
    });
});*/