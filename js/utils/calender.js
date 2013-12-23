/*
 * 先尝试写一个日历
 */
(function($, window, undefined) {
    // $(function(){
    var myCalender = {};
    // 获取每月开始星期
    myCalender.getMonthStartDay = function(year, month) {
        return new Date(year, month, 1).getDay();
    };
    // 判断闰年
    myCalender.isLeapYear = function(year) {
        return new Date(year, 2, 0).getDay() === 29;
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
    myCalender.renderYears = function() {

    };
    // 渲染月份
    myCalender.renderMonths = function() {

    };
    // 渲染每月日子
    // 可能包括上一个月部分日期
    // 本月部分日期
    myCalender.renderMonthOfDays = function(year, month) {
        var i = 0,
            j = 0,
            days = 0, //本月开始日期
            nextdays = 0, //下一个月的开始日期
            prevdays = 30, //上一个月开始日期
            sRows = '',
            prevMonthOfDays = this.getMonthDays(year, month - 1),
            thisMonthOfDays = this.getMonthDays(year, month);
        var thisMonthStartDay = this.getMonthStartDay(year, month);

        for (i = 0; i <= 6; i++) {
            sRows += '<tr>';

            for (j = 0; j <= 6; j++) {
                // 先渲染前一个月的月末部分日期
                // 再渲染本月日期
                // 后渲染下一个月月初日期

                if (thisMonthStartDay) {
                    // 本月月初非星期日
                    // 前一个月渲染
                    for(var prevStart=prevMonthOfDays-thisMonthStartDay;prevStart<=prevMonthOfDays;prevStart++){
                        sRows+='<td>' + prevStart + '</td>';
                    }
                    
                    // 本月渲染
                    if (days < thisMonthOfDays) {
                        sRows += '<td>' + (++days) + '</td>';
                    }
                    // 下一个月渲染
                    for(var nextStart=1,nextEnd=42-this.thisMonthOfDays-this.thisMonthStartDay;nextStart<=nextEnd;nextStart++){
                        sRows += '<td>' + nextStart + '</td>';
                    } 
                } else {
                    // 星期日
                }
                
                
                

            }
            sRows += '</tr>';
        }
        return sRows;
    };

    window.myCalender = myCalender;
    // });
})(jQuery, window);