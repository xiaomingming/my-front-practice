var route=function(pathName,handle,response,request){
    if(typeof handle[pathName]==='function'){
        return handle[pathName](response,request);
    }else{
        // 
        return handle['disabled'](response);
    }
};
exports.route=route;