# hotnews-api

## Introduction

* Description : 这是一个今日热点的新闻api，通过对百度风云榜的数据抓取，获得新闻关键词，再在搜索引擎进行搜索，得到链接，通过接口获取文章内容，从而实现内容的抓取，数据每一小时一更新
* Engineer : Yves <461836324@qq.com>
* CreateTime : 2016-05-12

## Installation
```
    $ git clone https://github.com/coolfishstudio/hotnews-api.git
    $ cd hotnews-api
    $ cp config/config.default.js config/config_current.js
    $ npm install
```
## Run
```
    $ node app.js
```
## Api
```
    /ping                           //检测接口是否正常
    /v1/hotnews                     //获取热门新闻关键词
    /v1/hotnews/keyword             //根据新闻关键词获取内容
```

个人项目请勿商用