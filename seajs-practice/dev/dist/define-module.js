/*
 * 定义一个cmd模块
 * 有好多种定义的方法
 * 此处示例为加减乘除
 */
// 第一种定义的方式
/*define(function(require, exports, module) {
    var isYourType = function(a, typeStr) {
        var typeArr = Object.prototype.toString.call(a);
        return typeArr.slice(8, typeArr.length - 1).toLowerCase() === typeStr;
    };
    var isNumber = function(a) {
        return isYourType(a, 'number');
    };
    // 两个数的加法
    exports.add = function(a, b) {
        return isNumber(a) && isNumber(b) && a + b;
    };
    // 两个数的减法
    exports.subtraction = function(a, b) {
        return isNumber(a) && isNumber(b) && a - b;
    };
    // 两个数的乘法
    exports.multiplication = function(a, b) {
        return isNumber(a) && isNumber(b) && a * b;
    };
    // 两个数的除法
    exports.division = function(a, b) {
        return isNumber(a) && isNumber(b) && a / b;
    };

});*/
// 第二种定义方式
define(function(require, exports, module) {
    var isYourType = function(a, typeStr) {
        var typeArr = Object.prototype.toString.call(a);
        return typeArr.slice(8, typeArr.length - 1).toLowerCase() === typeStr;
    };
    var isNumber = function(a) {
        return isYourType(a, 'number');
    };
    // 直接return所有公开的接口
    // module.exports就是return 的接口,相当于module.exports={}
    // 所以 return {}和module.exports={}是等价的
    return {
        add:function(a,b){
           return isNumber(a) && isNumber(b) && a + b; 
        },
        subtraction:function(a,b){
            return isNumber(a) && isNumber(b) && a - b;
        },
        multiplication:function(a,b){
            return isNumber(a) && isNumber(b) && a * b;
        },
        division:function(a,b){
            return isNumber(a) && isNumber(b) && a / b;
        }
    }
});