const express = require('express');
var glob = require('glob');
// const passport = require('passport');
const iconv = require('iconv-lite');
const fs = require("fs");
const logger = require('./lib/logHelper').helper;
const excel = require('./lib/excel');
const common = require('./common');
const router = express.Router();
const db = require('./db');
const utils = require('./util/tableUtil');
const util = require('./util/util');
const Paginate = require('./util/paginate');
// 子进程（child_process）
const exec = require('child_process').exec;


/**
 * API implacement
 * 接口符合RESTful风格
 */
var n = 0;

/**
 * 分页公共类
 * @param page  当前页
 * @param items 数据集合
 */
const pageUtils = function (page, total, items) {
    var paginate = new Paginate(page, common.PAGE_NUM, total, items);
    logger.writeDebug('page data: ' + JSON.stringify(paginate));
    return paginate;
};

/**
 * 分页设计逻辑：1.根据条件查询出符合条件的数据路径集合，计算出当前页的数据区间集合
 *             2.在根据数据路径获取真实文件数据
 * 因为每次全部查询出真实文件数据太消耗时间，所以这样设计
 * 分页数据过渡公共类：
 * @param page  当前页
 * @param items 数据路径集合
 */
const pageBeforeUtils = function (page, items) {
    var resItems = new Array();
    if (util.isNull(page) || parseInt(page) < 1) {
        page = 1;
    }

    logger.writeWarn('page:' + page);

    if (util.isArray(items) && items.length > 0) {
        items.forEach(function (item, index, array) {
            // 当前页的开始行数 (page -1) * common.PAGE_NUM
            const start = (page - 1) * common.PAGE_NUM;
            // 当前页的结束行数 page * common.PAGE_NUM - 1 或者是最大行数
            const end = page * common.PAGE_NUM - 1;
            if (index >= start && index <= end) {
                resItems.push(item);
            }
        });
    }
    return resItems;
}


/**
 * 根据name(源文件目录名字)获取对象数据
 */
router.get('/getAll/tables', function (req, res, next) {
    var obj;
    const start = process.uptime();
    const system = req.query.system.trim();
    const dbType = req.query.dbType.trim();
    const parameter = req.query.parameter.trim();
    const code = req.query.code.trim().toLocaleUpperCase();
    const tableSpace = req.query.tableSpace.trim();

    const page = req.query.page;

    logger.writeDebug('system: ' + system + '  dbType: ' + dbType + '   parameter: ' + parameter
            + '   code: ' + code + '   tableSpace: ' + tableSpace);

    // 查询所有符合条件的数据
    const patternAllFiles = db.getPatternFiles(common.table_name, system, dbType, parameter, code);
    logger.writeWarn('patternAllFiles: ' + JSON.stringify(patternAllFiles));
    // 分页处理
    const patternFiles = pageBeforeUtils(page, patternAllFiles);
    logger.writeWarn('patternFiles: ' + JSON.stringify(patternFiles));

    const datas = db.readFileByPatternFiles(common.table_name, patternFiles);
    obj = pageUtils(page, patternAllFiles.length, datas);

    logger.writeDebug('API JSON:   ' + JSON.stringify(obj));
    const end = process.uptime();
    logger.writeInfo('查询 tables 执行时间： ' + (end - start));

    res.status(200).send(obj).end();
});
/**
 * 根据name(源文件目录名字)获取对象数据
 */
router.get('/getAll/selectTables', function (req, res, next) {
    var obj;
    var start = process.uptime();
    const system = req.query.system.trim();
    const dbType = req.query.dbType.trim();
    const parameter = req.query.parameter.trim();
    const code = req.query.code.trim().toLocaleUpperCase();
    const tableSpace = req.query.tableSpace.trim();

    logger.writeDebug('system: ' + system + '  dbType: ' + dbType + '   parameter: ' + parameter
            + '   code: ' + code + '   tableSpace: ' + tableSpace);

    var result = db.readFile(common.table_name, system, dbType, parameter, code);
    obj = result;

    logger.writeDebug('API JSON:   ' + JSON.stringify(obj));
    var end = process.uptime();
    logger.writeInfo('查询 tables 执行时间： ' + (end - start));
    res.status(200).send(obj).end();
});
/**
 * 获取dictionarys
 */
router.get('/getAll/dictionarys', function (req, res, next) {
    var obj;
    const start = process.uptime();
    const code = req.query.code.toLocaleUpperCase();
    const page = req.query.page;
    logger.writeDebug('code: ' + code);
    // 查询所有符合条件的数据
    const patternAllFiles = db.getPatternFiles(common.dictionary_name, '', '', '', code);
    const patternFiles = pageBeforeUtils(page, patternAllFiles);
    logger.writeDebug('patternFiles: ' + JSON.stringify(patternFiles));
    const datas = db.readFileByPatternFiles(common.dictionary_name, patternFiles);
    if (page == '') {
        obj = db.readFileByPatternFiles(common.dictionary_name, patternAllFiles);
    } else {
        obj = pageUtils(page, patternAllFiles.length, datas);
    }
    var dictionaryRes = new Array();

    if (util.isArray(obj) && obj.length > 0) {
        obj.forEach(function (domain, index, domains) {
            logger.writeDebug('domain:  ' + JSON.stringify(domain));
            if (util.isNotNull(code)) {
                if (code.indexOf('@') == 0) {
                    if ((domain.code).indexOf(code.substr(1)) == 0) {
                        dictionaryRes.push(domain);
                    }
                } else if ((domain.code).indexOf(code) >= 0) {
                    dictionaryRes.push(domain);
                }
            }
        });
    }

    if (dictionaryRes.length > 0) {
        logger.writeDebug('dictionaryRes.length  ' + dictionaryRes.length);
        obj = dictionaryRes;
    } else {
    }

    var end = process.uptime();
    logger.writeInfo('查询 dictionarys 执行时间： ' + (end - start));

    res.status(200).send(obj).end();
});
/**
 * 获取dictionarys  不分页
 */
router.get('/getAll/dictionarysNotPage', function (req, res, next) {
    var obj;
    var start = process.uptime();
    const code = req.query.code.toUpperCase();

    logger.writeDebug('code: ' + code);

    var result = db.readFile(common.dictionary_name);
    logger.writeDebug('API JSON:   ' + JSON.stringify(result));

    var dictionaryRes = new Array();

    if (util.isArray(result) && result.length > 0) {
        result.forEach(function (domain, index, domains) {
            logger.writeDebug('domain:  ' + JSON.stringify(domain));
            if (util.isNotNull(code)) {
                if (code.indexOf('@') == 0) {
                    if ((domain.code).indexOf(code.substr(1)) == 0) {
                        dictionaryRes.push(domain);
                    }
                } else if ((domain.code).indexOf(code) >= 0) {
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
    logger.writeInfo('查询 dictionarys 执行时间： ' + (end - start));

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
    logger.writeInfo('查询 domains 执行时间： ' + (end - start));

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
    logger.writeInfo('查询 table_spaces  执行时间： ' + (end - start));

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
    var data = req.body.data;
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
        // data.code = (data.code).toUpperCase();
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
                table.dbType, table.parameter, table.code);
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
    logger.writeDebug('generatorSql start');
    var msg;
    const db_type = req.body.db_type;
    const type = req.body.type;
    const system = req.body.system;
    const dbType = req.body.dbType;
    const parameter = req.body.parameter;


    logger.writeDebug('db_type: ' + db_type);
    logger.writeDebug('type: ' + type);
    try {
        utils.generatorSql(db_type, type, system, dbType, parameter);

        msg = '生成SQL成功,<a>下载</a>';

        return res.status(200).send(msg).end();
    } catch (e) {
        logger.writeErr('生成SQL错误: ' + e)
        msg = '生成SQL错误，请重试';
    }
    logger.writeDebug('generatorSql end');
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
 * 删除表源文件（复杂路径）
 */
router.post('/deleteTableFile', function (req, res, next) {
    var msg;
    const table = req.body.table; // table对象

    logger.writeDebug('del table data: ' + JSON.stringify(table));

    try {

        var filePath = util.getRourcePath() + common.table_name + '/' + table.system + '/' + table.dbType
                + '/' + table.parameter + '/' + table.code + '.json';

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
 * 下载表数据
 */
router.post('/downLoad/tableSelect', function (req, res, next) {
    var data = req.body.data;
    logger.writeDebug('1down load talbe data --> ' + JSON.stringify(data, null, 4))
    if (!(util.isArray(data) && data.length > 0)) {
        data = db.readFile(common.table_name);
    }
    var rowTemp = new Array();
    data.forEach(function (table, index, tables) {
        rowTemp[index] = new Array();
        (rowTemp[index]).push(util.nvl(table.system, ''));
        (rowTemp[index]).push(util.nvl(table.dbType, ''));
        (rowTemp[index]).push(util.nvl(table.parameter, ''));
        (rowTemp[index]).push(util.nvl(table.code, ''));
        (rowTemp[index]).push(util.nvl(table.comment, ''));
        (rowTemp[index]).push(util.nvl(table.table_space, ''));
    });

    logger.writeDebug('2down load talbe rowTemp --> ' + rowTemp)

    var conf = {};
    conf.cols = [
        {caption: '所属系统', type: 'string'},
        {caption: '垂直/水平', type: 'string'},
        {caption: '出厂/业务', type: 'string'},
        {caption: '表名', type: 'string'},
        {caption: '描述', type: 'string'},
        {caption: '表空间', type: 'string'}
    ];
    conf.rows = rowTemp;

    const fileName = "表范围.xlsx";
    const headContent = excel.createHeader(fileName, req);
    logger.writeDebug('---------> headContent: ' + headContent);
    res.setHeader('Content-Disposition', headContent);

    excel.createExcel({
        data: conf,
        cb: function (path) {
            excel.download(path, req, res, false);
        }
    });

    // 文件生成成功，未下载

});
/**
 * 下载表的字段数据格式为md格式*/
router.post('/downLoad/tableSelectInfo', function (req, res, next) {
    var data = req.body.data;
    logger.writeDebug('1down load talbe data --> ' + JSON.stringify(data, null, 4))
    if (!(util.isArray(data) && data.length > 0)) {
        data = db.readFile(common.table_name);
    }
    var dataFile = '';
    var dataTypeFlagU = true;
    var dataSystemFlag = true;
    var dataType = null;
    var dataSystem = null;
    data.forEach(function (table, index, tables) {
        var code = table.code;
        var comment = table.comment;
        var system = table.system;
        var dbType = table.parameter;
        if (system == 'Accounting') {
            system = 'Accounting-会计核算';
        } else if (system == 'Limarket') {
            system = 'Limarket-统一定价';
        }
        if (system == 'Ensemble') {
            system = 'Ensemble-核心';
        }
        if (dbType == 'busi_para') {
            dbType = '业务参数';
        } else if (dbType == 'init_para') {
            dbType = '出厂参数';
        }
        if (dbType == 'tran') {
            dbType = '业务数据';
        }
        var resultTable = db.getTable(code);
        var num = 0;
        var numFlag = true;
        if (dataSystem != system && dataSystem != null) {
            dataSystemFlag = true;
        }
        if (dataSystemFlag == true) {
            dataFile = dataFile + '# ' + system + '\n[TOC]\n';
            dataType = dbType;
            dataSystemFlag = false;
        }
        if (dataType != dbType && dataType != null) {
            dataTypeFlagU = true;
        }
        if (dataTypeFlagU == true) {
            dataFile = dataFile + '## ' + dbType + '\n';
            dataType = dbType;
            dataTypeFlagU = false;
        }
        dataFile = dataFile + '### ' + (index + 1) + '.' + comment + ' ' + code;
        dataFile = dataFile + '\n\n';
        dataFile = dataFile + util.table('字段名', '数据类型', '长度', '是否为空', '主键', '描述', '取值范围', '默认值');
        resultTable.attr.forEach(function (tableAttr, index, tableAttrs) {
            if (numFlag == true) {
                dataFile = dataFile + '| ----------- | ------ | ---- | ---------------------------------------- |\n';
                numFlag = false;
            }
            var length = '(' + util.nvl(tableAttr.lengths);
            if (util.nvl(tableAttr.precision)) {
                length = length + ',' + tableAttr.precision;
            }
            length = length + ')';
            var m = 'Y';
            if (tableAttr.M == true) {
                m = 'N'
            }
            var p = 'N';
            if (tableAttr.P == true) {
                p = 'Y';
            }
            dataFile = dataFile + util.table(util.nvl(tableAttr.code, ''), util.nvl(tableAttr.dataType, ''), length, m, p, util.nvl(tableAttr.comment, ''), util.nvl(tableAttr.scope, ''), util.nvl(tableAttr.defaults, ''));
            num++;
        });
        dataFile = dataFile + "\n";
    });
    const outFile = 'md.md';
    const arr = iconv.encode(dataFile, 'gbk');
    try {
        fs.writeFile(outFile, arr, function (err) {
            if (err) {
                logger.writeErr('写入 文件错误:  ' + err);
            } else {
                logger.writeInfo('写入文件成功');
            }
        });
        return res.status(200).send("成功").end();
    } catch (e) {
        logger.writeErr('导出文件失败: ' + e);
        var msg = '导出文件失败，请重试' + e;
        return res.status(301).send(msg).end();
    }
    // 文件生成成功，未下载

});

/**
 * 下载表单元
 *用途：生成re图形文件。
 /*
 router.post('/downLoad/tableSelectRe', function (req, res, next) {
    var data = req.body.data;
    logger.writeDebug('1down load talbe data --> ' + JSON.stringify(data, null, 4))
    if (!(util.isArray(data) && data.length > 0)) {
        data = db.readFile(common.table_name);
    }
    var dataFile='';
    var tableList='';
    data.forEach(function (table, index, tables) {
        //
        var code=table.code;
        var resultTable = db.getTable(code);
        tableList=tableList+table.code+'\n';
// dataFile=dataFile+ util.table('字段名','数据类型','长度','是否为空','主键','描述','取值范围','默认值');
        dataFile=dataFile+'['+code+']'+' {bgcolor: \"#fcecec\"}\n';
        resultTable.attr.forEach( function (tableAttr,index1,tableAttrs)
        {
            if(index1<5){
                dataFile=dataFile+ util.erColumn(util.nvl(tableAttr.code, ''),tableAttr.M,tableAttr.P,util.nvl(tableAttr.comment, ''));
            }
        });
        dataFile=dataFile+"\n";
        //
    });
    dataFile=dataFile+"\n"+tableList;
    const outFile = 'nfldb.re';
    const arr = iconv.encode(dataFile, 'gbk');
    try{
        fs.writeFile(outFile, arr, function (err) {
            if (err) {
                logger.writeErr('写入 文件错误:  ' + err);
            } else {
                logger.writeInfo('写入文件成功');
            }
        });
        return res.status(200).send("成功").end();
    }catch (e){
        logger.writeErr('导出文件失败: ' + e);
        var msg = '导出文件失败，请重试'+e;
        return res.status(301).send(msg).end();
    }
    // 文件生成成功，未下载

});
 */
/**
 * 下载表的字段  excel格式
 */
/*router.post('/downLoad/tableSelectInfo', function (req, res, next) {
 var data = req.body.data;
 logger.writeDebug('1down load talbe data --> ' + JSON.stringify(data, null, 4))
 if (!(util.isArray(data) && data.length > 0)) {
 data = db.readFile(common.table_name);
 }

 var conf = {};
 conf.cols = [
 {caption: '所属表', type: 'string'},
 {caption: '列名', type: 'string'},
 {caption: '数据类型', type: 'string'},
 {caption: '长度', type: 'string'},
 {caption: '精度', type: 'string'},
 {caption: '是否必填', type: 'bool'},
 {caption: '是否主键', type: 'bool'},
 {caption: '描述', type: 'string'},
 {caption: '取值范围', type: 'string'},
 {caption: '默认值', type: 'string'},
 {caption: '数据字典', type: 'string'},
 {caption: '所属表中文名', type: 'string'}
 ];
 var num=0;
 var rowTemp = new Array();
 data.forEach(function (table, index, tables) {
 //
 var code=table.code;
 var comment=table.comment;
 var resultTable = db.getTable(code);
 resultTable.attr.forEach( function (tableAttr,index,tableAttrs)
 {
 rowTemp[num] = new Array();
 (rowTemp[num]).push(util.nvl(code, ''));
 (rowTemp[num]).push(util.nvl(tableAttr.code, ''));
 (rowTemp[num]).push(util.nvl(tableAttr.dataType, ''));
 (rowTemp[num]).push(util.nvl(tableAttr.lengths, ''));
 (rowTemp[num]).push(util.nvl(tableAttr.precision, ''));
 (rowTemp[num]).push(tableAttr.M);
 (rowTemp[num]).push(tableAttr.P);
 (rowTemp[num]).push(util.nvl(tableAttr.comment, ''));
 (rowTemp[num]).push(util.nvl(tableAttr.scope, ''));
 (rowTemp[num]).push(util.nvl(tableAttr.defaults, ''));
 (rowTemp[num]).push(util.nvl(tableAttr.dictionary, ''));
 (rowTemp[num]).push(util.nvl(comment, ''));
 num++;
 });

 //
 });

 logger.writeDebug('3down load talbe rowTemp --> ' + rowTemp)
 conf.rows = rowTemp;

 const fileName = "表范围.xlsx";
 const headContent = excel.createHeader(fileName, req);
 logger.writeDebug('---------> headContent: ' + headContent);
 res.setHeader('Content-Disposition', headContent);

 excel.createExcel({
 data: conf,
 cb: function (path) {
 excel.download(path, req, res, false);
 }
 });

 // 文件生成成功，未下载

 });*/
/**
 * 下载数据字典数据
 */
router.post('/downLoad/dictionarySelect', function (req, res, next) {
    var data = req.body.data;
    logger.writeDebug('1down load dictionary data --> ' + JSON.stringify(data, null, 4))
    if (!(util.isArray(data) && data.length > 0)) {
        data = db.readFile(common.table_name);
    }
    var rowTemp = new Array();
    data.forEach(function (table, index, tables) {
        rowTemp[index] = new Array();
        (rowTemp[index]).push(util.nvl(table.code, ''));
        (rowTemp[index]).push(util.nvl(table.comment, ''));
        (rowTemp[index]).push(util.nvl(table.scope, ''));
        (rowTemp[index]).push(util.nvl(table.lengths, ''));
        (rowTemp[index]).push(util.nvl(table.precision, ''));
        (rowTemp[index]).push(util.nvl(table.defaults, ''));
        (rowTemp[index]).push(util.nvl(table.domain, ''));
    });

    logger.writeDebug('2down load talbe rowTemp --> ' + rowTemp)

    var conf = {};
    conf.cols = [
        {caption: '名称', type: 'string'},
        {caption: '描述', type: 'string'},
        {caption: '取值范围', type: 'string'},
        {caption: '长度', type: 'string'},
        {caption: '精度', type: 'string'},
        {caption: '数据域', type: 'string'}
    ];
    conf.rows = rowTemp;

    const fileName = "表范围.xlsx";
    const headContent = excel.createHeader(fileName, req);
    logger.writeDebug('---------> headContent: ' + headContent);
    res.setHeader('Content-Disposition', headContent);

    excel.createExcel({
        data: conf,
        cb: function (path) {
            excel.download(path, req, res, false);
        }
    });

    // 文件生成成功，未下载

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
        ["姓名", '2015-06-29', false, 2.7182]
    ];

    const fileName = "导出excel.xlsx";
    const head = excel.createHeader(fileName, req);
    logger.writeDebug('---------> head: ' + head);
    res.setHeader('Content-Disposition', head);

    excel.createExcel({
        data: conf,
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
