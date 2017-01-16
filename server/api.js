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
router.get('/getAll/:code', function (req, res, next) {

    if (!req.params.code) {
        return next(new Error('未提供查询条件'));
    }

    var start = process.uptime();

    var result = db.readFile(req.params.code);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));

    var end = process.uptime();
    logger.writeDebug('执行时间： ' + (end - start) + '  start: ' + start + ' end: ' + end);

    res.status(200).send(result).end();
});

/**
 * 根据name(源文件目录名字)获取对象数据
 */
router.get('/getTable/:code', function (req, res, next) {
    var result = db.getTable(req.params.code);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));
    res.status(200).send(result).end();
});


/**
 * 保存table数据
 */
router.post('/saveTable', function (req, res, next) {
    var errors = new Array();
    // 后台接收的参数
    const data = req.body.data;
    logger.writeDebug('后台接收的数据： ' + JSON.stringify(data));
    if (!data) {
        return res.status(301).send('数据不能为空').end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    var flag = checkTableCcode(data.code);
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors.push('表名 ' + data.code + ' 已存在');
    }

    if (errors.length > 0) {
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    } else {
        db.writeSourceFile('tables', data.code, JSON.stringify(data, null, 4));
        res.status(200).send('保存成功').end();
    }

});


router.get('/checkTableCode/:code', function (req, res, next) {
    var errors = new Array();
    // 后台接收的参数
    const code = req.params.code;
    logger.writeDebug('后台接收的数据： ' + JSON.stringify(code));
    if (!code) {
        errors.push('请填写表名！');
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    var flag = checkTableCcode(code);
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors.push('表名 ' + code + ' 已存在');
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    }

    return res.status(200).send('').end();
});

/**
 * 检查表code 唯一
 * @param code
 */
function checkTableCcode(code) {
    // 获取所有的table
    var tables = db.readFile('tables');
    var flag = false;
    logger.writeDebug('tables: ' + tables);
    if (null != tables && tables instanceof Array) {
        for (var i in tables) {
            logger.writeDebug('code: ' + code + '   tableCode:' + tables[i].code)
            if (code == tables[i].code) {
                flag = true;
                continue;
            }
        }
    }
    return flag;
};

/**
 * 单表view sql
 */
router.post('/showSQL', function (req, res, next) {
    var errors = new Array();

    const type = req.body.type;
    const db_type = req.body.db_type;
    const data = req.body.data;

    logger.writeDebug('type: ' + type + ' db_type: ' + db_type + '  data: ' + JSON.stringify(data));
    try {
        const sql = utils.generatorSqlOnline(type, 'mysql', data);
        return res.status(200).send(sql).end();
    } catch (e) {
        logger.writeErr('生成SQL错误: ' + e)
        errors.push('生成SQL错误，请重试');
    }
    return res.status(301).send(errors).end();

});


/**
 * 单表view sql
 */
router.post('/showSQL', function (req, res, next) {
    var errors = new Array();

    const db_type = req.body.db_type;

    logger.writeDebug('db_type: ' + db_type);
    try {
        utils.generatorSql('mysql', 'table');
        return res.status(200).send('生成sql成功').end();
    } catch (e) {
        logger.writeErr('生成SQL失败: ' + e)
        errors.push('生成SQL失败，请重试');
    }
    return res.status(301).send(errors).end();

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


    // var flag = checkTableCcode('user');
    // logger.writeDebug('flag: ' + flag);


    // var result = db.getTable('user');
    utils.generatorSql('mysql', 'table');
    // logger.writeDebug('JSON:   ' + JSON.stringify(result, null, 4));
    res.status(200).send('').end();
});


module.exports = router;
