// redis-client.js
// 引用redisClient对象
const redisClient = require('./redis')
/**
 * redis set function
 * @param key
 * @param value
 * @param expire
 */
const set = (key, value, expire) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, function (err, result) {
            if (err) {
                reject(err)
            }

            if (!isNaN(expire) && expire > 0) {
                redisClient.expire(key, parseInt(expire)) //有效时间单位是秒
            }
            resolve(result)
        })
    })
}

/**
 * redis get function
 * @param key
 */
const get = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
};

/**
 * redis remove function
 * @param key
 */
const remove = (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, function (err, result) {
            if (err) {
                reject(err)
            }
            redisClient.expire(key, parseInt(-1))
            resolve(result)
        })
    })
}

// rpush 将给定值推入列表的右端 返回值 当前列表长度
const rpush = (key, token) => {
    return new Promise((resolve, reject) => {
        redisClient.rpush(key, [token], function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}
// 查询list的值
const lrange = (key, startIndex = 0, stopIndex = -1) => {
    return new Promise((resolve, reject) => {
        redisClient.lrange(key, startIndex, stopIndex, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}
// 清除list中n个值为value的项
const lrem = (key, n = 1, value) => {
    return new Promise((resolve, reject) => {
        redisClient.lrem(key, n, value, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

let text = async (key) => {
    let doc = await new Promise((resolve) => {
        redisClient.get(key, function (err, res) {
            return resolve(res);
        });
    });
    return JSON.parse(doc);
};


const getSync = function (key) {
    return redisClient.get(key);
};


module.exports = {
    getSync,
    get,
    set,
    remove,
    rpush,
    lrange,
    lrem
}
