'use strict';

var async = require('async'),
    cheerio = require('cheerio'),
    util = require('./util'),
    cacha = require('./cacha');

var _url = {
    //百度风云榜
    hotKeyWords: 'http://top.baidu.com/mobile_v2/boardCard?b=1',
    haosou: 'http://www.haosou.com/s?ie=utf-8&shb=1&src=360sou_newhome&q=',
    bdApiInstantFullText: 'http://m.baidu.com/news?tn=bdapiinstantfulltext&src='
};

var isCrawler = false;

//爬虫抓取数据
module.exports.crawler = function (req, res, next) {
    if (isCrawler) return;
    util.console('开始抓取数据');
    isCrawler = true;
    var temp_cacha = {
        keywords : [],
        list: [],
        content : {}
    };
    async.waterfall([
        //获取热点新闻的关键词 hotKeyWordsList
        function (done) {
            util.console('准备获取今日热点词汇');
            util.request(_url.hotKeyWords, true, function (error, data) {
                util.console('结束获取今日热点词汇');
                if (!error && data.success) {
                    done(null, data.result.topwords);
                } else {
                    done('获取今日热点词汇失败');
                }
            });
        },
        //获取url链接
        function (hotKeyWordsList, done) {
            util.console('准备根据关键词获取url链接');
            async.mapLimit(hotKeyWordsList, 5, function (item, callback) {
                setTimeout(function () {
                    util.console('准备获取关键词：' + item.keyword);
                    util.request(_url.haosou + encodeURIComponent(item.keyword), function (error, htmlStr) {
                        util.console('结束获取关键词：' + item.keyword);
                        if (error) {
                            util.console('获取今日热点新闻[' + item.keyword + ']的url失败');
                            callback(null);
                        } else {
                            var hotNews_info = {
                                keyword: item.keyword,
                                url: '',
                                info: item
                            };
                            var $ = cheerio.load(htmlStr);
                            var mohe_news_hot = $('#first #mohe-news_hot').find('a').attr('href');
                            var mohe_news = $('#first #mohe-news .cont').eq(0).find('a').attr('href');
                            var mohe_news_all = $('#first #mohe-news_all #news_all_newszutu .cont .gclearfix .mh-news-list dt').find('a').attr('href');
                            var mohe_news_all_new = $('#first #mohe-news_all #mohe-news .mh-cout p.mh-position').find('a').attr('href');
                            var mohe_null = $('#first .res-title').eq(0).find('a').attr('href');
                            var _url = (mohe_news_hot ? mohe_news_hot : (mohe_news ? mohe_news : (mohe_news_all ? mohe_news_all : (mohe_news_all_new ? mohe_news_all_new : mohe_null))));
                            !_url && (_url = $('#first h3').eq(0).find('a').attr('href'));
                            _url && (_url = _url.replace('http://www.so.com/link?url=', ''));
                            _url && (hotNews_info.url = _url).split('?')[0];
                            util.console('获取今日热点新闻[' + item.keyword + ']的url成功');
                            callback(null, hotNews_info);
                        }
                    });
                }, Math.random * 2000 + 2000);
            }, function (error, result) {
                util.console('结束根据关键词获取url链接');
                if (error) return done(error);
                //清除失败的关键词
                result = result.filter(function (element, index, array) {
                    return (undefined !== element);
                });
                done(null, result);
            });
        },
        function (hotNewsList, done) {
            util.console('准备获取的url链接抓取内容');
            async.mapLimit(hotNewsList, 5, function (item, callback) {
                setTimeout(function () {
                    util.console('开始抓取[' + item.keyword + ']内容');
                    util.request(_url.bdApiInstantFullText + item.url, true, function (error, data) {
                        if (error) {
                            util.console('获取[' + item.keyword + ']的内容失败');
                            return callback(null);
                        }
                        if (!data || (data.errno !== 0)) {
                            util.console('获取[' + item.keyword + ']的内容失败');
                            return callback(null);
                        }
                        util.console('获取[' + item.keyword + ']的内容成功');
                        data.data.news[0].keyword = item.keyword;
                        data.data.news[0].info = item.info;
                        callback(null, data.data.news[0]);
                    });
                }, Math.random * 2000 + 2000);
            }, function (error, result) {
                util.console('结束获取的url链接抓取内容');
                if (error) return done(error);
                //清除失败的内容
                result = result.filter(function (element, index, array) {
                    return (undefined !== element);
                });
                done(null, result);
            });
        }
    ], function (error, result) {
        isCrawler = false;
        if (error) {
            util.console('抓取失败, 原因为 ' + error);
        } else {
            util.console('抓取成功, 数据处理');
            var temp_cacha = {
                keywords : [],
                list: [],
                content : {}
            };
            for (var i = 0; i < result.length; i++) {
                temp_cacha.keywords.push(result[i].keyword);
                temp_cacha.content[result[i].keyword] = result[i];
            };
            temp_cacha.list = result;
            cacha.set(temp_cacha);
        }
    });
};