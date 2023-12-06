const logger = require("./lib/logHelper").helper;
const db = require('./db');
const redisCli = require('./redis/redis-client');
const common = require('./common');


// redis初始化数据
function init_data() {
    logger.writeDebug("初始化redis数据 start");
    let domains = JSON.stringify(db.readFile(common.domain_name));
    logger.writeDebug("domains   " + domains)
    // redis.deletelistdata(common.domain_name);
    redisCli.set(common.domain_name, domains);

    // let table_spaces = JSON.stringify(db.readFile(common.table_spaces));
    // logger.writeDebug("table_spaces   " + table_spaces)
    // // redis.deletelistdata(common.domain_name);
    // redisCli.set(common.table_spaces, table_spaces);
    //
    // let dictionary_name = JSON.stringify(db.readFile(common.dictionary_name));
    // logger.writeDebug("dictionary_name   " + dictionary_name)
    // // redis.deletelistdata(common.domain_name);
    // redisCli.set(common.dictionary_name, dictionary_name);
    //
    // let table_name = JSON.stringify(db.readFile(common.table_name));
    // logger.writeDebug("table_name   " + table_name)
    // // redis.deletelistdata(common.table_name);
    // redisCli.set(common.table_name, table_name);


    logger.writeDebug("初始化redis数据 end");
}

const Models = {
    init_data: init_data,

};

module.exports = Models;
