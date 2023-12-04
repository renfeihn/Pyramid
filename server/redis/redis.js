// redis.js
var redis = require('redis')
var common = require('../common');

const port = common.REDIS_SERCER_PORT
const ip = common.REDIS_SERVER_IP
const pwd = '' // 连接密码
var client = redis.createClient(port, ip, {
    auth_pass: pwd
}) //端口号、主机

// 配置redis的监听事件
// 准备连接redis-server事件
client.on('ready', function () {
    console.log('Redis连接成功')
})

// 连接到redis-server回调事件
client.on('connect', function () {
    // console.log('redis is now connected!')
})

client.on('reconnecting', function () {
    console.log('redis reconnecting')
})

client.on('end', function () {
    console.log('Redis Closed!')
})

client.on('warning', function () {
    console.log('Redis client: warning')
})

client.on('error', function (err) {
    console.error('Redis Error ' + err)
})

// 导出redis-client对象
module.exports = client
