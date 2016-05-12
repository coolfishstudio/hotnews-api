'use strict';
var request = require('request');

module.exports = {
    //控制台打印
    getZeroize: function (num) {
        return num < 10 ? '0' + num : num;
    },
    getLocalTime: function (time) {
        var d = new Date(time);
        var thisTime = this.getZeroize(d.getFullYear()) + '-' + 
            this.getZeroize(d.getMonth() + 1) + '-' + 
            this.getZeroize(d.getDate()) + ' ' + 
            this.getZeroize(d.getHours()) + ':' + 
            this.getZeroize(d.getMinutes()) + ':' + 
            this.getZeroize(d.getSeconds());
        return thisTime;
    },
    console: function (str) {
        return console.log('[' + this.getLocalTime(new Date().getTime()) + ']: ', str);
    },
    //request get请求
    request: function (url, isJson, callback) {
        //格式化参数字段
        switch (arguments.length) {
            case 2:
                if ('function' === typeof isJson) {
                    callback = isJson;
                    isJson = undefined;
                }
                break;
            case 1:
                if ('function' === typeof url) {
                    callback = url;
                    url = undefined;
                }
        }
        if (!url) return callback('url不存在。');

        request({
            url: url,
            method: 'GET',
            json: !!isJson,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36'
            },
            timeout: 3000
        }, function optionalCallback (error, res, body) {
            callback(error, body)
        })
    },
};