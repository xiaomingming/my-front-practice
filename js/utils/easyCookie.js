/*
* 
*/
(function(window,undefined){
    var dk=document.cookie;
    var ckUtils={};
    // cookie 不存在
    if(!dk.length){
        return; 
    }
    ckUtils.getCookie=function(ckName){
        var dkRes=dk.indexOf(ckName),startIndex,endIndex;
        if(dkRes!==-1){
            startIndex=dkRes+ckName.length+1;
            endIndex=dk.indexOf(';',startIndex);

            if(endIndex==-1){
                return dk.substring(startIndex,dk.length);
            }else{
                return dk.substring(startIndex,endIndex);
            }
        }
    };
})(window);