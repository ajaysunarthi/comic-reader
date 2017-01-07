var fs = require('fs');
var http = require('http');
var server = http.createServer();

server.on('request',function(req,res) {
   
   res.write('Hello World');
   res.end();
   return;
});

server.listen(4000);