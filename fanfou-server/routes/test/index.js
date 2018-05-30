/**
 *
 * @type {*|createApplication}
 */
'use strict';
var express = require('express');
var router = express.Router();
var logUtils = require('../../libs/logUtils');

var log4js = logUtils.log4js;
var LOGGER = log4js.getLogger('test');

router.get('', function (req, res, next) {
    LOGGER.info('');
});

module.exports = router;