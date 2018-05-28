var path = require('path');

var logUtils = require('../libs/logUtils');
var log4js = logUtils.log4js;
const LOGGER = log4js.getLogger('path');

const filePath = '/abcd/ef/123.tar';

/**
 * path.basename 返回 path 中的最后一部分 name，可以出去后缀
 */

LOGGER.info(path.basename(filePath));// 123.tar
LOGGER.info(path.basename(filePath, '.tar'));// 123

/**
 * path.delimiter 提供平台特定的路径分隔符：
 *  Windows - ;
 *  POSIX - :
 */
LOGGER.info();
