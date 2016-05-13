'use strict';

var cacha = {
    keywords: [],
    list: [],
    content: {},
    set: function (data) {
        this.keywords = data.keywords;
        this.list = data.list;
        this.content = data.content;
    },
    getKeywords: function () {
        return this.keywords;
    },
    getContentByKeyword: function (keyword) {
        return this.content[keyword];
    }
};

module.exports = cacha;