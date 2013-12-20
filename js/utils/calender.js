/*
* 先尝试写一个日历
*/
(function($,window,undefined){
    // $(function(){
        var myCalender={};
        // 获取每月开始星期
        myCalender.getMonthStartDay=function(year,month){
            return new Date(year,month,1).getDay();
        };
        // 判断闰年
        myCalender.isLeapYear=function(year){
            return new Date(year,2,0).getDay()===29;
        };
        // 获取每月天数
        myCalender.getMonthDays=function(year,month){
            var days=0;
            switch (month){
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    days=31;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    days=30;
                    break;
                case 2:
                    days=(this.isLeapYear(year))?29:28;
                    break;
                default:
                    days=0;
                    break;
            }
            return days;
        };
        // 渲染年份
        myCalender.renderYears=function(){

        };
        // 渲染月份
        myCalender.renderMonths=function(){

        };
        // 渲染每月日子
        // 可能包括上一个月部分日期
        // 本月部分日期
        /*myCalender.renderMonthOfDays=function(){
            var i=0,j=0,sRows='';
            for(;i<6;i++){
                sRows='<tr>';
                for(;j<6;j++){
                    sRows+='<td>'++'</td>';
                }
            }
        };*/

        window.myCalender=myCalender;
    // });
})(jQuery,window);