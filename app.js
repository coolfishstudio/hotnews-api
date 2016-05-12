var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./lib/routes');
var config = require('./config/index');
var timer = require('./lib/v1/hotnews/timer')

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    next();
});

app.use('/', routes);

//初始化抓取数据
timer.crawler();
setInterval(function () {
   timer.crawler(); 
}, 1000 * 60 * 60);

app.listen(config.port, function () {
    console.log('* running, port:', config.port);
    console.log('* app env:', app.get('env'));
});