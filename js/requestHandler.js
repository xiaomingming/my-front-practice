/*
 * 请求响应回调
 */

var queryString = require('querystring');
// var exec = require('child_process').exec;
var fs = require('fs');
var formidable=require('formidable');

// 响应开始
var start = function(response) {
    console.log('Request handler "start" was called.');
    var body = '<!DOCTYPE HTML>' +
        '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="file" name="upload" />' +
        '<input type="submit" value="Submit text" />' +
        '</form>' +
        '</body>' +
        '</html>';
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write(body);
    response.end();
};
    // 响应upload
    var upload = function(response, request) {
        console.log('Request handler "upload" was called.');
        var form=new formidable.IncomingForm();
        console.log('about to parse');

        // 写一个临时路径
        form.uploadDir='tmp';
        form.parse(request,function(err,fields,files){
            console.log('parsing done');
            console.log(files.upload);
            // 同步操作文件，需要try catch
            try{
                fs.renameSync(files.upload.path,'tmp/test.png');
            }catch(e){
                console.log(e);
            }
            
            response.writeHead(200,{'Content-Type':'text/html'});
            response.write('received img:</br>');
            response.write('<a href="/show"><img src="/show" /></a>');
            response.end();
        });
    };
    // 显示文件
    var show=function(response){
        console.log('request handler "upload" was called');
        fs.readFile('./tmp/test.png','binary',function(err,file){
            if(err){
                response.writeHead(500,{'Content-Type':'text/plain'});
                response.write(err+'\n');
                response.end();
            }else{
                response.writeHead(200,{'Content-Type':'image/png'});
                response.write(file,'binary');
                response.end();
            }
        });
    };
// 不可访问
var disabled = function(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    response.write('404  not found');
    response.end();
};
// 推出接口
module.exports = {
    start: start,
    upload: upload,
    disabled: disabled,
    show:show
}