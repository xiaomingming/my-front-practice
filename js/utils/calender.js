/*
 * author:leweiming
 * gmail:xmlovecss 艾特 gmail dot com
 * 简单的日历插件
 * 个人练习
 * example:
 */

;
(function(window, $, undefined) {
    var my = {},
        constructorFunName = 'EasyCalender',
        pluginName = 'easyCalender';

    my[constructorFunName] = function(dateText, options) {
        var settings = $.extend({}, $.fn[pluginName].defaults, options);
        this.tableTmp = [
            '<table class="easy-calender-table"><thead class="easy-calender-header">',
            '</thead>',
            '</table>'
        ];
        this.calenderHeaderTmp = [
            '<tr class="date-title">',
            '<th class="prev"><<</th>',
            '<th colspan="2" class="date-switch"></th>',
            '<th class="next">>></th>',
            '</tr>'
        ];
        // 天天头部模板
        this.daysHeaderTmp = [
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
        this.dateInput = dateText;
        this.dateFormat = settings.dateFormat;
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
        // 获取当前年月日
        getNow: function() {
            var d = new Date();
            return {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                date: d.getDate(),
                day: d.getDay()
            }
        },
        //获取每月开始星期
        getMonthStartDay: function(year, month) {
            return new Date(year, month - 1, 1).getDay();
        },
        // 判断闰年
        isLeapYear: function(year) {
            return new Date(year, 2, 0).getDate() === 29;
        },
        // 获取每月天数
        getMonthDays: function(year, month) {
            return [31, (this.isLeapYear(year)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
        },
        // 渲染年份
        renderYears: function(year, month, date) {
            year = year || this.getNow().year;
            month = month || this.getNow().month,
            date = date || this.getNow().date;

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
        },
        // 渲染月份
        renderMonths: function(year, month, date) {
            var currentMonth;
            var tmp = '<tbody>',
                i, j, monthsMap = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            if (!month) {
                month = new Date().getMonth() + 1;
            }
            for (i = 0; i < 3; i++) {
                tmp += '<tr>';
                for (j = 0; j < 4; j++) {
                    currentMonth = 4 * i + (j + 1);
                    if (((i * 4) + j + 1) === month) {
                        tmp += '<td class="current" data-month="' + currentMonth + '">' + monthsMap[(i * 4) + j] + '</td>';
                    } else {
                        tmp += '<td data-month="' + currentMonth + '">' + monthsMap[(i * 4) + j] + '</td>';
                    }
                }
                tmp += '</str>';
            }
            tmp += '</tbody>';
            return tmp;
        },
        // 渲染天
        renderMonthOfDays: function(year, month, date) {
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
        },
        // 天天面板
        setDaysPanelCont: function(year, month, date) {
            var prev = month,
                next = month;

            year = year || this.getNow().year;
            month = month || this.getNow().month,
            date = date || this.getNow().date;
            var tablePanel = this.tableTmp[0];
            this.calenderHeaderTmp[2] = '<th colspan="5" class="date-switch" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '">' + year + '/' + month + '</th>';
            tablePanel += this.calenderHeaderTmp.join('') + this.daysHeaderTmp.join('') + this.tableTmp[1];
            tablePanel += this.renderMonthOfDays(year, month, date) + this.tableTmp[2];
            return tablePanel;
        },
        // 月月面板
        setMonthsPanelCont: function(year, month, date) {
            year = year || this.getNow().year;
            month = month || this.getNow().month,
            date = date || this.getNow().date;

            var tablePanel = this.tableTmp[0];
            this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '">' + year + '</th>';
            tablePanel += this.calenderHeaderTmp.join('') + this.tableTmp[1];
            tablePanel += this.renderMonths(year, month, date) + this.tableTmp[2];
            return tablePanel;
        },
        // 获取年范围
        getYearsScope: function(year) {
            var startYear = year - (year % 10),
                endYear = startYear + 9;
            return {
                start: startYear,
                end: endYear
            }
        },
        // 年年面板
        setYearsPanelCont: function(year, month, date) {

            year = year || this.getNow().year;
            month = month || this.getNow().month,
            date = date || this.getNow().date;

            var tablePanel = this.tableTmp[0],
                yearScope = this.getYearsScope(year);
            this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '">' + yearScope.start + '-' + yearScope.end + '</th>';
            tablePanel += this.calenderHeaderTmp.join('') + this.tableTmp[1];
            tablePanel += this.renderYears(year, month, date) + this.tableTmp[2];

            return tablePanel;
        },
        blurEvent: function() {
            var me = this;
            $('body').off('click').on('click', function(e) {
                if (!$(e.target).parents('table').hasClass('easy-calender-table')) {
                    me.calenderContainer.hide();
                }
            });
        },
        // 日期格式化
        formatInputDate: function(formatStr, dateObj) {
            // dateObj={year:year,month:month,date:date}
            // default format: yyyy/m/d
            var formated = '',
                conactChar = '';
            formatStr = formatStr.toLowerCase();

            if (formatStr.match(/yy/g).length === 1) {
                dateObj.year += '';
                dateObj.year = dateObj.year.substring(dateObj.year.length - 2);
            }
            if (formatStr.indexOf('mm') !== -1) {
                (Number(dateObj.month) < 10) && (dateObj.month = '0' + dateObj.month);
            }
            if (formatStr.indexOf('dd') !== -1) {
                (Number(dateObj.date) < 10) && (dateObj.date = '0' + dateObj.date);
            }
            if (formatStr.indexOf('/') !== -1) {
                conactChar = '/';
            } else if (formatStr.indexOf('-') !== -1) {
                conactChar = '-';
            }
            return dateObj.year + conactChar + dateObj.month + conactChar + dateObj.date;
        },
        inputEvent: function() {
            var me = this;
            // 日历显示和隐藏
            me.dateInput.on('click', function(e) {
                e.stopPropagation();
                me.startRender();
            });
            return this;
        },
        startRender: function() {
            var me = this;
            me.renderDateTable();
            // here should bind all events of table calender
            me.blurEvent.call(me);
            me.daysCalender = me.calenderContainer.find('.calender-days');
            me.monthsCalender = me.calenderContainer.find('.calender-months');
            me.yearsCalender = me.calenderContainer.find('.calender-years');
            me.daysEvent.call(me);
            me.monthsEvent.call(me);
            me.yearsEvent.call(me);
        },
        daysEvent: function() {
            var me = this;
            me.daysCalender.on('click', 'thead .date-title th', function() {
                var that = $(this),
                    dateSwitch = that.siblings('.date-switch');

                thisMonth = dateSwitch.data('month'),
                thisYear = dateSwitch.data('year');
                // thisMonth = me.calenderContainer.data().month;
                // thisYear = me.calenderContainer.data().year;

                if (that.hasClass('prev')) {
                    me.prevMonth(thisYear, thisMonth);
                    me.calenderContainer.show();
                } else if (that.hasClass('next')) {
                    me.nextMonth(thisYear, thisMonth);
                    me.calenderContainer.show();
                } else if (that.hasClass('date-switch')) {
                    me.calenderContainer.find('.calender-months').show().siblings('div').hide();
                }
            });
            // tbody事件绑定
            me.daysCalender.on('click', 'table tbody td', function() {
                var dateSwitch = $(this).parents('table').find('thead .date-switch'),
                    thisMonth = dateSwitch.data('month'),
                    thisYear = dateSwitch.data('year'),
                    selectedDate = $(this).text(),
                    prevMonthObj, nextMonthObj;
                if ($(this).hasClass('prev-days')) {
                    prevMonthObj = me.prevMonth(thisYear, thisMonth, selectedDate);
                    me.calenderContainer.show();
                    me.dateInput.val(me.formatInputDate(me.dateFormat, prevMonthObj));
                } else if ($(this).hasClass('next-days')) {
                    nextMonthObj = me.nextMonth(thisYear, thisMonth, selectedDate);
                    me.calenderContainer.show();
                    me.dateInput.val(me.formatInputDate(me.dateFormat, nextMonthObj));
                } else {
                    me.calenderContainer.find('table tbody td').removeClass('current');
                    $(this).addClass('current');
                    // me.rememberDate(thisYear, thisMonth, selectedDate);
                    me.dateInput.val(me.formatInputDate(me.dateFormat, {
                        year: thisYear,
                        month: thisMonth,
                        date: selectedDate
                    }));
                }
            });
        },
        prevMonth: function(year, month, date) {
            month--;
            if (month <= 0) {
                month = 12;
                year -= 1;
            }
            // this.rememberDate(year, month, date);
            this.daysCalender.html(this.setDaysPanelCont(year, month, date));
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
            // this.rememberDate(year, month, date);
            this.daysCalender.html(this.setDaysPanelCont(year, month, date));
            return {
                year: year,
                month: month,
                date: date
            }
            // this.calenderContainer.show();
        },
        monthsEvent: function() {
            var me = this;
            // 头部事件绑定
            me.monthsCalender.on('click', 'thead th', function() {
                var that = $(this),
                    thisYear = that.parents('thead').find('.date-switch').data('year'),
                    thisMonth = that.parents('table').find();
                if (that.hasClass('prev')) {
                    (thisYear > 0) && thisYear--;
                    me.monthsCalender.html(me.setMonthsPanelCont(thisYear));
                } else if (that.hasClass('next')) {
                    thisYear++;
                    me.monthsCalender.html(me.setMonthsPanelCont(thisYear));
                } else if (that.hasClass('date-switch')) {
                    me.yearsCalender.html(me.setYearsPanelCont(thisYear));
                }
            });
            // 体事件绑定
            me.monthsCalender.on('click', 'tbody td', function() {
                var that = $(this),
                    thisMonth = that.text();
                that.parents('tbody').find('td').removeClass('current');
                that.addClass('current');
            });
        },
        yearsEvent: function() {

        },
        rememberDate: function(year, month, date) {
            var me = this;
            dateData = this.calenderContainer.data({
                year: year || me.getNow().year,
                month: month || me.getNow().month,
                date: date || me.getNow().date
            });
            return dateData;
        },
        // 插入显示表格
        renderDateTable: function() {
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
                this.rememberDate();
                this.calenderContainer.find('.calender-days').html(this.setDaysPanelCont());
                this.calenderContainer.find('.calender-months').html(this.setMonthsPanelCont());
                this.calenderContainer.find('.calender-years').html(this.setYearsPanelCont());

            }
            this.setDateTablePosition();

            $('.easy-calender').show().find('.calender-days').show().siblings('div').hide();
        },
        // 设置包含块的位置
        setDateTablePosition: function() {
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
        'dateFormat': 'yyyy/m/d'
    };
})(window, jQuery);