/**
 * 对文件的操作
 */
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const iconv = require('iconv-lite');
const logger = require("./lib/logHelper").helper;
const common = require('./common');
const util = require('./util/util');
const redisCli = require('./redis/redis-client');



// const validator = require('validator');
// 表
const table_name = common.table_name;
// 数据字典
const dictionary_name = common.dictionary_name;
// 域
const domain_name = common.domain_name;
// 表空间
const table_space_name = common.table_spaces;

// JSON源数据路径
var sourcePath = util.getRourcePath();
// 生成SQL路径
var targerPath = util.getTargetPath();


/**
 * 读取目录下的所有文件
 * @param type 源文件目录
 * @returns [Array] 返回数据对象数组
 */
const readFile = function (type, system, dbType, parameter, code) {
    const results = new Array();
    const files = getPatternFiles(type, system, dbType, parameter, code);
    logger.writeDebug('files size:' + files.length);
    // 判断如果是table，则再获取最新table数据
    var datas = readFiles(files);
    /*
     logger.writeWarn('datas size:' + datas.length);
     if (util.isArray(datas) && datas.length > 0) {
     logger.writeDebug('----type: ' + type);
     if (type == common.table_name) { // 表
     datas.forEach(function (table, index, array) {
     results.push(getTable(table.code));
     });
     } else if (type == common.dictionary_name) {   // 数据字典
     datas.forEach(function (dictionary, index, array) {
     results.push(getDictionary(dictionary.code));
     });
     } else {  // 其他
     datas.forEach(function (data, index, array) {
     results.push(data);
     });
     }
     }
     return results;
     */
    return datas;
};

const readFileByPatternFiles = function (type, patternFiles) {
    const results = new Array();
    // const files = getPatternFiles(type, system, dbType, parameter, code);
    // logger.writeWarn('files size:' + files.length);
    // 判断如果是table，则再获取最新table数据
    var datas = readFiles(patternFiles);
    if (util.isArray(datas) && datas.length > 0) {
        logger.writeDebug('----type: ' + type);
        if (type == common.table_name) { // 表
            datas.forEach(function (table, index, array) {
                results.push(getTable(table.code));
            });
        } else if (type == common.dictionary_name) {   // 数据字典
            datas.forEach(function (dictionary, index, array) {
                results.push(getDictionary(dictionary.code));
            });
        } else {  // 其他
            datas.forEach(function (data, index, array) {
                results.push(data);
            });
        }
    }
    logger.writeDebug('----datas: ' + datas.length);
    return results;
};

/**
 * 根据规则获取文件全路径列表
 * @param type
 * @param system
 * @param dbType
 * @param parameter
 * @returns {*}
 */
const getPatternFiles = function (type, system, dbType, parameter, code) {
    var pattern = sourcePath + type;
    if (util.isNotNull(system)) {
        pattern = pattern + '/' + system;
    } else {
        pattern = pattern + '/**';
    }

    if (util.isNotNull(dbType)) {
        pattern = pattern + '/' + dbType;
    } else {
        pattern = pattern + '/**';
    }

    if (util.isNotNull(parameter)) {
        pattern = pattern + '/' + parameter;
    } else {
        pattern = pattern + '/**';
    }
    if (util.isNotNull(code)) {
        pattern = pattern + '/*' + code + '*.json';
    } else {
        pattern = pattern + '/*.json';
    }
    logger.writeDebug('getPatternFiles  db  pattern:  ' + pattern);
    return glob.sync(pattern, {nodir: true});
};


/**
 * 异步获取文件根据文件路径数组获取文件数组
 * @param files
 */
const readFiles = function (files) {
    const objs = new Array();
    if (util.isArray(files) && files.length > 0) {
        files.forEach(function (filePath) {
            const statFile = fs.statSync(filePath);
            if (!statFile.isDirectory()) {
                logger.writeDebug('db 读取的文件名:  ' + filePath);
                // 如果是文件，读取文件
                var fileStr = fs.readFileSync(filePath, {encoding: 'binary'});
                var buf = new Buffer(fileStr, 'binary');
                var data = iconv.decode(buf, 'GBK');
                const json = JSON.parse(data);
                objs.push(json);
            }
        });
    }
    return objs;
};


const delSourceFile = function (type, name) {
    // 目标路径  eg: data/source/tables/user.json
    var outPath = sourcePath + type;
    outPath = path.join(__dirname, '../', outPath, '/');
    const outFile = outPath + name + '.json'
    logger.writeDebug('---------------del path: ' + outFile);
    delFile(outFile);

};

const delFile = function (filePath) {
    logger.writeDebug('del file path: ' + filePath);
    if (fs.existsSync(filePath)) {
        logger.writeDebug('删除文件： ' + filePath);
        fs.unlinkSync(filePath);
    }
};
/**
 * 修改数据域同步到数据字典
 * @param type 类型:table\domains\table_spaces
 */
const updateDomain = function (domain, data) {

}
/**
 * 保存源数据文件 json 文件
 * @param type 类型:table\domains\table_spaces
 * @param name 文件名：用原对象的code
 * @param data ? 计划传拼接json数据 是否先用模板格式化?
 */
const writeSourceFile = function (type, name, data) {
    // 目标路径  eg: data/source/tables/user.json
    const outPath = sourcePath;
    util.checkAndCreateDir(outPath);
    const outFile = outPath + '/' + type + '/' + name + '.json';
    logger.writeDebug('要写入的数据： ' + data);
    // 把中文转换成字节数组
    const arr = iconv.encode(data, 'gbk');
    // 如果用writeFile，那么会删除旧文件，直接写新文件
    fs.writeFile(outFile, arr, function (err) {
        if (err) {
            logger.writeErr('写入 ' + type + '  ' + name + '.json 文件错误:  ' + err);
        } else {
            logger.writeInfo('写入 ' + type + '  ' + name + '.json 文件成功');
        }
    });
};

/**
 * 保存表，表特殊，根据属性创建目录
 * @param data
 */
const writeTableSourceFile = function (table, data) {
    // 目标路径  eg: data/source/tables/Ensemble/upright/init/user.json
    const outPath = sourcePath + table_name + '/' + table.system + '/' + table.dbType + '/' + table.parameter;
    logger.writeDebug('save table path: ' + outPath);
    util.checkAndCreateDir(outPath);
    const outFile = outPath + '/' + table.code + '.json';
    logger.writeDebug('要写入的数据： ' + data);
    // 把中文转换成字节数组
    const arr = iconv.encode(data, 'gbk');
    // 如果用writeFile，那么会删除旧文件，直接写新文件
    fs.writeFile(outFile, arr, function (err) {
        if (err) {
            logger.writeErr('写入 table  ' + table.code + '.json 文件错误:  ' + err);
        } else {
            logger.writeInfo('写入 table  ' + table.code + '.json 文件成功');
        }
    });
};


/**
 * 向指定路径写SQL文件
 * @param type 目标文件夹 (table、table_space)
 * @param name 文件名
 * @param data 文件内容
 */
const writeSQLFile = function (type, name, data, dbType) {
    const outPath = targerPath + '/' + dbType + '/';
    util.checkAndCreateDir(outPath);
    const outFile = outPath + name + '.sql';
    // 把中文转换成字节数组

    const arr = iconv.encode(data, 'gbk');
    // 异步写文件 writeFile，如果文件不存在，则创建；如果文件已存在，那么内容会被覆盖
    // writeFileSync 文件同步写接口，是fs.writeFile的同步版本 fs.writeFileSync(filename, data, [options])
    fs.writeFile(outFile, arr, function (err) {
        if (err) {
            logger.writeErr('写入 ' + type + '  ' + name + '.sql 文件错误:  ' + err);
        } else {
            logger.writeInfo('写入 ' + type + '  ' + name + '.sql 文件成功');
        }
    });
};

/**
 * 写文件
 * @param filePath 文件路径
 * @param suffix 后缀
 * @param data 写入的数据
 */
function writeFile(filePath, suffix, data) {
    const arr = iconv.encode(data, 'gbk');
    // 如果用writeFile，那么会删除旧文件，直接写新文件
    fs.writeFile(filePath, arr, function (err) {
        if (err) {
            logger.writeErr('写入 ' + filePath + ' 文件错误:  ' + err);
        } else {
            logger.writeInfo('写入 ' + filePath + ' 文件成功');
        }
    });
}

/**
 * 获取根据code获取表对象
 */
const getTable = function (code) {
    const pattern = sourcePath + table_name + '/**/' + code + '.json';
    var table = {};
    try {
        const files = glob.sync(pattern, {nodir: true});
        if (util.isArray(files) && files.length > 0) {
            const filePath = files[0];
            const statFile = fs.statSync(filePath);
            // logger.writeInfo(statFile.isFile());
            if (statFile.isFile()) {
                logger.writeDebug(filePath + ' 文件存在');

                var fileStr = fs.readFileSync(filePath, {encoding: 'binary'});
                var buf = new Buffer(fileStr, 'binary');
                var data = iconv.decode(buf, 'GBK');
                table = JSON.parse(data);
                // 20170423 新增如果表中列有数据字典，则获取数据字典的最新属性 start
                /*             if (table) {
                 const attrs = table.attr;
                 if (util.isArray(attrs)) {
                 attrs.forEach(function (attr, index, array) {
                 if (attr) {
                 const dictionaryCode = attr.dictionary;
                 if (util.isNotNull(dictionaryCode)) {
                 const dictionary = getDictionary(dictionaryCode);
                 if (util.isObject(dictionary)) {
                 ((table.attr)[index]).code = dictionary.code;
                 ((table.attr)[index]).dataType = dictionary.dataType;
                 ((table.attr)[index]).lengths = dictionary.lengths;
                 ((table.attr)[index]).precision = dictionary.precision;
                 ((table.attr)[index]).column = dictionary.comment;
                 ((table.attr)[index]).scope = dictionary.scope;
                 ((table.attr)[index]).defaults = dictionary.defaults;
                 }
                 }
                 }
                 })
                 }
                 }*/
                // 20170423 新增如果表中列有数据字典，则获取数据字典的最新属性 end
                // table = JSON.parse(fs.readFileSync(filePath));
            } else {
                logger.writeErr(filePath + ' 文件不存在');
            }
        } else {
            logger.writeErr(filePath + ' 文件不存在');
        }

    } catch (e) {
        logger.writeErr(filePath + ' 文件不存在');
    }

    return table;
};


/**
 * 获取根据code获取表对象getDictionary
 */
const getDictionary = function (code) {
    const filePath = sourcePath + dictionary_name + '/' + code + '.json';

    var dictionary = {};
    try {
        const statFile = fs.statSync(filePath);

        logger.writeDebug(statFile.isFile());

        if (statFile.isFile()) {
            logger.writeDebug(filePath + ' 文件存在');

            var fileStr = fs.readFileSync(filePath, {encoding: 'binary'});
            var buf = new Buffer(fileStr, 'binary');
            var data = iconv.decode(buf, 'GBK');
            dictionary = JSON.parse(data);
            // 20170423 新增如果数据字典中有数据域，则获取数据域的最新属性 start
            if (dictionary) {
                const domainCode = dictionary.domain;
                if (util.isNotNull(domainCode)) {
                    const domain = getDomain(domainCode);
                    if (domain) {
                        dictionary.dataType = domain.dataType;
                        dictionary.lengths = domain.lengths;
                        dictionary.precision = domain.precision;
                    }
                }
            }
            // 20170423 新增如果数据字典中有数据域，则获取数据域的最新属性 end
            // table = JSON.parse(fs.readFileSync(filePath));
        } else {
            logger.writeErr(filePath + ' 文件不存在');
        }
    } catch (e) {
        logger.writeErr(filePath + ' 文件不存在');
    }

    return dictionary;
};

/**
 * 获取根据code获取表对象
 */
const getDomain = function (code) {
    const filePath = sourcePath + 'domains/' + code + '.json';

    var domain = {};
    try {
        const statFile = fs.statSync(filePath);

        logger.writeDebug(statFile.isFile())

        if (statFile.isFile()) {
            logger.writeDebug(filePath + ' 文件存在');

            var fileStr = fs.readFileSync(filePath, {encoding: 'binary'});
            var buf = new Buffer(fileStr, 'binary');
            var data = iconv.decode(buf, 'GBK');
            domain = JSON.parse(data);

            // table = JSON.parse(fs.readFileSync(filePath));
        } else {
            logger.writeErr(filePath + ' 文件不存在');
        }
    } catch (e) {
        logger.writeErr(filePath + ' 文件不存在');
    }

    return domain;
};

/**
 * 根据模块ID查询table
 * @param system
 */
const getTableBySystem = function (system) {
    var tableRes = new Array();
    const allTables = this.readFile(table_name);
    if (util.isArray(allTables) && allTables.length > 0) {
        allTables.forEach(function (table, index, tables) {
            logger.writeDebug('table:  ' + JSON.stringify(table));
            if (util.isNotNull(system)) {
                if (table.system == system) {
                    tableRes.push(table);
                }
            }
        });
    }
    return tableRes;
};


/**
 * 获取所有domain对象
 */
const getAllDomains = function () {
    return this.readFile(domain_name);

    // TODO 从redis中获取  此刻从redis 同步取值问题未解决
    // let domains_data = redisCli.getSync("domains");
    // logger.writeDebug('domains_data11111:  ' + domains_data);
    // return JSON.parse(domains_data);
};

/**
 * 获取所有表空间对象
 */
const getAllTableSpaces = function () {
    return this.readFile(table_space_name);
};

/**
 * 获取默认的表空间
 */
const getDefaultTableSpace = function () {
    var defauleTableSpace;
    const allTableSpaces = this.getAllTableSpaces();
    allTableSpaces.forEach(function (tableSpace, index, array) {
        if (tableSpace.D == 'Y') {
            defauleTableSpace = tableSpace;
        }
    });
    return defauleTableSpace;
};

const Models = {
    getPatternFiles: getPatternFiles,
    readFile: readFile,
    writeSQLFile: writeSQLFile,
    writeSourceFile: writeSourceFile,
    writeTableSourceFile: writeTableSourceFile,
    delFile: delFile,
    delSourceFile: delSourceFile,
    getTableBySystem: getTableBySystem,
    getTable: getTable,
    getDomain: getDomain,
    getDictionary: getDictionary,
    getAllDomains: getAllDomains,
    getAllTableSpaces: getAllTableSpaces,
    getDefaultTableSpace: getDefaultTableSpace,
    readFileByPatternFiles: readFileByPatternFiles
};

module.exports = Models;
