'use strict';

try {
    module.exports = require('./config_current.js');
} catch (err) {
    module.exports = require('./config.default.js');
}
