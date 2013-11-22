var http = require('http'),
    url = require('url');
var start = function(route, handle) {
    var onRequest = function(request, response) {
        var postData = '';
        var pathName = url.parse(request.url).pathname;
        // console.log(pathName);
        route(pathName, handle, response, request);

    };
    http.createServer(onRequest).listen(8888);
    console.log('Server is started');
};
exports.start = start;