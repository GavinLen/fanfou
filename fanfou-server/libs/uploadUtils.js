/**
 * Created by RONGLIAN on 2016/1/26.
 */
'use strict';
var events = require("events");
var util = require("util");
var formidable = require('formidable');
var stream = require('stream');
var fs = require('fs');
var uuid = require('node-uuid');
var path = require("path");
//var URL = require('url');

var logUtils = require('./logUtils');
var constants = require("./constants");

var LOGGER = logUtils.log4js.getLogger('uploadUtil');


function uploadUtils() {
    //进度需要进行事件监听
    events.EventEmitter.call(this);

    UploadUtilsEvent = this;

    /**
     *
     * @param req 请求对象
     * @param callback 回调
     * @param callback.err 错误对象
     * @param callback.files 保存mongodb后的文件对象数组
     * @param callback.fields form表单字段
     */
    this.upload = function (req, uploadOption, fileUploadConfig, callback) {
        var uploadFileSize = fileUploadConfig['maxFilesSize'];
        if (uploadFileSize == undefined) {
            uploadFileSize = 100 * 1024 * 1024;
        }
        var form = new formidable.IncomingForm();
        for (var key in uploadOption) {
            form[key] = uploadOption[key];
        }
        var allFiles = [];
        var allField = {};
        var uploadError = false;
        var myerr = null;
        var myProgress = 0;
        var totalFiles = 0;
        var savedFiles = 0;
        var requestEnded = false;
        var asyncProgress = function (value) {
            if (myProgress === value) {
                return;
            }
            myProgress = value;
            UploadUtilsEvent.emit('progress', value);
        }

        function requestEnd() {
            if (requestEnded) {
                if (totalFiles === savedFiles) {
                    callback(myerr, allFiles, allField);
                }
            }
        }

        //递归创建目录 同步方法
        function mkdirsSync(dirname) {
            try {
                if (fs.existsSync(dirname)) {
                    return true;
                } else {
                    if (mkdirsSync(path.dirname(dirname))) {
                        fs.mkdirSync(dirname);
                        return true;
                    }
                }
            } catch (e) {
                logger.error("create director fail! path=" + dirname + " errorMsg:" + e);
                return false;
            }
        }

        form
            .on('error', function (err) {
                callback(err);
            })
            .on('progress', function (bytesReceived, bytesExpected) {
                if (bytesReceived === 0) {
                    asyncProgress(0)
                } else {
                    var progress = bytesReceived / bytesExpected;
                    asyncProgress(progress);
                }
            })
            .on('field', function (name, value) {
                allField[name] = value;
            })
            .on('file', function (name, file) {
                if (uploadError) {
                    console.log('错误了')
                    return;
                }
                if (file.size > uploadFileSize) {
                    myerr = {
                        status: 'FAILURE',
                        result: "上传文件不能超过100M"
                    }
                    return;
                }
                totalFiles++;
                //文件真实名称
                var myUuid = uuid.v1();
                var fileRealName = myUuid + '-' + file.name;
                var fileUploadPath = fileUploadConfig.uploadDir + constants.PAAS_TENANT_ID + '/';
                //文件目录不存在，创建目录
                mkdirsSync(fileUploadPath);
                var uploadStream = fs.createWriteStream(fileUploadPath + myUuid);
                fs
                    .createReadStream(file.path)
                    .pipe(uploadStream)
                    .on('finish', function onFinish() {
                        fs.unlink(file.path, function () {
                            console.log('成功删除临时文件' + file.path);
                        });
                        fs.renameSync(fileUploadPath + myUuid, fileUploadPath + fileRealName);
                        allField.filePath = fileUploadPath;
                        allField.fileName = file.name;
                        allField.fileSize = file.size;
                        allField.generationType = 0;
                        allField.projectId = req.cookies.projectId;
                        allField.fileRealName = fileRealName;
                        if (allField.autoUnpack == "")
                            allField.autoUnpack = 0;
                        allField.accessPermission = 1;//复制和链接权限
                        allField.projectName = req.cookies.projectName;
                        allFiles.push(allField);
                        req.body.allField = allField;
                        savedFiles++;
                        requestEnd();
                    });
            })
            .on('end', function () {
                //callback(myerr,allFiles,allField);
                requestEnded = true;
                requestEnd();
            });
        form.parse(req, function (err, fields, files) {
            if (err) {
                callback(err);
            }
        });
    }
    /**
     *
     * @param req 请求对象
     * @param callback 回调
     * @param callback.err 错误对象
     * @param callback.files 保存mongodb后的文件对象数组
     * @param callback.fields form表单字段
     */
    this.uploadBuild = function (req, uploadOption, fileUploadConfig, callback) {
        var uploadFileSize = fileUploadConfig['maxFilesSize'];
        if (uploadFileSize == undefined) {
            uploadFileSize = 100 * 1024 * 1024;
        }
        var form = new formidable.IncomingForm();

        for (var key in uploadOption) {
            form[key] = uploadOption[key];
        }
        var allFiles = [];
        var allField = {};
        var uploadError = false;
        var myerr = null;
        var myProgress = 0;
        var totalFiles = 0;
        var savedFiles = 0;
        var requestEnded = false;
        var asyncProgress = function (value) {
            if (myProgress === value) {
                return;
            }
            myProgress = value;
            UploadUtilsEvent.emit('progress', value);
        }

        function requestEnd() {
            if (requestEnded) {
                if (totalFiles === savedFiles) {
                    callback(myerr, allFiles, allField);
                }
            }
        }

        //递归创建目录 同步方法
        function mkdirsSync(dirname) {
            try {
                if (fs.existsSync(dirname)) {
                    return true;
                } else {
                    if (mkdirsSync(path.dirname(dirname))) {
                        fs.mkdirSync(dirname);
                        return true;
                    }
                }
            } catch (e) {
                logger.error("create director fail! path=" + dirname + " errorMsg:" + e);
                return false;
            }
        }

        form
            .on('error', function (err) {
                callback(err);
            })
            .on('progress', function (bytesReceived, bytesExpected) {
                if (bytesReceived === 0) {
                    asyncProgress(0)
                } else {
                    var progress = bytesReceived / bytesExpected;
                    asyncProgress(progress);
                }
            })
            .on('field', function (name, value) {
                allField[name] = value;
            })
            .on('file', function (name, file) {
                if (uploadError) {
                    console.log('错误了')
                    return;
                }
                if (file.size <= 0) {
                    console.log('没有文件');
                    return;
                }
                if (file.size > uploadFileSize) {
                    myerr = {
                        status: 'FAILURE',
                        result: "上传文件不能超过100M"
                    }
                    return;
                }
                totalFiles++;
                //文件真实名称
                var myUuid = uuid.v1();
                var fileRealName = file.name;
                var fileUploadPath = fileUploadConfig.uploadDir + myUuid + '/';
                //文件目录不存在，创建目录
                mkdirsSync(fileUploadPath);
                var uploadStream = fs.createWriteStream(fileUploadPath + myUuid);
                fs
                    .createReadStream(file.path)
                    .pipe(uploadStream)
                    .on('finish', function onFinish() {
                        fs.unlink(file.path, function () {
                            console.log('成功删除临时文件' + file.path);
                        });
                        fs.renameSync(fileUploadPath + myUuid, fileUploadPath + fileRealName);
                        allField.filePath = fileUploadPath;
                        allField.fileName = file.name;
                        allField.fileRealName = fileRealName;
                        allFiles.push(allField);
                        req.body.allField = allField;
                        savedFiles++;
                        requestEnd();
                    });
            })
            .on('end', function () {
                //callback(myerr,allFiles,allField);
                requestEnded = true;
                requestEnd();
            });
        form.parse(req, function (err, fields, files) {
            if (err) {
                callback(err);
            }
        });
    }
}


util.inherits(uploadUtils, events.EventEmitter);

module.exports = uploadUtils;