'use strict';

var express = require('express');
var router = express.Router();

var hotnewsController = require('./controller');

/* hotnews routes */
router.get('/', hotnewsController.findAllKeywords);
router.get('/:keyword', hotnewsController.getPostByKeyword);

module.exports = router;
