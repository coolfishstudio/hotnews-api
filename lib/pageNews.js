'use strict';

var http = require('http'),
	cheerio = require('cheerio'),
	request = require('request'),
	async = require('async'),
	redis = require('redis');

/* 正式 */
var client  = redis.createClient('6379', '10.11.1.65');
var GROUPID = '3672dd5814080be6bac2d54976e6b53f';//'2bf6bbf523cca89ae26a3c41eff06bbb';
var userID = 'e80c2a2fc34201c0515a6091a69b0e3d';//'c9904feeaff6c48be2731707283a99bc';
var LIFESERVER = 'http://api.life.xiaoyun.com';//'http://api.life.xiaoyun.cn';
var LOCALLIFE = 'http://life.xiaoyun.com/';//'http://172.100.11.73:9400/';

// /* 测试 */

// var client  = redis.createClient('6379', '127.0.0.1');
// var GROUPID = '2bf6bbf523cca89ae26a3c41eff06bbb';
// var userID = 'c9904feeaff6c48be2731707283a99bc';
// var LIFESERVER = 'http://api.life.xiaoyun.cn';
// var LOCALLIFE = 'http://172.100.11.73:9400/';


var url_hotKeyWords = 'http://top.baidu.com/mobile_v2/boardCard?b=1';
var url_m_haosou = 'http://www.haosou.com/s?ie=utf-8&shb=1&src=360sou_newhome&q=';
var url_bdapiinstantfulltext = 'http://m.baidu.com/news?tn=bdapiinstantfulltext&src=';

var _cache = {
	keywords : [],
	content : {},
	time: 0
};



var LIFE_SERVER_SET_API = LIFESERVER + '/group/' + GROUPID + '/post';
var LIFE_SERVER_GET_API = LIFESERVER + '/group/' + GROUPID + '/posts';

var _tempTopList = [];

var flag = true;

exports.getHotNewsListToTop = function(req, res){
	if(_cache.keywords.length != 0){
		var num = req.query.num || 3;
		var topKeyWords = _cache.keywords.slice(0, num);
		// var topKeyWords = ['沪指大涨3%上4300','习近平出访白俄罗斯','广州到成都首开动车'];
		if(_tempTopList.length > 0){
			console.log('--');
			return res.send({status : 1, content: _tempTopList});
		}else{
			async.mapLimit(topKeyWords, num, function(keyword, callback){
				var tags = encodeURIComponent('热点新闻' + ',' + keyword);
				getHttpHtmlYunLife(tags ,function(err, info){
					// console.log('---',info);
					if (/<html>/.test(info)) {
						return callback('504');
					}
					if(err || (!!info && (info.length === 0))){
						callback(null);
					}else{
						info[0].url = LOCALLIFE + '#/channel/' + GROUPID + '/detail/' + info[0]._id;
						info[0].listUrl = LOCALLIFE + '#/channel/' + GROUPID;
						_tempTopList.push(info[0]);
						callback(null, info[0]);
					}
				});
			}, function(err, result){
				if (err) return res.send({status : 0, content: '出故障了！没法提供给你新闻内容。'});
				res.send({status : 1, content: result});
			});
		}
	}else{
		if(flag){
			exports.update();
		}
		res.send({status : 0, content: '出故障了！没法提供给你新闻内容。'});
	}
};


exports.getHotNewsList = function(req, res){
	// console.log('[' + getLocalTime(new Date().getTime()) + '] : 开始查询列表。',_cache);
	if(_cache.keywords.length != 0){
		res.send({status : 1, content: _cache.keywords});
	}else{
		if(flag){
			exports.update();
		}
		res.send({status : 0, content: '出故障了！没法提供给你新闻内容。'});
	}
};
exports.getHotNews = function(req, res){
	var _key = req.query.q;
	var _content = _cache.content[_key];
	// console.log('[' + getLocalTime(new Date().getTime()) + '] : 开始查询详情。', _key);
	// console.log(_cache, '-----', _cache.content ,'---------',_content);
	if(!_content){
		res.send({status : 0, content: '出故障了！没法提供给你新闻内容。'});
	}else{
		res.send({status : 1, content: _content});
	}
};
exports.update = function(){
	flag = false;
	var keyWordsList = [];
	var hotUrlList = [];
	var _cacheTemp = {
		keywords : [],
		content : {},
		time: 0
	};
	console.log('[' + getLocalTime(new Date().getTime()) + '] : 开始更新。');
	async.series({
		getHotKeyWords : function(done){
			//获取今日热点
			getHttpHtml(url_hotKeyWords, function(err, code, info){
				info = eval('(' + info + ')');
				if(!err && info.success){
					for (var i = 0; i < info.result.topwords.length; i++) {
						_cacheTemp.keywords.push(info.result.topwords[i].keyword);
					};
					done();
				}else{
					done('获取今日热点词汇失败');
				}
			});
		},
		getHotUrlList : function(done){
			//获取url
			async.mapLimit(_cacheTemp.keywords, 5, function(keyword, callback){
				setTimeout(function(){
					getHttpHtml(url_m_haosou + encodeURIComponent(keyword), function(err, code, htmlStr){
						// console.log(url_m_haosou + encodeURIComponent(keyword), keyword, code);
						if(!err){
							var hotNews_info = {};
								hotNews_info.keyword = keyword;
								hotNews_info.url = '';
							if(code == 200){
								var $ = cheerio.load(htmlStr);
								// console.log($('#first').html());
								var mohe_news_hot = $('#first #mohe-news_hot').find('a').attr('href');
								var mohe_news = $('#first #mohe-news .cont').eq(0).find('a').attr('href');
								var mohe_news_all = $('#first #mohe-news_all #news_all_newszutu .cont .gclearfix .mh-news-list dt').find('a').attr('href');
								var mohe_news_all_new = $('#first #mohe-news_all #mohe-news .mh-cout p.mh-position').find('a').attr('href');
								var mohe_null = $('#first .res-title').eq(0).find('a').attr('href');
								var _url = (mohe_news_hot ? mohe_news_hot : (mohe_news ? mohe_news : (mohe_news_all ? mohe_news_all : (mohe_news_all_new ? mohe_news_all_new : mohe_null))));
								_url && (hotNews_info.url = _url.split('?')[0]);
								console.log('获取链接-->', hotNews_info.url);
								return callback(null,hotNews_info);
							}else{
								return callback(null);
							}				
						}else{
							console.log('获取今日热点新闻[' + keyword + ']的url失败');
							return callback(null);
						}
					});
				},Math.random() * 2000 + 2000);				
			}, function(err, result){
				console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>获取url结束');
				if(!err){
					result = result.filter(function(element, index, array){
						return (undefined !== element);
					});
					hotUrlList = result;
					done();
				}else{
					done(err);
				}
			});
		},
		getHotContentList : function(done){
			var tempArr = [];
			//获取内容
			async.mapLimit(hotUrlList, 5, function(obj, callback){
				setTimeout(function(){
					console.log('[s]>>>',url_bdapiinstantfulltext + obj.url);
					getHttpHtml(url_bdapiinstantfulltext + obj.url, function(err, code, info){
						if (err || (code !== 200)) {
							console.log('获取今日热点新闻[' + obj.keyword + ']的内容失败, ' + obj.url, '>>>' + err);
							return callback(null);
						}
						if (/<html>/.test(info)) {
							return callback(null);
						}
						info = eval('(' + info + ')');
						if (!info || (0 !== info.errno)) {
							console.log('获取今日热点新闻[' + obj.keyword + ']的内容失败, ' + obj.url);
							return callback(null);
						}
						_cacheTemp.content[obj.keyword] = info.data.news[0];
						// console.log(obj.keyword);
						tempArr.push(obj.keyword);
						redis_cache(obj.url, function(err, flag, data){
							console.log('是否存在-->',flag, data, !flag && data == 'OK');
							if(!flag && data == 'OK'){
								//插入到数据库
								var arrContent = info.data.news[0].content;
								var arrImage = [];
								var strText = '';
								var sourcets = info.data.news[0].sourcets;
								console.log(sourcets);
								for (var i = 0; i < arrContent.length; i++) {
									if(arrContent[i].type == 'image'){
										arrImage.push(arrContent[i].data.big.url);
										strText += '<img src="' + arrContent[i].data.big.url + '" />';
									}else{
										strText += '<p>' + arrContent[i].data + '</p>';
									}
								};
								var _obj = {
							        userID : userID,
							        title : obj.keyword,
							        content : {
							            images:arrImage,
							            text: strText
							        },
							        tags : ['热点新闻', obj.keyword],
							        setting : {
							            firmName : info.data.news[0].site,
							            phone : '',
							            price : '',
							            citys : [],
							            smallTitle : obj.keyword,
							            name : info.data.news[0].title,
							            behavior :  0,//置顶/无/精品
							            nature : '新闻',
							            sourceUrl : obj.url,//来源
							            contacts  : 0,
							            sourceType : 'crawler',
							            sourceTime : sourcets
							        },
							        coordinate : [0, 0],
							        location : []
							    };
							    // console.log(_obj);
							    postHttpHtmlYunLife(_obj, function(err, data){
							    	if (err) { 
							    		console.log('[w]>>>', obj.url, ' 插入错误');
							    		return callback(null);
							    	}
							    	console.log('[e]>>>', obj.url, ' 插入成功');
							    	return callback(null);
							    });
							}else{
								console.log('[r]>>>', obj.url, ' 已经存在于redis里');
								return callback(null);
							}
						});
					
					});
				},Math.random() * 2000 + 2000);
			}, function(err, result){
				console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>获取内容结束.');
				if(!err){
					_cacheTemp.keywords = tempArr;
					done();
				}else{
					done(err);
				}
			});
		},
	},function(err){
		if(!err){
			_cacheTemp.time = new Date().getTime();
			_cache = _cacheTemp;
			_tempTopList = [];
			console.log('>>>>>>>>>>>>>>>>>>>>>[' + getLocalTime(new Date().getTime()) + '] : 更新成功。');
		}else{
			console.log('>>>>>>>>>>>>>>>>>>>>>[' + getLocalTime(new Date().getTime()) + '] : 更新失败,原因为 ' + err);
		}
		flag = true;
	});
};


client.on('error', function(error) {
    console.log(error);
});


var redis_cache = function(url, callback){
	client.get('HOTNEWS_' + url, function(err, reply){
		if(!err){
			if(!!reply){
				callback(null, true, reply.toString());
			}else{
				client.set('HOTNEWS_' + url, url, function(err, reply){
					if(err){
						callback(err, false);
					}else{
						client.expire('HOTNEWS_' + url, 60*60*24*30);
						callback(null, false, reply.toString());
					}
				});
			}
		}else{
			callback(err);
		}
	});
};

function postHttpHtmlYunLife(obj, callback){
	request({
		url: LIFE_SERVER_SET_API, 
		method: 'POST',
		body: obj,
		json: true,
		headers: {
			'yunlife-token': 'whosyourdaddy'
		}
	}, function optionalCallback(err, httpResponse, body){
		if(err){
			callback(err);
		}else{
			callback(null, body);
		}
	});
}

function getHttpHtmlYunLife(tags, callback){
	console.log(LIFE_SERVER_GET_API + '/' + tags);
	request({
		url: LIFE_SERVER_GET_API + '/' + tags, 
		method: 'GET',
		json: true,
		headers: {
			'yunlife-token': 'whosyourdaddy'
		}
	}, function optionalCallback(err, httpResponse, body){
		if(err){
			callback(err);
		}else{
			callback(null, body);
		}
	});
}

function getHttpHtml(urlText, callback){

	request({
		url: urlText,
		method: 'GET',
		timeout: 3000
	}, function optionalCallback (err, res, body){
		err && console.log(err);
	    if(err) return callback(err);
	    callback(err, res.statusCode, body);
	});
}

/* 时间 */
function getLocalTime(time){
	var d = new Date(time);
    var thisTime = getZeroize(d.getFullYear()) + '-' + 
                 getZeroize(d.getMonth() + 1) + '-' + 
                 getZeroize(d.getDate()) + ' ' + 
                 getZeroize(d.getHours()) + ':' + 
                 getZeroize(d.getMinutes()) + ':' + 
                 getZeroize(d.getSeconds());
    return thisTime;
};
/* 补零 */
function getZeroize(num){
    return num < 10 ? '0' + num : num;
};