'use strict';

var express = require('express');
var router = express.Router();
// var pageNews = require('./pageNews');


router.get('/ping', function (req, res, next) {
    res.status(200).end('OK');
});
router.get('/favicon.ico', function (req, res, next) {
    res.status(204).end();
});
router.get('/', function (req, res, next) {
    res.json({
        welcome: 'hive-hotnews-api',
        doc: 'https://github.com/coolfishstudio/hotnews-api'
    });
});

//api
router.use('/v1/hotnews', require('./v1/hotnews/router'));

router.use('*', function (req, res, next) {
    res.status(404).end('Not Found');
});


module.exports = router;

