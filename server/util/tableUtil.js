/**
 * 生成建表语句
 */
const fs = require("fs");
const logger = require("./../log/logHelper").helper;
const db = require('./../db');
const ejs = require('ejs');


/**
 * 生成sql
 * @param db_type 数据库类型
 * @param type 脚本类型eg: table  domain  table_space
 */
const generatorSql = function (db_type, type) {
    db_type = db_type.toLowerCase();
    type = type.toLowerCase();
    // const path = 'server/template/table_' + db_type + '.ejs';
    // const str = fs.readFileSync(path, 'utf8');
    const datas = db.readFile("tables");
    datas.forEach(function (data) {
        // 如果表空间为空，获取默认表空间，如果没有默认表空间，则不指定表空间
        if (!(data.table_space)) {
            const defaultTS = db.getDefaultTableSpace();
            if (!(!defaultTS)) {
                data.table_space = defaultTS.code;
            }
        }
        const ret = generatorSqlOnline(type, db_type, data);
        // 写入到指定路径
        db.writeSQLFile(type, data.code, ret);
        logger.writeInfo(data.code + ' sql： ' + ret)
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
    const ret = ejs.render(str, {
        table: data,
        filename: path
    });

    return ret;
};


const Models = {
    generatorSql: generatorSql,
    generatorSqlOnline: generatorSqlOnline
};

module.exports = Models;