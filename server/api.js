const express = require('express');
// const passport = require('passport');
const logger = require('./log/logHelper').helper;
const router = express.Router();
const db = require('./db');
const utils = require('./util/tableUtil');
// 子进程（child_process）
const exec = require('child_process').exec;

/**
 * API implacement
 * 接口符合RESTful风格
 */
var n = 0;


/**
 * 根据name(源文件目录名字)获取对象数据
 */
router.get('/getAll/:name', function (req, res, next) {

    if (!req.params.name) {
        return next(new Error('未提供查询条件'));
    }

    var result = db.readFile(req.params.name);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));
    res.status(200).send(result).end();
});


/**
 * 测试使用：
 * 根据name获取数据
 */
router.get('/test', function (req, res, next) {
    // 调用系统命令
    // exec('java -version', function (error, stdout, stderr) {
    //     console.log('标准输出： ' + stdout);
    //     console.log('错误输出： ' + stderr);
    // });

    var result = db.getAllTables();
    utils.generatorSql('ORACLE'.toLowerCase(), 'table'.toLowerCase());
    logger.writeDebug('JSON:   ' + JSON.stringify(result));
    res.status(200).send(result).end();
});


module.exports = router;
