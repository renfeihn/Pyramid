const redis = require('redis');
const common = require('./../common');
const logger = require("./../lib/logHelper").helper;

const client = redis.createClient(common.REDIS_SERCER_PORT, common.REDIS_SERVER_IP);


// 获取当前db中所有的key
function getdbnamelist() {
    // 相当于命令（keys *）, 返回list，包含当前db所有key的名字
    client.keys('*', function (err, val) {
        console.log(val);
        //callback(val);
    });
}


// 添加list数据
function insertListInDB(dbname, dbdata) {
    client.lpush(dbname, dbdata, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('insert[%d] 个数据 in db[%s] finished', dbdata.length, dbname);
        }
    });
}

// 查询指定的key中，指定位置的内容
function querylistdata(dbname) {
    //0 为起始位置，-1为最后的位置
    client.lrange(dbname, 0, -1, function (err, val) {
        if (err) {
            console.log(err);
        } else {
            console.log('read data from DB success. data length=[%d]', val.length);
            console.log(val)
        }
    });
}

// get
function get(key) {
    client.get(key, function (err, val) {
        if (err) {
            console.log(err);
        } else {
            console.log('read data from DB success. data [%s]=[%s]', key, val);
        }
    })
}

// set
function set(key, value) {
    client.set(key, value, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('read data from DB success. data [%s]=[%s]', key, value);
        }
    })
}

//删除
function deletelistdata(dbname) {
    //保留指定位置的内容，其他全部删除，所以从0到-1就是一个不删； 从-1到0就是数据全部删除，相当于del key
    client.ltrim(dbname, -1, 0, function (err, val) {
        console.log('delet all data in db[%s] ，finished val=[%s] ', dbname, val);
    });
}

// 更新指定位置内容
function updatelist(dbname, dbdataindex, newinfo) {
    client.lset(dbname, dbdataindex, newinfo, function (err, val) {
        console.log('update dbdataindex[%s] data.length=[%s],dbname=【%s】 finished val=[%s] ', dbdataindex, newinfo.length, dbname, val);
    });
}


const Models = {
    get: get,
    set: set
};

module.exports = Models;