/*验证用户注册*/
$(function() {
    /*验证初始化*/
    checkObj.initialize($('#J-register-module').find('form'), {
        regEmail: $('#reg-email'),
        regUsername: $('#reg-username'),
        setPwd: $('#set-pwd'),
        confirmPwd: $('#confirm-pwd'),
        protocal: $('#protocal-ckb')
    }, {
        regEmail: {
            'isRequired': true,
            tips: '电子邮件是你找回密码的唯一途径',
            defaultValidate: ['isEmail'],
            ajaxValidate: {
                validate: function(val) {
                    var flag = false,
                        that = this;
                    $.ajax({
                        url: '/th/json.php?do=User.Check',
                        type: 'get',
                        data: 'value=' + val + '&type=email',
                        async: false,
                        success: function(res) {
                            if (res.code === 403) {
                                flag = false;
                                that.message = res.message;
                            } else {
                                flag = true;
                            }
                        }
                    });
                    return flag;
                },
                message: ''
            }
        },
        regUsername: {
            'isRequired': true,
            tips: '用户名为2-16位的中文、英文或者数字',
            defaultValidate: ['isUserName'],
            ajaxValidate: {
                validate: function(val) {
                    var flag = false,
                        that = this;
                    val = encodeURIComponent(val); // fix IE bug
                    $.ajax({
                        url: '/th/json.php?do=User.Check',
                        type: 'get',
                        async: false,
                        data: 'value=' + val + '&type=username',
                        success: function(res) {
                            if (res.code === 402) {
                                flag = false;
                                that.message = res.message;
                            } else {
                                flag = true;
                            }
                        }
                    });
                    return flag;
                },
                message: ''
            }
        },
        setPwd: {
            'isRequired': true,
            tips: '6-16位字符，可由数字、字母组成',
            defaultValidate: ['isPassword']
        },
        confirmPwd: {
            'isRequired': true,
            tips: '6-16位字符，可由数字、字母组成',
            defaultValidate: ['isPassword'],
            isSame: {
                validate: function(val) {
                    return $('#set-pwd').val() === $('#confirm-pwd').val();
                },
                message: '密码不一致'
            }
        },
        protocal: {
            'isRequired': true,
            tips: '',
            isChecked: {
                validate: function(val) {
                    return $('#protocal-ckb:checked').length;
                },
                message: '请选择协议'
            }
        }
    }, function(e) {
        e.preventDefault();
        var submitBtn = $('#J-register-module .form-submit');
        submitBtn.attr('disabled', true).val('正在申请中...');
        $.post('/th/json.php?do=User.Register', {
            'email': $('#reg-email').val(),
            'username': $('#reg-username').val(),
            'password': $('#set-pwd').val()
        }, function(data) {
            if (data.code === 200) {
                //$('#J-register-module').find('form').get(0).submit();
                submitBtn.attr('disabled', true).val('申请成功!');
                setTimeout(function() {
                    var gotoHref = data.data.forward ? data.data.forward : '/';
                    window.location.href = gotoHref;
                }, 1500);
            } else {
                alert(data.message);
            }
        });
    });
    $('#protocal-ckb').click(function() {
        if ($(this).attr('checked') === 'checked') {
            $(this).parents('.form-item').find('.error').text('').hide();
        } else {
            $(this).parents('.form-item').find('.error').text('请选择协议').show();
        }
    });
});