/*
 * author:leweiming
 * gmail:xmlovecss 艾特 gmail dot com
 * 简单的日历插件
 * 个人练习
 * example:
 */

;
(function(window, $, undefined) {
    // $(function(){
    var myCalender = {};
    // 日历模板
    // 公用模板头
    myCalender.tableTmp = [
        '<table class="easy-calender-table"><thead class="easy-calender-header">',
        '</thead>',
        '</table>'
    ];
    myCalender.calenderHeaderTmp = [
        '<tr class="date-title">',
        '<th class="prev"><<</th>',
        '<th colspan="2" class="date-switch"></th>',
        '<th class="next">>></th>',
        '</tr>'
    ];
    // 天天头部模板
    myCalender.daysHeaderTmp = [
        '<tr class="week-title">',
        '<th>日</th>',
        '<th>一</th>',
        '<th>二</th>',
        '<th>三</th>',
        '<th>四</th>',
        '<th>五</th>',
        '<th>六</th>',
        '</tr>'
    ];

    // 格式化年月日
    myCalender.formatDate = function(date, formatStr) {
        var fomatedStr = '';
        switch (formatStr) {
            case 'yy/mm/dd':
                break;
        }
        return formated;
    };
    // 获取当前年月日
    myCalender.getNow = function() {
        var d = new Date();
        return {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            date: d.getDate(),
            day: d.getDay()
        }
    };
    //获取每月开始星期
    myCalender.getMonthStartDay = function(year, month) {
        return new Date(year, month - 1, 1).getDay();
    };
    // 判断闰年
    myCalender.isLeapYear = function(year) {
        return new Date(year, 2, 0).getDate() === 29;
    };
    // 获取每月天数
    myCalender.getMonthDays = function(year, month) {
        return [31, (this.isLeapYear(year)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
    };
    // 渲染年份
    myCalender.renderYears = function(year, month) {
        // 
        var tmp = '<tbody>',
            i, j, yearScope = this.getYearsScope(year),
            start = yearScope.start - 1;
        for (i = 0; i < 3; i++) {
            tmp += '<tr>';
            for (j = 0; j < 4; j++) {
                if (start === year) {
                    tmp += '<td class="current">' + (start++) + '</td>';
                } else {
                    tmp += '<td>' + (start++) + '</td>';
                }
            }
            tmp += '</tr>';
        }
        tmp += '</tbody>';
        return tmp;
    };
    // 渲染月份
    myCalender.renderMonths = function(year, month) {
        year = year || this.getNow.year;
        month = month || this.getNow.month;
        var tmp = '<tbody>',
            i, j, monthsMap = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        if (!month) {
            month = new Date().getMonth() + 1;
        }
        for (i = 0; i < 3; i++) {
            tmp += '<tr>';
            for (j = 0; j < 4; j++) {
                if (((i * 4) + j + 1) === month) {
                    tmp += '<td class="current">' + monthsMap[(i * 4) + j] + '</td>';
                } else {
                    tmp += '<td>' + monthsMap[(i * 4) + j] + '</td>';
                }
            }
            tmp += '</str>';
        }
        tmp += '</tbody>';
        return tmp;
    };
    // 渲染天
    myCalender.renderMonthOfDays = function(year, month, date) {
        var i,
            j,
            days = 0, //本月开始日期
            nextdays = 1, //下一个月的开始日期
            sRows = '<tbody>',
            prevYear = year,
            prevMonth = month - 1;
        date = Number(date);
        if (!prevMonth) {
            prevYear = year - 1;
            prevMonth = 12;
        }
        var prevMonthOfDays = this.getMonthDays(prevYear, prevMonth),
            thisMonthOfDays = this.getMonthDays(year, month);

        var thisMonthStartDay = this.getMonthStartDay(year, month) ? this.getMonthStartDay(year, month) : 7;

        var prevStartDay = prevMonthOfDays - thisMonthStartDay + 1;
        for (i = 0; i < 6; i++) {
            sRows += '<tr>';
            for (j = 0; j <= 6; j++) {
                // 先渲染前一个月的月末部分日期
                // 再渲染本月日期
                // 后渲染下一个月月初日期

                if (i === 0 && j < thisMonthStartDay) {
                    // 前一个月
                    sRows += '<td class="prev-days">' + (prevStartDay++) + '</td>';
                } else if (days < thisMonthOfDays) {
                    // 当前月
                    if (days + 1 === date) {
                        sRows += '<td class="current-days current">' + (++days) + '</td>';
                    } else {
                        sRows += '<td class="current-days">' + (++days) + '</td>';
                    }
                } else {
                    sRows += '<td class="next-days">' + (nextdays++) + '</td>';
                }
            }
            sRows += '</tr>';
        }
        sRows += '</tbody>';
        return sRows;
    };
    // 天天面板
    myCalender.setDaysPanelCont = function(year, month, date) {
        var prev = month,
            next = month;
        year = !year ? this.getNow().year : year;
        month = !month ? this.getNow().month : month,
        date = date || this.getNow().date;
        var tablePanel = this.tableTmp[0];
        this.calenderHeaderTmp[2] = '<th colspan="5" class="date-switch" data-year="' + year + '" data-month="' + month + '">' + year + '/' + month + '</th>';
        tablePanel += this.calenderHeaderTmp.join('') + this.daysHeaderTmp.join('') + this.tableTmp[1];
        tablePanel += this.renderMonthOfDays(year, month, date) + this.tableTmp[2];
        return tablePanel;
    };
    // 月月面板
    myCalender.setMonthsPanelCont = function(year) {
        year = year || this.getNow().year;
        var tablePanel = this.tableTmp[0];
        this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch">' + year + '</th>';
        tablePanel += this.calenderHeaderTmp.join('') + this.tableTmp[1];
        tablePanel += this.renderMonths(year) + this.tableTmp[2];
        // console.log(tablePanel);
        /*$('#calender').html(tablePanel);
        $('#calender thead .prev').off('click').on('click', function() {
            // 更改显示年月
            year -= 1;
            myCalender.setMonthsPanelCont(year);
        });
        $('#calender thead .next').off('click').on('click', function() {
            // 更改显示年月
            year += 1;
            myCalender.setMonthsPanelCont(year);
        });
        $('#calender thead .date-switch').off('click').on('click', function() {
            myCalender.setYearsPanelCont(year);
        });*/
        return tablePanel;
    };
    // 获取年范围
    myCalender.getYearsScope = function(year) {
        var startYear = year - (year % 10),
            endYear = startYear + 9;
        return {
            start: startYear,
            end: endYear
        }
    };
    // 年年面板
    myCalender.setYearsPanelCont = function(year) {
        year = year || new Date().getFullYear();
        var tablePanel = this.tableTmp[0],
            yearScope = this.getYearsScope(year);
        this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch">' + yearScope.start + '-' + yearScope.end + '</th>';
        tablePanel += this.calenderHeaderTmp.join('') + this.tableTmp[1];
        tablePanel += this.renderYears(year) + this.tableTmp[2];
        /*$('#calender').html(tablePanel);
        $('#calender thead .prev').off('click').on('click', function() {
            // 更改显示年月
            yearScope.start -= 10;
            myCalender.setYearsPanelCont(yearScope.start);
        });
        $('#calender thead .next').off('click').on('click', function() {
            // 更改显示年月
            yearScope.start += 10;
            myCalender.setYearsPanelCont(yearScope.start);
        });*/
        return tablePanel;
    };
    // 对外暴露该接口
    window.myCalender = myCalender;
    // 
    var my = {},
        constructorFunName = 'EasyCalender',
        pluginName = 'easyCalender';

    my[constructorFunName] = function(dateText, options) {
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        this.dateInput = dateText;
        // 初始化
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        // 滚动初始化
        init: function() {
            this.inputEvent();
            return this;
        },
        blurEvent: function(self) {
            // console.log('blur event');
            $('body').off('click').on('click', function(e) {
                if (!$(e.target).parents('table').hasClass('easy-calender-table')) {
                    self.calenderContainer.hide();
                }
            });
        },
        // 日期格式化
        formatInputDate: function(formatStr, dateObj) {
            /*var formated = '';
            switch (formatStr) {
                case 'yyyy/mm/dd':
                    formated =
            }*/
        },
        inputEvent: function() {
            var self = this;
            // 日历显示和隐藏
            self.dateInput.on('click', function(e) {
                e.stopPropagation();
                self.renderDateTable(e);
                // here should bind all events of table calender
                self.blurEvent(self);
                self.daysCalender = self.calenderContainer.find('.calender-days');
                self.monthsCalender = self.calenderContainer.find('.calender-months');
                self.yearsCalender = self.calenderContainer.find('.calender-years');
                self.daysEvent(self);
                self.monthsEvent(self);
            });
            return this;
        },
        daysEvent: function(self) {
            self.daysCalender.on('click', 'thead .date-title th', function() {
                var that = $(this),
                    dateSwitch = that.siblings('.date-switch'),

                    thisMonth = dateSwitch.data('month'),
                    thisYear = dateSwitch.data('year');

                if (that.hasClass('prev')) {
                    self.prevMonth(thisYear, thisMonth);
                    self.calenderContainer.show();
                } else if (that.hasClass('next')) {
                    self.nextMonth(thisYear, thisMonth);
                    self.calenderContainer.show();
                }
            });
            // tbody事件绑定
            self.daysCalender.on('click', 'table tbody td', function() {
                var dateSwitch = $(this).parents('table').find('thead .date-switch'),
                    thisMonth = dateSwitch.data('month'),
                    thisYear = dateSwitch.data('year'),
                    selectedDate = $(this).text(),
                    prevMonthObj, nextMonthObj;
                if ($(this).hasClass('prev-days')) {
                    prevMonthObj = self.prevMonth(thisYear, thisMonth, selectedDate);
                    self.calenderContainer.show();
                    self.dateInput.val(prevMonthObj.year + '/' + prevMonthObj.month + '/' + selectedDate);
                } else if ($(this).hasClass('next-days')) {
                    nextMonthObj = self.nextMonth(thisYear, thisMonth, selectedDate);
                    self.calenderContainer.show();
                    self.dateInput.val(nextMonthObj.year + '/' + nextMonthObj.month + '/' + selectedDate);
                } else {
                    self.calenderContainer.find('table tbody td').removeClass('current');
                    $(this).addClass('current');
                    self.dateInput.val(thisYear + '/' + thisMonth + '/' + selectedDate);
                }
            });
        },
        prevMonth: function(year, month, date) {
            month--;
            if (month <= 0) {
                month = 12;
                year -= 1;
            }
            this.daysCalender.html(myCalender.setDaysPanelCont(year, month, date));
            return {
                year: year,
                month: month,
                date: date
            }
            // this.calenderContainer.show();
        },
        nextMonth: function(year, month, date) {
            month++;
            if (month > 12) {
                month = 1;
                year += 1;
            }
            this.daysCalender.html(myCalender.setDaysPanelCont(year, month, date));
            return {
                year: year,
                month: month,
                date: date
            }
            // this.calenderContainer.show();
        },
        monthsEvent: function() {

        },
        yearsEvent: function() {

        },
        // 插入显示表格
        renderDateTable: function(e) {
            var tmp = [''];
            if (!$('.easy-calender').length) {
                tmp = ['<div class="easy-calender">',
                    '<div class="calender-days"></div>',
                    '<div class="calender-months"></div>',
                    '<div class="calender-years"></div>',
                    '</div>'
                ].join('');
                $('body').append(tmp);
                this.calenderContainer = $('.easy-calender');
                $('.easy-calender').find('.calender-days').html(myCalender.setDaysPanelCont());
                $('.easy-calender').find('.calender-months').html(myCalender.setMonthsPanelCont());
                $('.easy-calender').find('.calender-years').html(myCalender.setYearsPanelCont());
            }
            this.setDateTablePosition(e);

            $('.easy-calender').show();
        },
        // 设置包含块的位置
        setDateTablePosition: function(e) {
            var pos = this.getDateInputPosition(),
                model = this.getDateInputBoxModel();
            $('.easy-calender').css({
                'left': pos.left + 'px',
                'top': pos.top + model.height + 4 + 'px'
            });
            return this;
        },
        // 获取日期输入框的位置
        getDateInputPosition: function() {
            var pos = this.dateInput.offset();
            return pos;
        },
        getDateInputBoxModel: function() {
            return {
                width: this.dateInput.outerWidth(),
                height: this.dateInput.outerHeight()
            }
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
        'dateFormat': 'yyyy/mm/dd'
    };
})(window, jQuery);