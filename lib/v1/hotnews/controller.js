'use strict';

var async = require('async'),
    util = require('./util'),
    cacha = require('./cacha'),
    timer = require('./timer');

//获取热门新闻关键词
module.exports.findAllKeywords = function (req, res, next) {
    var keywords = cacha.getKeywords();
    if (keywords.length !== 0) return res.json({status : 1, content: keywords});
    timer.crawler();
    res.json({status : 0, content: '获取热门新闻关键词失败'});
};

module.exports.getPostByKeyword = function (req, res, next) {
    var keyword = req.params.keyword;
    var content = cacha.getContentByKeyword(keyword); 
    if (!content) res.json({status : 0, content: '新闻[' + keyword + ']内容不存在'});
    res.json({status : 1, content: content});
};