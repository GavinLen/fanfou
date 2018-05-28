var express = require('express');
var path = require('path');
var multipart = require('connect-multiparty');// 上传文件需要的模块
var fs = require('fs');// 移动文件需要的模块

var logUtils = require('../../libs/logUtils');
var config = require('../../libs/config');

var router = express.Router();
var multipartMiddleware = multipart();
var log4js = logUtils.log4js;
var LOGGER = log4js.getLogger('upload');

var fileUploadConfig = config.fileUploadConfig;
var fileUploadDir = fileUploadConfig.fileUploadDir;
var analyzeFileTypes = fileUploadConfig.analyzeFileTypes;
var maxAnalyzeFileSize = fileUploadConfig.maxAnalyzeFileSize;
var flowChartTypes = fileUploadConfig.flowChartTypes;
var maxFlowChartSize = fileUploadConfig.maxFlowChartSize;

router.get('', function (req, res, next) {
    LOGGER.info('Req To upload:[%s].', 'abc');
    res.send('To Get');
});

router.post('/file', multipartMiddleware, function (req, res, next) {
    var body = req.body;
    var files = req.files;

    LOGGER.info(body);
    LOGGER.info(files);

    var name = body.name;
    var version = body.version;
    var depict = body.depict;
    var tag = body.tag;
    var param = body.param;

    // // 内容校验
    // if (name == undefined || name == '' || version == undefined || version == '') {
    //     res.send('请求参数不合法');
    //     return;
    // }

    var file = files.file;
    var flowChart = files.flowChart;
    if (file == undefined || flowChart == undefined) {
        res.send('请求参数不合法');
        return;
    }

    // 校验 file
    var verifyResult = false;
    var fileInfo = req.files.file;
    var fileType = fileInfo.type;// 类型
    var fileSize = fileInfo.size;// 大小
    var filePath = fileInfo.path;// 临时路径
    var fileOriginalFilename = fileInfo.originalFilename;// 原文件名
    var fileSuffix = path.extname(fileOriginalFilename);// 后缀

    // 验证上传文件的类型
    if (!analyzeFileTypes.indexOf(fileType)) {
        LOGGER.error('类型不允许上传');
        verifyResult = false;
    } else {
        verifyResult = true;
    }
    // 验证上传文件的大小
    if (fileSize > maxAnalyzeFileSize) {
        LOGGER.error('大小不允许上传');
        verifyResult = false;
    } else {
        verifyResult = true;
    }

    // 校验 flowChart
    var flowChartType = flowChart.type;// 类型
    var flowChartSize = flowChart.size;// 大小
    var flowChartPath = flowChart.path;// 临时路径
    var flowChartOriginalFilename = flowChart.originalFilename;// 原文件名
    var flowChartSuffix = path.extname(flowChartOriginalFilename);// 后缀

    // 验证上传文件的类型
    if (!flowChartTypes.indexOf(fileType)) {
        LOGGER.error('类型不允许上传');
        verifyResult = false;
    } else {
        verifyResult = true;
    }
    // 验证上传文件的大小
    if (fileSize > maxFlowChartSize) {
        LOGGER.error('大小不允许上传');
        verifyResult = false;
    } else {
        verifyResult = true;
    }

    // 处理结果
    if (verifyResult) {
        LOGGER.info('上传成功');

        // 移动 file
        var fileSource = fs.createReadStream(filePath);
        var newFilePath = fileUploadDir + name + '-' + version + '.' + fileSuffix;
        var fileDest = fs.createWriteStream(newFilePath);

        fileSource.pipe(fileDest);
        fileSource.on('end', function () {
            fs.unlinkSync(filePath)
        });

        // 移动 flowChart
        var flowChartSource = fs.createReadStream(flowChartPath);
        var newFlowChartPath = fileUploadDir + name + '-' + version + '.' + flowChartSuffix;
        var FlowChartDest = fs.createWriteStream(newFlowChartPath);

        flowChartSource.pipe(FlowChartDest);
        flowChartSource.on('end', function () {
            fs.unlinkSync(flowChartPath)
        });

        res.send('SUCCESS');
    } else {
        LOGGER.info('上传失败');
        res.send('ERROR');
    }
});

module.exports = router;
