/*
 * 先尝试写一个日历
 */
(function($, window, undefined) {
    // $(function(){
    var myCalender = {};
    // 日历模板
    // 公用模板头
    myCalender.tableTmp = [
        '<table><thead class="calender-header">',
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
    // 详情模板
    myCalender.daysPanelTmp = [
        '<tbody class="date-panel">',
        '</tbody>'
    ];
    // 月份模板
    myCalender.monthsPanelTmp = [
        '<tbody class="months-panel">',
        '</tbody>'
    ];
    // 年份模板
    myCalender.yearsPanelTmp = [
        '<tbody class="years-panel">',
        '</tbody>'
    ];
    // 十年模板
    myCalender.tenYearsPanelTmp = [
        '<tbody class="tenYears-panel">',
        '</tbody>'
    ];
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
        var days = 0;
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                days = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                days = 30;
                break;
            case 2:
                days = (this.isLeapYear(year)) ? 29 : 28;
                break;
            default:
                days = 0;
                break;
        }
        return days;
    };
    // 渲染年份
    myCalender.renderYears = function(year, month) {
        // 
        var tmp = '',
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
        return tmp;
    };
    // 渲染月份
    myCalender.renderMonths = function(year, month) {
        var tmp = '',
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
        return tmp;
    };
    // 渲染天
    myCalender.renderMonthOfDays = function(year, month, date) {
        var i,
            j,
            days = 0, //本月开始日期
            nextdays = 1, //下一个月的开始日期
            sRows = '',
            prevYear = year,
            prevMonth = month - 1;
        if (!date) {
            date = new Date().getDate();
        }
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
                    sRows += '<td>' + (prevStartDay++) + '</td>';
                } else if (days < thisMonthOfDays) {
                    // 当前月
                    if (days === date) {
                        sRows += '<td class="current">' + (++days) + '</td>';
                    } else {
                        sRows += '<td>' + (++days) + '</td>';
                    }
                } else {
                    sRows += '<td>' + (nextdays++) + '</td>';
                }
            }
            sRows += '</tr>';
        }
        return sRows;
    };
    // 天天面板
    myCalender.setDaysPanelCont = function(year, month) {
        var prev = month,
            next = month;
        var tablePanel = this.tableTmp[0];
        this.calenderHeaderTmp[2] = '<th colspan="5" class="date-switch">' + year + '/' + month + '</th>';
        tablePanel += this.calenderHeaderTmp.join('') + this.daysHeaderTmp.join('') + this.tableTmp[1];
        tablePanel += this.daysPanelTmp[0] + this.renderMonthOfDays(year, month) + this.daysPanelTmp[1] + this.tableTmp[2];
        $('#calender').html(tablePanel);
        $('#calender thead .prev').off('click').on('click', function() {
            // 更改显示年月
            prev--;
            if (prev <= 0) {
                prev = 12;
                year -= 1;
            }
            myCalender.setDaysPanelCont(year, prev);
        });
        $('#calender thead .next').off('click').on('click', function() {
            // 更改显示年月
            next++;
            if (next > 12) {
                next = 1;
                year += 1;
            }
            myCalender.setDaysPanelCont(year, next);
        });
        $('#calender thead .date-switch').off('click').on('click', function() {
            myCalender.setMonthsPanelCont(year);
        });
        return tablePanel;
    };
    // 月月面板
    myCalender.setMonthsPanelCont = function(year) {
        var tablePanel = this.tableTmp[0];
        this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch">' + year + '</th>';
        tablePanel += this.calenderHeaderTmp.join('') + this.tableTmp[1];
        tablePanel += this.monthsPanelTmp[0] + this.renderMonths(year) + this.monthsPanelTmp[1] + this.tableTmp[2];
        // console.log(tablePanel);
        $('#calender').html(tablePanel);
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
        });
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
        var tablePanel = this.tableTmp[0],
            yearScope = this.getYearsScope(year);
        this.calenderHeaderTmp[2] = '<th colspan="2" class="date-switch">' + yearScope.start + '-' + yearScope.end + '</th>';
        tablePanel += this.calenderHeaderTmp.join('');
        tablePanel += this.yearsPanelTmp[0] + this.renderYears(year) + this.yearsPanelTmp[1] + '</table>';
        $('#calender').html(tablePanel);
        $('#calender thead .prev').off('click').on('click', function() {
            // 更改显示年月
            yearScope.start -= 10;
            myCalender.setYearsPanelCont(yearScope.start);
        });
        $('#calender thead .next').off('click').on('click', function() {
            // 更改显示年月
            yearScope.start += 10;
            myCalender.setYearsPanelCont(yearScope.start);
        });
        return tablePanel;
    };
    window.myCalender = myCalender;
    // });
})(jQuery, window);