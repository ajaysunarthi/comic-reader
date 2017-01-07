var fs = require('fs');
var http = require('http');
var server = http.createServer();
var favicon = fs.readFileSync('favicon.ico');
var authorizedExtensions = ['.jpg', '.jpeg', '.png'];

server.on('request', function(req, res) {

    if (req.url.match(/favicon\.ico$/)) {
        res.write(favicon);
        res.end();
        return;
    }

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

    var content = fs.readFileSync('display.html', 'utf8');
    var directory = req.url.split('/')[1];
    var image = req.url.split('/')[2];
    var current = 0,
        i;
    var _dirContents = fs.readdirSync('images/' + directory);
    var dirContents = [];
    _dirContents.forEach(function(f) {
        var ext = f.split('.');
        ext = '.' + ext[ext.length - 1];
        if (authorizedExtensions.indexOf(ext) !== -1) { dirContents.push(f); }
    });

    if (image) {
        for (i = 0; i < dirContents.length; i += 1) {
            if (image === dirContents[i]) { current = i; }
        }
    }

    var title = directory + ' - ' + (current + 1) + '/' + dirContents.length;
    current = dirContents[current];

    content = content.replace(/{{directory}}/g, directory);
    content = content.replace(/{{current}}/g, current);
    content = content.replace(/{{title}}/g, title);

    res.setHeader('content-type', 'text/html');
    res.write(content);
    res.end();
    return;

});

server.listen(4000);
