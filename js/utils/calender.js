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
        // 周和月配置需要遵循固定的顺序
        this.weekConfig = settings.weekConfig;
        this.monthsMap = settings.monthsMap;
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
            '<th>' + this.weekConfig[0] + '</th>',
            '<th>' + this.weekConfig[1] + '</th>',
            '<th>' + this.weekConfig[2] + '</th>',
            '<th>' + this.weekConfig[3] + '</th>',
            '<th>' + this.weekConfig[4] + '</th>',
            '<th>' + this.weekConfig[5] + '</th>',
            '<th>' + this.weekConfig[6] + '</th>',
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
            return {
                pA: [prevStartDate, thisMonthStartDate], //开始日期及长度
                tA: [1, thisMonthOfDays],
                nA: [1, 42 - thisMonthStartDate - thisMonthOfDays]
            }
        },
        u_prevMonth: function(year, month, date) {
            month--;
            if (month <= 0) {
                month = 12;
                year -= 1;
            }
            return {
                year: year,
                month: month,
                date: date
            }
        },
        u_nextMonth: function(year, month, date) {
            month++;
            if (month > 12) {
                month = 1;
                year += 1;
            }
            return {
                year: year,
                month: month,
                date: date
            }
        },
        u_prevYears: function(year) {
            return year -= 10;
        },
        u_nextYears: function(year) {
            return year += 10
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
            var tmp = '<tbody>',
                i, j, yearScope = this.u_getYearsScope(year),
                start = yearScope.start;
            for (i = 0; i < 3; i++) {
                tmp += '<tr>';
                for (j = 0; j < 4; j++) {
                    if (i === 0 && j === 0) {
                        tmp += '<td class="prev">' + (yearScope.start - 1) + '</td>';
                    } else if (i === 2 && j === 3) {
                        tmp += '<td class="next">' + (yearScope.end + 1) + '</td>';
                    } else {
                        if (start === year) {
                            tmp += '<td class="current">' + (start++) + '</td>';
                        } else {
                            tmp += '<td>' + (start++) + '</td>';
                        }
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
                i, j;
            if (!month) {
                month = new Date().getMonth() + 1;
            }
            for (i = 0; i < 3; i++) {
                tmp += '<tr>';
                for (j = 0; j < 4; j++) {
                    currentMonth = 4 * i + (j + 1);
                    if (((i * 4) + j + 1) === month) {
                        tmp += '<td class="current" data-month="' + currentMonth + '">' + this.monthsMap[(i * 4) + j] + '</td>';
                    } else {
                        tmp += '<td data-month="' + currentMonth + '">' + this.monthsMap[(i * 4) + j] + '</td>';
                    }
                }
                tmp += '</str>';
            }
            tmp += '</tbody>';
            return tmp;
        },
        // 渲染天
        v_renderMonthOfDays: function(year, month, date) {
            var sRows = '<tbody>',
                panelObj = this.u_getPanelDates(year, month, date),
                pA = panelObj.pA,
                pStartDate = pA[0],
                pL = pA[1],
                tA = panelObj.tA,
                tStartDate = tA[0],
                tL = tA[1],
                nA = panelObj.nA,
                nStartDate = nA[0],
                nL = nA[1],
                nFlag = 0; //判断该走哪个数组的标志
            date = Number(date);
            for (var i = 0; i < 6; i++) {
                sRows += '<tr>';
                for (var j = 0; j <= 6; j++) {
                    nFlag = (i * 7) + j;
                    if (nFlag < pL) {
                        sRows += '<td class="prev">' + (pStartDate++) + '</td>';
                    } else if (nFlag >= pL && nFlag <= pL + tL - 1) {
                        sRows += '<td class="current-days' + (tStartDate === date ? ' current' : '') + '">' + (tStartDate++) + '</td>';
                    } else {
                        sRows += '<td class="next">' + (nStartDate++) + '</td>';
                    }
                }
                sRows += '</tr>';
            }
            sRows += '</tbody>';
            return sRows;
        },
        // 设置日历html
        v_setCalenderCont: function(fFlag, year, month, date) {
            year = Number(year) || Number(this.u_getNow().year);
            month = Number(month) || Number(this.u_getNow().month);
            date = Number(date) || Number(this.u_getNow().date);
            var colspan = 2,
                headOption = '',
                weekHead = '',
                yearScope,
                renderMethod;

            switch (fFlag) {
                case 'days':
                    colspan = 5;
                    headOption = year + '/' + month;
                    weekHead = this.daysHeaderTmp.join('');
                    renderMethod = 'v_renderMonthOfDays';
                    break;
                case 'months':
                    headOption = year;
                    renderMethod = 'v_renderMonths';
                    break;
                case 'years':
                    yearScope = this.u_getYearsScope(year);
                    headOption = yearScope.start + '-' + yearScope.end;
                    renderMethod = 'v_renderYears';
                    break;
                default:
                    ;
            }
            var tablePanel = this.tableTmp[0];
            this.calenderHeaderTmp[2] = '<th colspan="' + colspan + '" class="date-switch" data-year="' + year + '" data-month="' + month + '" data-date="' + date + '">' + headOption + '</th>';
            tablePanel += this.calenderHeaderTmp.join('') + weekHead + this.tableTmp[1];
            tablePanel += this[renderMethod](year, month, date) + this.tableTmp[2];
            return tablePanel;
        },
        // 控制年月日三个面板显示
        v_calenderPanelShow: function(panel) {
            switch (panel) {
                case 'days':
                    this.daysCalender.show().siblings('div').hide();
                    break;
                case 'months':
                    this.monthsCalender.show().siblings('div').hide();
                    break;
                case 'years':
                    this.yearsCalender.show().siblings('div').hide();
                    break;
            }
            return this;
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
            ($eTarget.parents('table').hasClass('easy-calender-table') || $eTarget.hasClass('easy-calender-input')) ? me.calenderContainer.show() : me.calenderContainer.hide();
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
                        me.daysCalender.show().siblings('div').hide();
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
                    dateSwitch = that.parents('thead').find('.date-switch'),
                    thisMonth = dateSwitch.data('month'),
                    thisYear = dateSwitch.data('year'),
                    u_prevMonthObj, u_nextMonthObj;
                if (that.hasClass('prev')) {
                    u_prevMonthObj = me.u_prevMonth(thisYear, thisMonth);
                    me.daysCalender.html(me.v_setCalenderCont('days', u_prevMonthObj.year, u_prevMonthObj.month, u_prevMonthObj.date));
                    me.v_calenderPanelShow('days');
                } else if (that.hasClass('next')) {
                    u_nextMonthObj = me.u_nextMonth(thisYear, thisMonth);
                    me.daysCalender.html(me.v_setCalenderCont('days', u_nextMonthObj.year, u_nextMonthObj.month, u_nextMonthObj.date));
                    me.v_calenderPanelShow('days');
                } else if (that.hasClass('date-switch')) {
                    me.monthsCalender.html(me.v_setCalenderCont('months', thisYear, thisMonth));
                    me.v_calenderPanelShow('months');
                }

            });
            // tbody事件绑定
            me.daysCalender.on('click', 'table tbody td', function() {
                var dateSwitch = $(this).parents('table').find('thead .date-switch'),
                    thisMonth = dateSwitch.data('month'),
                    thisYear = dateSwitch.data('year'),
                    selectedDate = $(this).text(),
                    u_prevMonthObj, u_nextMonthObj;
                if ($(this).hasClass('prev')) {
                    u_prevMonthObj = me.u_prevMonth(thisYear, thisMonth, selectedDate);
                    me.daysCalender.html(me.v_setCalenderCont('days', u_prevMonthObj.year, u_prevMonthObj.month, u_prevMonthObj.date));
                    me.dateInput.val(me.u_formatInputDate(me.dateFormat, u_prevMonthObj));
                } else if ($(this).hasClass('next')) {
                    u_nextMonthObj = me.u_nextMonth(thisYear, thisMonth, selectedDate);
                    me.daysCalender.html(me.v_setCalenderCont('days', u_nextMonthObj.year, u_nextMonthObj.month, u_nextMonthObj.date));
                    me.dateInput.val(me.u_formatInputDate(me.dateFormat, u_nextMonthObj));
                } else {
                    me.calenderContainer.find('table tbody td').removeClass('current');
                    $(this).addClass('current');
                    me.dateInput.val(me.u_formatInputDate(me.dateFormat, {
                        year: thisYear,
                        month: thisMonth,
                        date: selectedDate
                    }));
                    me.v_calenderPanelShow('days');
                }
            });
            
        },
        e_monthsEvent: function() {
            var me = this;
            // 头部事件绑定
            me.monthsCalender.on('click', 'thead th', function() {
                var that = $(this),
                    thisYear = that.parents('thead').find('.date-switch').data('year');
                if (that.hasClass('prev')) {
                    (thisYear > 0) && thisYear--;
                    me.monthsCalender.html(me.v_setCalenderCont('months', thisYear));
                    me.v_calenderPanelShow('months');
                } else if (that.hasClass('next')) {
                    thisYear++;
                    me.monthsCalender.html(me.v_setCalenderCont('months', thisYear));
                    me.v_calenderPanelShow('months');
                } else if (that.hasClass('date-switch')) {
                    me.yearsCalender.html(me.v_setCalenderCont('years', thisYear));
                    me.v_calenderPanelShow('years');
                }
                
            });
            // 体事件绑定
            me.monthsCalender.on('click', 'tbody td', function() {
                var that = $(this),
                    thisMonth = that.data('month'),
                    thisYear = that.parents('table').find('.date-switch').data('year');
                that.parents('tbody').find('td').removeClass('current');
                that.addClass('current');
                me.daysCalender.html(me.v_setCalenderCont('days', thisYear, thisMonth));
                me.v_calenderPanelShow('days');
            });
        },
        e_yearsEvent: function() {
            var me = this;
            // 头部事件绑定
            me.yearsCalender.on('click', 'thead th', function() {
                var that = $(this),
                    dateSwitch = that.siblings('.date-switch'),
                    thisMonth = dateSwitch.data('month'),
                    thisYear = dateSwitch.data('year'),
                    u_prevMonthObj, u_nextMonthObj;
                if (that.hasClass('prev')) {
                    thisYear -= 10;
                    me.yearsCalender.html(me.v_setCalenderCont('years', thisYear, thisMonth));
                    me.v_calenderPanelShow('years');
                } else if (that.hasClass('next')) {
                    thisYear += 10;
                    me.yearsCalender.html(me.v_setCalenderCont('years', thisYear, thisMonth)).show();
                    me.v_calenderPanelShow('years');
                } else if (that.hasClass('date-switch')) {
                    // me.calenderContainer.find('.calender-months').show().siblings('div').hide();
                }
            });
            // 体事件绑定
            me.yearsCalender.on('click', 'tbody td', function() {
                var dateSwitch = $(this).parents('table').find('thead .date-switch'),
                    thisMonth = dateSwitch.data('month'),
                    thisYear = Number($(this).text()),
                    u_prevMonthObj, u_nextMonthObj;
                if ($(this).hasClass('prev')) {
                    me.yearsCalender.html(me.v_setCalenderCont('years', thisYear, thisMonth));
                    me.v_calenderPanelShow('years');
                } else if ($(this).hasClass('next')) {
                    me.yearsCalender.html(me.v_setCalenderCont('years', thisYear, thisMonth));
                    me.v_calenderPanelShow('years');
                } else {
                    me.calenderContainer.find('table tbody td').removeClass('current');
                    $(this).addClass('current');
                    me.monthsCalender.html(me.v_setCalenderCont('months', thisYear, thisMonth));
                    me.v_calenderPanelShow('months');
                }
            });
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
                this.calenderContainer.find('.calender-days').html(this.v_setCalenderCont('days'));
                this.calenderContainer.find('.calender-months').html(this.v_setCalenderCont('months'));
                this.calenderContainer.find('.calender-years').html(this.v_setCalenderCont('years'));
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
        'dateFormat': 'yyyy/m/d',
        'weekConfig': ['日', '一', '二', '三', '四', '五', '六'],
        'monthsMap': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
})(window, jQuery);