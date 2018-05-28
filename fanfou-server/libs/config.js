var config = {
    redis: {
        port: process.env.redisPort || '6379',
        ip: process.env.redisId || '10.50.1.211',
        password: process.env.redisPassword || '',
        timeOut: process.env.redisTimeOut || '3000' //单位秒
    },
    mySql: {
        host: process.env.host || 'http://localhost:3306',
        ip: process.env.redisId || '10.50.1.211',
        username: process.env.redisId || 'root',
        password: process.env.redisPassword || 'Root4510@',
        database: process.env.redisPassword || 'db_test',
        timeOut: process.env.redisTimeOut || '3000' //单位秒
    },
    mongodb: {
        port: process.env.redisPort || 27017,
        ip: process.env.redisId || '10.50.1.211',
        password: process.env.redisPassword || '',
        timeOut: process.env.redisTimeOut || '3000' //单位秒
    },
    fileUploadConfig: {
        fileUploadTempDir: process.env.fileUploadTempDir || 'D:\\file\\temp',// 文件临时存储路径
        fileUploadDir: process.env.fileUploadTempDir || 'D:\\file\\',// 文件存储路径
        analyzeFileTypes: process.env.analyzeFileTypes || ['application/gzip', 'application/x-tar'],// 分析文件类型
        maxAnalyzeFileSize: process.env.maxAnalyzeFileSize || 1024 * 1024 * 1024,// 分析文件最大 1024M
        flowChartTypes: process.env.flowChartTypes || ['image/jpeg'],// 流程图类型
        maxFlowChartSize: process.env.maxFlowChartSize || 50 * 1024 * 1024, // FlowChart 最大为 50M

    }
};
module.exports = config;