/*
* 添加多个方法
*/
jQuery.extend({
    ah:function(){
    	alert('哈哈哈');
    },
    showInfo:function(name){
    	$('body').prepend('你好啊：'+name);
    }
});