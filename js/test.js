/*var http=require('http');
http.createServer(function(reg,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('<h1>Node.js lalalal</h1>');
    res.end('<p>end dkddkkd</p>');
}).listen(3000);
console.log('http server is listening at port 3000')*/
var fs=require('fs');
fs.readFile('test.txt','utf-8',function(err,data){
    if(err){
        console.error(err);
    }else{
        console.log(data);
    }
});
console.log('end.');
var b=require('./test2');
b=function(){
    return 1;
};
// var randomN=b.randomN();
console.log(b(),b());
console.log(process.argv);