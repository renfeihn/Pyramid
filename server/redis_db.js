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


    logger.writeDebug("初始化redis数据 end");
}

const Models = {
    init_data: init_data,

};

module.exports = Models;
