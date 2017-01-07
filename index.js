var fs = require('fs');
var http = require('http');
var server = http.createServer();

server.on('request', function(req, res) {

    if (req.url.match(/^\/images\//)) {
        var file = fs.readFileSync(req.url.substring(1));
        res.write(file);
        res.end();
        return;
    }

    if (req.url === '/') {

        var content = fs.readFileSync('list.html', 'utf8'),
            list = '';

        fs.readdirSync('images').forEach(function(d) {
            list += '<li style="margin-bottom: 10px;"><a href="/' + d + '">' + d + '</a></li>';
        });

        content = content.replace(/{{items_list}}/g, list);
        res.setHeader('content-type', 'text/html');
        res.write(content);
        res.end();
        return;
    }

});

server.listen(4000);
