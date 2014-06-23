var static = require('node-static');
var listen = require('./lib/chat_server').listen;
var http = require('http');

var file = new static.Server('./public');
var server = http.createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  }).resume();
});

server.listen(3000);
listen(server);