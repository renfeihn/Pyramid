/**
 * 生成建表语句
 */
const fs = require("fs");
const logger = require("./../lib/logHelper").helper;
const db = require('./../db');
const ejs = require('ejs');
const common = require('./../common');
const util = require('./util');


/**
 * 生成sql
 * @param db_type 数据库类型
 * @param type 脚本类型eg: tables  domains  table_spaces\
 * @param system 系统
 */
const generatorSql = function (db_type, type, system, dbType, parameter) {
    logger.writeDebug('tableUtil generatorSql  db_type：'+db_type   );
    db_type = db_type.toLowerCase();
    type = type.toLowerCase();
    // const path = 'server/template/table_' + db_type + '.ejs';
    // const str = fs.readFileSync(path, 'utf8');
    // const datas = db.readFile(type);
    const datas = db.readFile(type, system, dbType, parameter);
    var tables_level = "";
    var tables_upright = "";
    datas.forEach(function (data) {
        // 如果表空间为空，获取默认表空间，如果没有默认表空间，则不指定表空间
        if (!(data.table_space)) {
            const defaultTS = db.getDefaultTableSpace();
            if (util.isNotNull(defaultTS) && util.isObject(defaultTS)) {
                data.table_space = defaultTS.code;
            }
        }
        const dbType = data.dbType;
        if (data.dbType == 'level')
            tables_level = tables_level + '@@./' + dbType + '/' + data.code + '.sql\r';
        if (data.dbType == 'upright')
            tables_upright = tables_upright + '@@./' + dbType + '/' + data.code + '.sql\r';
        const ret = generatorSqlOnline(type, db_type, data);
        // 写入到指定路径
        db.writeSQLFile(type, data.code, ret, dbType);
        logger.writeInfo(data.code + ' sql： ' + ret);
    });
    fs.writeFile(common.targerPath + '/' +system + '_runner_level.sql', tables_level, function (err) {
        if (err) {
            logger.writeErr('写入 ' + type + ' runner_level.sql 文件错误:  ' + err);
        } else {
            logger.writeInfo('写入 ' + type + ' runner_level.sql 文件成功');
        }
    });

    fs.writeFile(common.targerPath + '/' +system + '_runner_upright.sql', tables_upright, function (err) {
        if (err) {
            logger.writeErr('写入 ' + type + '  runner_upright.sql 文件错误:  ' + err);
        } else {
            logger.writeInfo('写入 ' + type + '  runner_upright.sql 文件成功');
        }
    });
};

/**
 * 生成sql
 * @param type 类型 table，table_space
 * @param db_type
 * @param data
 * @returns {String}
 */
const generatorSqlOnline = function (type, db_type, data) {
    const path = 'server/template/' + type + '_' + db_type + '.ejs';
    logger.writeDebug('模板路径： ' + path);
    const str = fs.readFileSync(path, 'utf8');
    if (common.comment == 'false') {
        data.commentIs = 'false';
    }
    if (common.commentTable == 'false') {
        data.commentTableIs = 'false';
    }
    const ret = ejs.render(str, {
        table: data,
        filename: path
    });
    return ret.substr(1);
};


const Models = {
    generatorSql: generatorSql,
    generatorSqlOnline: generatorSqlOnline
};

module.exports = Models;
