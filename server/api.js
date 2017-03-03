const express = require('express');
var glob = require('glob');
// const passport = require('passport');
const logger = require('./lib/logHelper').helper;
const excel = require('./lib/excel');
const common = require('./common');
const router = express.Router();
const db = require('./db');
const utils = require('./util/tableUtil');
const util = require('./util/util');
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
router.get('/getAll/tables', function (req, res, next) {
    var obj;
    var start = process.uptime();
    const system = req.query.system.trim();
    const class1 = req.query.class1.trim();
    const class2 = req.query.class2.trim();
    const code = req.query.code.trim();
    const tableSpace = req.query.tableSpace.trim();

    logger.writeDebug('system: ' + system + '  class1: ' + class1 + '   class2: ' + class2
        + '   code: ' + code + '   tableSpace: ' + tableSpace);

    var result = db.readFile(common.table_name, system, class1, class2);
    var tableRes = new Array();

    if (util.isArray(result) && result.length > 0) {
        result.forEach(function (table, index, tables) {
            logger.writeDebug('table:  ' + JSON.stringify(table));
            if (util.isNotNull(code)) {
                if ((table.code).indexOf(code) >= 0) {
                    tableRes.push(table);
                }
            }

        });
    }

    if (tableRes.length > 0) {
        logger.writeDebug('tableRes.length  ' + tableRes.length);
        obj = tableRes;
    } else {
        obj = result;
    }

    logger.writeDebug('API JSON:   ' + JSON.stringify(obj));
    var end = process.uptime();
    logger.writeDebug('查询 tables 执行时间： ' + (end - start) + '  start: ' + start + ' end: ' + end);
    res.status(200).send(obj).end();
});

/**
 * 获取dictionarys
 */
router.get('/getAll/dictionarys', function (req, res, next) {
    var obj;
    var start = process.uptime();
    const code = req.query.code;

    logger.writeDebug('code: ' + code);

    var result = db.readFile(common.dictionary_name);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));

    var dictionaryRes = new Array();

    if (util.isArray(result) && result.length > 0) {
        result.forEach(function (domain, index, domains) {
            logger.writeDebug('domain:  ' + JSON.stringify(domain));
            if (util.isNotNull(code)) {
                if ((domain.code).indexOf(code) >= 0) {
                    dictionaryRes.push(domain);
                }
            }
        });
    }

    if (dictionaryRes.length > 0) {
        logger.writeDebug('dictionaryRes.length  ' + dictionaryRes.length);
        obj = dictionaryRes;
    } else {
        obj = result;
    }

    var end = process.uptime();
    logger.writeDebug('查询 dictionarys 执行时间： ' + (end - start) + '  start: ' + start + ' end: ' + end);

    res.status(200).send(obj).end();
});

/**
 * 获取domains
 */
router.get('/getAll/domains', function (req, res, next) {
    var obj;
    var start = process.uptime();
    const code = req.query.code;

    logger.writeDebug('code: ' + code);

    var result = db.readFile(common.domain_name);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));

    var domainRes = new Array();

    if (util.isArray(result) && result.length > 0) {
        result.forEach(function (domain, index, domains) {
            logger.writeDebug('domain:  ' + JSON.stringify(domain));
            if (util.isNotNull(code)) {
                if ((domain.code).indexOf(code) >= 0) {
                    domainRes.push(domain);
                }
            }
        });
    }

    if (domainRes.length > 0) {
        logger.writeDebug('domainRes.length  ' + domainRes.length);
        obj = domainRes;
    } else {
        obj = result;
    }

    var end = process.uptime();
    logger.writeDebug('查询 domains 执行时间： ' + (end - start) + '  start: ' + start + ' end: ' + end);

    res.status(200).send(obj).end();
});

/**
 * 获取表空间
 */
router.get('/getAll/table_spaces', function (req, res, next) {

    var start = process.uptime();
    logger.writeDebug('params: ' + req.params);

    var result = db.readFile(common.table_space_name);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));

    var end = process.uptime();
    logger.writeDebug('查询 table_spaces  执行时间： ' + (end - start) + '  start: ' + start + ' end: ' + end);

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
 * 根据code(源文件目录名字)获取对象数据
 */
router.get('/getDictionary/:code', function (req, res, next) {
    var result = db.getDictionary(req.params.code);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));
    res.status(200).send(result).end();
});

/**
 * 根据code(源文件目录名字)获取对象数据
 */
router.get('/getDomain/:code', function (req, res, next) {
    var result = db.getDomain(req.params.code);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));
    res.status(200).send(result).end();
});


/**
 * 保存table数据
 */
router.post('/saveTable', function (req, res, next) {
    var errors;
    // 后台接收的参数
    const data = req.body.data;
    const oldCode = req.body.oldCode;

    logger.writeDebug('后台接收的数据  data: ' + JSON.stringify(data) + ' oldCode : ' + oldCode);
    if (!data) {
        return res.status(301).send('数据不能为空').end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    var flag = checkTableCode(data, oldCode);
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors = '表名 ' + data.code + ' 已存在';
        logger.writeErr(errors);
        res.status(200).send(errors).end();
    } else {
        db.writeTableSourceFile(data, JSON.stringify(data, null, 4));
        errors = '保存成功';
        logger.writeInfo(errors);
        res.status(200).send(errors).end();
    }

});

/**
 * dictionary
 */
router.post('/saveDictionary', function (req, res, next) {
    var errors;
    // 后台接收的参数
    const data = req.body.data;
    const oldCode = req.body.oldCode;

    logger.writeDebug('后台接收的数据  data: ' + JSON.stringify(data) + ' oldCode : ' + oldCode);
    if (!data) {
        return res.status(301).send('数据不能为空').end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    var flag = checkCode(common.dictionary_name, data.code, oldCode);
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors = '数据字典 ' + data.code + ' 已存在';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    } else {
        db.writeSourceFile('dictionarys', data.code, JSON.stringify(data, null, 4));
        res.status(200).send('保存成功').end();
    }

});


/**
 * domain
 */
router.post('/saveDomain', function (req, res, next) {
    var errors;
    // 后台接收的参数
    const data = req.body.data;
    const oldCode = req.body.oldCode;

    logger.writeDebug('后台接收的数据  data: ' + JSON.stringify(data) + ' oldCode : ' + oldCode);
    if (!data) {
        return res.status(301).send('数据不能为空').end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    var flag = checkCode(common.domain_name, data.code, oldCode);
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors = '域名称 ' + data.code + ' 已存在';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    } else {
        db.writeSourceFile('domains', data.code, JSON.stringify(data, null, 4));
        res.status(200).send('保存成功').end();
    }

});

/**
 * 检查表名是否重复
 */
router.get('/checkTableCode/:code', function (req, res, next) {
    var errors;
    // 后台接收的参数
    const code = req.params.code;
    const oldCode = req.query.oldCode.trim();
    logger.writeDebug('后台接收的数据 code : ' + JSON.stringify(code) + '  oldCode: ' + oldCode);
    if (!code) {
        errors = '请填写表名！';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    // var flag = checkTableCode('tables', code, oldCode);
    var flag = false;
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors = '表名 ' + code + ' 已存在';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    }

    return res.status(200).send('').end();
});

/**
 * 检查dictionary是否有重复
 */
router.get('/checkDictionaryCode/:code', function (req, res, next) {
    var errors;
    // 后台接收的参数
    const code = req.params.code;
    const oldCode = req.query.oldCode.trim();
    logger.writeDebug('后台接收的数据 code : ' + JSON.stringify(code) + '  oldCode: ' + oldCode);
    if (!code) {
        errors = '请填写dictionary名称！';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    var flag = checkCode('dictionarys', code, oldCode);
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors = '数据字典 ' + code + ' 已存在';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    } else {
        return res.status(200).send('').end();
    }
});

/**
 * 检查domain是否有重复
 */
router.get('/checkDomainCode/:code', function (req, res, next) {
    var errors;
    // 后台接收的参数
    const code = req.params.code;
    const oldCode = req.query.oldCode.trim();
    logger.writeDebug('后台接收的数据 code : ' + JSON.stringify(code) + '  oldCode: ' + oldCode);
    if (!code) {
        errors = '请填写domain名称！';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    }

    // 服务端数据验证 表名唯一，表中字段不可重复
    var flag = checkCode(common.domain_name, code, oldCode);
    logger.writeDebug('flag: ' + flag);
    if (flag) {
        errors = 'domain ' + code + ' 已存在';
        logger.writeErr(errors);
        return res.status(301).send(errors).end();
    } else {
        return res.status(200).send('').end();
    }

});


/**
 * 检查code 唯一
 * @param code
 */
function checkCode(type, code, oldCode) {
    // 获取所有的table
    const tables = db.readFile(type);
    var flag = false;
    logger.writeDebug('检查code是否唯一  code: ' + tables + '  oldCode: ' + oldCode);
    if (oldCode != code) {
        if (null != tables && tables instanceof Array) {
            for (var i in tables) {
                logger.writeDebug('code: ' + code + '   tableCode:' + tables[i].code)
                if (code == tables[i].code) {
                    flag = true;
                    continue;
                }
            }
        }
    }
    return flag;
};

/**
 * 检查code 唯一
 * @param code
 */
function checkTableCode(table, oldCode) {
    var flag = false;
    if (oldCode != table.code) {
        // 获取满足条件的table 全路径
        const files = db.getPatternFiles(common.table_name, table.system,
            table.class1, table.class2);
        if (util.isArray(files) && files.length > 0) {
            flag = true;
        }
    }
    return flag;
};

/**
 * 单表view sql
 */
router.post('/showSQL', function (req, res, next) {
    var errors;

    const type = req.body.type;
    const db_type = req.body.db_type;
    const code = req.body.code; // 表名字
    var data = req.body.data;
    if (code) {
        if (type.toLowerCase() == (common.TABLE_TYPE).toLowerCase()) {
            data = db.getTable(code);
        } else if (type.toLowerCase() == 'domain') {

        }
    }

    logger.writeDebug('type: ' + type + ' db_type: ' + db_type + '  data: ' + JSON.stringify(data));
    try {
        const sql = utils.generatorSqlOnline(type, db_type, data);
        return res.status(200).send(sql).end();
    } catch (e) {
        logger.writeErr('生成SQL错误: ' + e)
        errors = '生成SQL错误，请重试';
    }
    return res.status(301).send(errors).end();

});


/**
 * 生成sql
 */
router.post('/generatorSql', function (req, res, next) {
    var msg;

    const db_type = req.body.db_type;
    const type = req.body.type;
    logger.writeDebug('db_type: ' + db_type);
    try {
        utils.generatorSql(db_type, type);

        msg = '生成SQL成功,<a>下载</a>';

        return res.status(200).send(msg).end();
    } catch (e) {
        logger.writeErr('生成SQL错误: ' + e)
        msg = '生成SQL错误，请重试';
    }
    return res.status(301).send(msg).end();

});

/**
 * 删除源文件
 */
router.post('/deleteFile', function (req, res, next) {
    var msg;
    const type = req.body.type; // 类型 table、domain、
    const code = req.body.code; // 名字

    logger.writeDebug('type: ' + type + '    code: ' + code)

    try {
        db.delSourceFile(type, code);
        msg = type + ' ' + code + ' 删除成功！';
        return res.status(200).send(msg).end();
    } catch (e) {
        logger.writeErr('删除文件错误: ' + e);
        msg = '删除文件错误，请重试';
    }
    return res.status(301).send(msg).end();
});

/**
 * 删除源文件
 */
router.post('/deleteTableFile', function (req, res, next) {
    var msg;
    const table = req.body.table; // table对象

    logger.writeDebug('del table data: ' + JSON.stringify(table));

    try {

        var filePath = common.sourcePath + common.table_name + '/' + table.system + '/' + table.class1
            + '/' + table.class2 + '/' + table.code + '.json';

        db.delFile(filePath);
        msg = '表 ' + table.code + ' 删除成功！';
        return res.status(200).send(msg).end();
    } catch (e) {
        logger.writeErr('删除文件错误: ' + e);
        msg = '删除文件错误，请重试';
    }
    return res.status(301).send(msg).end();
});


/**
 * 测试使用：
 * 根据name获取数据
 */
router.get('/test', function (req, res, next) {


    var conf = {};
    conf.cols = [
        {caption: 'string', type: 'string'},
        {caption: 'date', type: 'string'},
        {caption: 'bool', type: 'bool'},
        {caption: 'number', type: 'number'}
    ];
    conf.rows = [
        ['pi', '2015-06-29', true, 3.14],
        ["e", '2015-06-29', false, 2.7182]
    ];
    var filename = "导出excel.xlsx";
    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
    excel.createExcel({
        data: conf,
        savePath: "uploadFile/excel/",
        cb: function (path) {
            excel.download(path, req, res, true);
        }
    });


    // var pattern = 'data/source/tables/**/**/**/*.json';
    // glob(pattern, {nodir: true}, function (err, files) {
    //     if (err)
    //         console.lib(err);
    //     else
    //         console.lib(files);
    //     res.status(200).send(files).end();
    // });

    // res.status(200).send(common.table_name).end();

    // const objs = db.readFile('tables','Ensemble','upright','init');
    // res.status(200).send(objs).end();

    // 调用系统命令
    // exec('java -version', function (error, stdout, stderr) {
    //     console.lib('标准输出： ' + stdout);
    //     console.lib('错误输出： ' + stderr);
    // });


    // var flag = checkTableCcode('user');
    // logger.writeDebug('flag: ' + flag);


    // var result = db.getTable('user');
    // utils.generatorSql('mysql', 'table');
    // logger.writeDebug('JSON:   ' + JSON.stringify(result, null, 4));
    // res.status(200).send('').end();
});


module.exports = router;
