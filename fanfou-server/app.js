/**
 *
 * @type {createError}
 */
'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multipart = require('connect-multiparty');// 上传文件需要的模块

var config = require('./libs/config');
var interceptorUtils = require('./libs/interceptorUtils');

var fileUploadConfig = config.fileUploadConfig;
var loginInterceptor = interceptorUtils.loginInterceptor;
var tokenInterceptor = interceptorUtils.tokenInterceptor;

var test = require('./routes/test');// 测试
var upload = require('./routes/upload');// 文件上传

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart({uploadDir: fileUploadConfig.fileUploadTempDir}));

app.use(loginInterceptor);
app.use(tokenInterceptor);

app.use('/test', test);
app.use('/upload', upload);

app.use(loginInterceptor);
app.use(tokenInterceptor);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
