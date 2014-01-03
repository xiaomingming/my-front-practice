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

    my[constructorFunName] = function(dateEle, options) {
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
        this.type = settings.type;
        this.dateInput = dateEle;
        this.dateFormat = settings.dateFormat;

        // 初始化
        this.init();
    };
    my[constructorFunName].prototype = {
        constructor: my[constructorFunName],
        // 滚动初始化
        init: function() {
            var me = this;
            this.e_inputEvent().e_bodyEvent();
            this.v_startRender();
            return this;
        },
        // 获取当前年月日
        u_getNow: function() {
            var d = new Date();
            return {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                date: d.getDate(),
                day: d.getDay()
            }
        },
        //获取每月开始星期
        u_getMonthStartDay: function(year, month) {
            return new Date(year, month - 1, 1).getDay();
        },
        // 判断闰年
        u_isLeapYear: function(year) {
            return new Date(year, 2, 0).getDate() === 29;
        },
        // 获取年范围
        u_getYearsScope: function(year) {
            var startYear = year - (year % 10),
                endYear = startYear + 9;
            return {
                start: startYear,
                end: endYear
            }
        },
        // 获取每月天数
        u_getMonthDays: function(year, month) {
            return [31, (this.u_isLeapYear(year)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
        },
        // 日期格式化
        u_formatInputDate: function(formatStr, dateObj) {
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
        // 获取当前月份面板中的日期对象
        // 包括前一个月尾，当前月份，下一个月的开头
        u_getPanelDates: function(year, month, date) {
            // year,month,date需要是number类型
            // 得考虑下，如何在调用传参的源头进行转换
            var u_prevMonth = month - 1,
                prevYear = year;
            // 对前一个月的判断
            if (!u_prevMonth) {
                prevYear = year - 1;
                u_prevMonth = 12;
            }
            // 获取前一个月，当前月份的天数
            var u_prevMonthOfDays = this.u_getMonthDays(prevYear, u_prevMonth),
                thisMonthOfDays = this.u_getMonthDays(year, month),
                thisMonthStartDate = this.u_getMonthStartDay(year, month) ? this.u_getMonthStartDay(year, month) : 7, //获取本月是星期几，若是周日，则上个月的日期天数为7天
                prevStartDate = u_prevMonthOfDays - thisMonthStartDate + 1; //前一个月的开始日子

            var u_prevMonthDaysArr = [],
                thisMonthDaysArr = [],
                u_nextMonthDaysArr = [];
            for (; prevStartDate <= u_prevMonthOfDays; prevStartDate++) {
                u_prevMonthDaysArr.push(prevStartDate);
            }
            for (var i = 1; i <= thisMonthOfDays; i++) {
                thisMonthDaysArr.push(i);
            }
            for (var i = 1, j = 42 - thisMonthOfDays - thisMonthStartDate; i <= j; i++) {
                u_nextMonthDaysArr.push(i);
            }
            var dates = u_prevMonthDaysArr.concat(thisMonthDaysArr).concat(u_nextMonthDaysArr);
            return {
                prevLen: thisMonthStartDate,
                thisLen: thisMonthOfDays,
                nextLen: j,
                dates: dates
            }
        },
        u_prevMonth: function(year, month, date) {
            month--;
            if (month <= 0) {
                month = 12;
                year -= 1;
            }
            // this.rememberDate(year, month, date);
            this.daysCalender.html(this.v_setDaysPanelCont(year, month, date));
            return {
                year: year,
                month: month,
                date: date
            }
            // this.calenderContainer.show();
        },
        u_nextMonth: function(year, month, date) {
            month++;
            if (month > 12) {
                month = 1;
                year += 1;
            }
            // this.rememberDate(year, month, date);
            this.daysCalender.html(this.v_setDaysPanelCont(year, month, date));
            return {
                year: year,
                month: month,
                date: date
            }
            // this.calenderContainer.show();
        },
        // 渲染start
        v_startRender: function() {
            var me = this;
            me.v_renderDateTablet();
            // here should bind all events of table calender
            // me.e_blurEvent.call(me);
            me.daysCalender = me.calenderContainer.find('.calender-days');
            me.monthsCalender = me.calenderContainer.find('.calender-months');
            me.yearsCalender = me.calenderContainer.find('.calender-years');
            me.e_daysEvent.call(me);
            me.e_monthsEvent.call(me);
            me.e_yearsEvent.call(me);
        },
        // 渲染年份
        v_renderYears: function(year, month, date) {
            year = year || this.u_getNow().year;
            month = month || this.u_getNow().month,
            date = date || this.u_getNow().date;

            var tmp = '<tbody>',
                i, j, yearScope = this.u_getYearsScope(year),
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
        v_renderMonths: function(year, month, date) {
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
        // 早期的renderMonthOfDays方法，特点是效率高，缺点是没有分开逻辑层和渲染层
        v_oldRenderMonthOfDays: function(year, month, date) {
            /*var i,
                j,
                days = 0, //本月开始日期
                nextdays = 1, //下一个月的开始日期
                sRows = '<tbody>',
                prevYear = year,
                u_prevMonth = month - 1;
            date = Number(date);
            if (!u_prevMonth) {
                prevYear = year - 1;
                u_prevMonth = 12;
            }
            var u_prevMonthOfDays = this.u_getMonthDays(prevYear, u_prevMonth),
                thisMonthOfDays = this.u_getMonthDays(year, month);

            var thisMonthStartDay = this.u_getMonthStartDay(year, month) ? this.u_getMonthStartDay(year, month) : 7;

            var prevStartDay = u_prevMonthOfDays - thisMonthStartDay + 1;
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
            return sRows;*/
        },
        // 渲染天
        v_renderMonthOfDays: function(year, month, date) {
            var sRows = '<tbody>',
                panelObj = this.u_getPanelDates(year, month, date),
                dates = panelObj.dates,
                pL = panelObj.prevLen,
                tL = panelObj.thisLen + pL,
                nFlag = 0; //判断该走哪个数组的标志
            date = Number(date);
            for (var i = 0; i < 6; i++) {
                sRows += '<tr>';
                for (var j = 0; j <= 6; j++) {
                    nFlag = (i * 7) + j;
                    if (nFlag < pL) {
                        sRows += '<td class="prev-days">' + (dates[nFlag]) + '</td>';
                    } else if (nFlag >= pL && nFlag <= tL - 1) {
                        sRows += '<td class="current-days ' + (dates[nFlag] === date ? 'current' : '') + '">' + (dates[nFlag]) + '</td>';
                    } else if (tL <= nFlag) {
                        sRows += '<td class="next-days">' + (dates[nFlag]) + '</td>';
                    }
                }
                sRows += '</tr>';
            }
            sRows += '</tbody>';
            return sRows;
        },
        // 天天面板
        v_setDaysPanelCont: function(year, month, date) {
            var prev = month,
                next = month;

            year = year || this.u_getNow().year;
            month = month || this.u_getNow().month,
            date = date || this.u_getNow().date;
            var tablePanel = this.tableTmp[0];
            this.calenderHeaderTmp[2] = '<th colspan="5" class="date-switch" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '">' + year + '/' + month + '</th>';
            tablePanel += this.calenderHeaderTmp.join('') + this.daysHeaderTmp.join('') + this.tableTmp[1];
            tablePanel += this.v_renderMonthOfDays(year, month, date) + this.tableTmp[2];
            return tablePanel;
        },
        // 月月面板
        v_setMonthsPanelCont: function(year, month, date) {
            year = year || this.u_getNow().year;
            month = month || this.u_getNow().month,
            date = date || this.u_getNow().date;

            var tablePanel = this.tableTmp[0];
            this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '">' + year + '</th>';
            tablePanel += this.calenderHeaderTmp.join('') + this.tableTmp[1];
            tablePanel += this.v_renderMonths(year, month, date) + this.tableTmp[2];
            return tablePanel;
        },
        // 年年面板
        v_setYearsPanelCont: function(year, month, date) {

            year = year || this.u_getNow().year;
            month = month || this.u_getNow().month,
            date = date || this.u_getNow().date;

            var tablePanel = this.tableTmp[0],
                yearScope = this.u_getYearsScope(year);
            this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '">' + yearScope.start + '-' + yearScope.end + '</th>';
            tablePanel += this.calenderHeaderTmp.join('') + this.tableTmp[1];
            tablePanel += this.v_renderYears(year, month, date) + this.tableTmp[2];

            return tablePanel;
        },
        e_bodyEvent: function() {
            var me = this;
            $('body').off('click').on('click', function(e) {
                me.e_blurEvent(e);
            });
            return this;
        },
        e_blurEvent: function(e) {
            var me = this,
                $eTarget = $(e.target);
            if ($eTarget.parents('table').hasClass('easy-calender-table') || $eTarget.hasClass('easy-calender-input')) {
                me.calenderContainer.show();
            } else {
                me.calenderContainer.hide();
            }
            return this;
        },
        e_inputEvent: function() {
            var me = this,
                type = this.type;
            // 日历显示和隐藏
            switch (type) {
                case 'textInput':
                    me.dateInput.on('click', function(e) {
                        e.stopPropagation();
                        me.e_blurEvent.call(me, e);
                    });
                    break;
                case 'range':
                    break;
                case 'component':
                    break;
                case 'none':
                    break;
                default:
                    ;
            }
            return this;
        },
        e_daysEvent: function() {
            var me = this;
            me.daysCalender.on('click', 'thead .date-title th', function() {
                var that = $(this),
                    dateSwitch = that.siblings('.date-switch'),

                    thisMonth = dateSwitch.data('month'),
                    thisYear = dateSwitch.data('year');
                console.log(me.dateData);
                // thisMonth = me.calenderContainer.data().month;
                // thisYear = me.calenderContainer.data().year;

                if (that.hasClass('prev')) {
                    me.u_prevMonth(thisYear, thisMonth);
                    me.calenderContainer.show();
                } else if (that.hasClass('next')) {
                    me.u_nextMonth(thisYear, thisMonth);
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
                    u_prevMonthObj, u_nextMonthObj;
                if ($(this).hasClass('prev-days')) {
                    u_prevMonthObj = me.u_prevMonth(thisYear, thisMonth, selectedDate);
                    me.calenderContainer.show();
                    me.dateInput.val(me.u_formatInputDate(me.dateFormat, u_prevMonthObj));
                } else if ($(this).hasClass('next-days')) {
                    u_nextMonthObj = me.u_nextMonth(thisYear, thisMonth, selectedDate);
                    me.calenderContainer.show();
                    me.dateInput.val(me.u_formatInputDate(me.dateFormat, u_nextMonthObj));
                } else {
                    me.calenderContainer.find('table tbody td').removeClass('current');
                    $(this).addClass('current');
                    me.rememberDate(thisYear, thisMonth, selectedDate);
                    me.dateInput.val(me.u_formatInputDate(me.dateFormat, {
                        year: thisYear,
                        month: thisMonth,
                        date: selectedDate
                    }));
                }
            });
        },
        e_monthsEvent: function() {
            var me = this;
            // 头部事件绑定
            me.monthsCalender.on('click', 'thead th', function() {
                var that = $(this),
                    thisYear = that.parents('thead').find('.date-switch').data('year'),
                    thisMonth = that.parents('table').find();
                if (that.hasClass('prev')) {
                    (thisYear > 0) && thisYear--;
                    me.monthsCalender.html(me.v_setMonthsPanelCont(thisYear));
                } else if (that.hasClass('next')) {
                    thisYear++;
                    me.monthsCalender.html(me.v_setMonthsPanelCont(thisYear));
                } else if (that.hasClass('date-switch')) {
                    me.yearsCalender.html(me.v_setYearsPanelCont(thisYear));
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
        e_yearsEvent: function() {

        },
        rememberDate: function(year, month, date) {
            var me = this;
            this.dateData = {
                year: year || me.u_getNow().year,
                month: month || me.u_getNow().month,
                date: date || me.u_getNow().date
            };
        },
        // 插入显示表格
        v_renderDateTablet: function() {
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
                this.calenderContainer.find('.calender-days').html(this.v_setDaysPanelCont());
                this.calenderContainer.find('.calender-months').html(this.v_setMonthsPanelCont());
                this.calenderContainer.find('.calender-years').html(this.v_setYearsPanelCont());

            }
            this.v_setDateTablePosition();

            this.calenderContainer.find('.calender-days').show().siblings('div').hide();
        },
        // 设置包含块的位置
        v_setDateTablePosition: function() {
            var pos = this.v_getDateInputPosition(),
                model = this.v_getDateInputBoxModel();
            $('.easy-calender').css({
                'left': pos.left + 'px',
                'top': pos.top + model.height + 4 + 'px'
            });
            return this;
        },
        // 获取日期输入框的位置
        v_getDateInputPosition: function() {
            var pos = this.dateInput.offset();
            return pos;
        },
        v_getDateInputBoxModel: function() {
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
        'type': 'textInput', //日历类型，none|textInput|component|range ,分为纯日历格式，输入框格式（又分为带有开始和结束的组件格式）
        'dateFormat': 'yyyy/m/d'
    };
})(window, jQuery);