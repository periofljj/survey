var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var serveIndex = require('serve-index');
var path = require('path');

var noderouter = require('./routers/noderouter');

var app = express();

var port = 8000;

// make sure this is place at begin of all request mapping
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, '../dist')));

app.use('/api/nodes', noderouter);

app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: "../dist"
    });
});

var server = app.listen(port, function() {
    console.log('Mock server listening at http://localhost:' + port);
});