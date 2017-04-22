var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// 定义网站主页的路由
router.get('/', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var filepath = path.resolve(__dirname, '../data/test.json');
    var JsonObj = JSON.parse(fs.readFileSync(filepath));
    res.json(JsonObj);
});

module.exports = router;