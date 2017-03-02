/*
 *  载入依赖项
 *  fs：文件系统； path：href解决文案；
 *  body-parser：解析Request body和处理req
 *  api：处理前台请求的接口
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');
const logger = require("./log/logHelper").helper;

const log = require('./log/logHelper');
const app = express();
const resolve = file => path.resolve(__dirname, file);
// 将日志系统加入到应用中
log.use(app);

/*
 * 监听8080端口
 * 用JSON格式处理bodyParser请求
 */
app.set('port', (process.env.port || 8080));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.set('view engine', 'ejs');

app.use(api);   //最好放在下边

/**
 * 设置静态资源目录为dist
 * 排除api接口的路由，向浏览器发送根文件 **需要是放开此路由**
 */
app.use('/dist', express.static(resolve('../dist')));
app.get('*', function (req, res, next) {
    // if (req.originalUrl.indexOf('/tableList') != 0) {
        const html = fs.readFileSync(resolve('../index.html'), 'utf-8');
        res.send(html);
    // } else {
    //     next();
    // }
});

app.listen(app.get('port'), function () {
    logger.writeInfo('---- Server up: http://localhost:' + app.get('port') + ' ----');
});
