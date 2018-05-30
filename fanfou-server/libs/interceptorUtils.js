/**
 *
 */
'use strict';
var logUtils = require('./logUtils');

var LOGGER = logUtils.log4js.getLogger(interceptorUtils);

var interceptorUtils = {
    /**
     * 登录拦截器
     * @param req
     * @param res
     * @param next
     */
    loginInterceptor: function (req, res, next) {
        LOGGER.info('Login Interceptor');
        next();
    },
    tokenInterceptor: function (req, res, next) {
        LOGGER.info('Token Interceptor');
        next();
    }
};

module.exports = interceptorUtils;