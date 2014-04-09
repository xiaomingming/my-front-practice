var server=require('./server');
var route=require('./router');
var requestHandlers = require("./requestHandler");

var handle={};
handle['/']=requestHandlers.start;
handle['/start']=requestHandlers.start;
handle['/upload']=requestHandlers.upload;
handle['disabled']=requestHandlers.disabled;
handle['/show']=requestHandlers.show;

server.start(route.route,handle);