$(function() {
    $("#theme_list").theme({
        del: true,
        updata: true,
        edit: true,
        digest: true,
        allSelect: true,
        type: 'Theme',
        getIds: true
    });
    $(".edit_button").bind('click', function(e) {
        e.preventDefault();
        var currentRow = $(this).parents('tr'),
            currentRowItems = currentRow.find('td'),
            firstColCache = currentRowItems.eq(0),

            titles = $.trim(firstColCache.text()), //英文主题
            tags = currentRowItems.eq(4).attr('data-tags'), //英文标签

            cnTitles = $.trim(currentRowItems.eq(1).text()), //中文主题
            cnTags = currentRowItems.eq(5).attr('data-tags'), //中文标签

            descText = currentRow.attr('data-desc'); //英文描述
        cnDescText = currentRow.attr('data-desc-cn'); //英文描述

        themeTag = $('#theme_title').find('input'), //英文主题元素
        themeCate = $('#theme_assort').find('input'), //英文标签元素

        cnThemeTag = $('#cn_theme_title').find('input'), //中文主题元素
        cnThemeCate = $('#cn_theme_assort').find('input'), //中文标签元素

        themeDesc = $('#theme_desc').find('textarea'); //英文描述元素
        cnThemeDesc = $('#cn_theme_desc').find('textarea'); //中文描述元素

        id = $(this).parents('tr').attr('data-id');

        themeTag.val(titles);
        themeCate.val(tags);

        cnThemeTag.val(cnTitles);
        cnThemeCate.val(cnTags);

        themeDesc.val(descText);
        cnThemeDesc.val(cnDescText);

        $.mxt.dialog({
            title: '主题编缉',
            width: 400,
            height: 460,
            buttons: {
                '取消': function() {
                    $('#dialog_edit').dialog('close');
                },
                '确定': function() {
                    titles = $.trim(themeTag.val());
                    tags = $.trim(themeCate.val());
                    descText = $.trim(themeDesc.val());
                    $.post('?do=Theme.Desktop.Edit&format=json', {
                        ids: id,
                        title: titles,
                        tags: tags,
                        desc: descText
                    }, function(data) {
                        if (data.code == 200) {
                            alert('操作成功');
                            location.reload();
                        }
                    })
                }
            }
        }, $('#dialog_edit'));
    });
    $(".deldig").bind('click', function(e) {
        e.preventDefault();
        var id = $(this).parents('tr').attr('data-id');
        $.mxt.dialog({
            title: '主题删除',
            width: 300,
            height: 200,
            buttons: {
                '取消': function() {
                    $('#dialog_edit').dialog('close');
                },
                '确定': function() {
                    $.post('?do=Theme.Desktop.Del&format=json', {
                        ids: id
                    }, function(data) {
                        if (data.code == 200) {
                            alert('操作成功');
                            location.reload();
                        }
                    })
                }
            }
        }, $('#dialog_delete'));
    });
});