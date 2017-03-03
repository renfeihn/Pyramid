var extend = require("extend");
var fs = require("fs");
var excelExport = require('excel-export');
var logger = require('./logHelper').helper;
var util = require('./../util/util');
var common = require('./../common');
var guid = require('guid');
var path = require('path');
var excel = function () {
    this.req = null;
    this.resp = null;
};
/**
 * 生成excel文件
 * @param params
 */
excel.prototype.createExcel = function (params) {
    var setting = {savePath: common.EXCEL_PATH};
    setting = extend({}, setting, params);
    var uuid = guid.create();
    var data = params.data || "";
    var result = excelExport.execute(data);
    var name = 'excel' + uuid + '.xlsx';

    const savePath = setting.savePath;
    util.checkAndCreateDir(savePath);

    var filePath = path.resolve(setting.savePath, name);
    fs.writeFile(filePath, result, 'binary', function (err) {
        logger.writeInfo('create excel over, path-->' + filePath);
        setting.cb(filePath);
    });
};
/**
 * 计算上次的断点信息
 * @param range
 * @returns {number}
 * @private
 */
excel.prototype._calStartPosition = function (range) {
    var startPos = 0;
    if (typeof range != 'undefined') {
        var startPosMatch = /^bytes=([0-9]+)-$/.exec(range);
        startPos = Number(startPosMatch[1]);
    }
    return startPos;
};

excel.prototype._configHeader = function (config) {
    var startPos = config.startPos,
        fileSize = config.fileSize,
        resp = this.resp;
    // 如果startPos为0，表示文件从0开始下载的，否则则表示是断点下载的。
    if (startPos == 0) {
        resp.setHeader('Accept-Range', 'bytes');
    } else {
        resp.setHeader('Content-Range', 'bytes ' + startPos + '-' + (fileSize - 1) + '/' + fileSize);
    }
    resp.writeHead(206, 'Partial Content', {
        'Content-Type': 'application/octet-stream'
    });
};

excel.prototype._init = function (filePath, down) {
    var config = {};
    var self = this;
    fs.stat(filePath, function (error, state) {
        if (error)
            throw error;
        config.fileSize = state.size;
        var range = self.req.headers.range;
        config.startPos = self._calStartPosition(range);
        self.config = config;
        self._configHeader(config);
        down();
    });
};

/**
 * 下载文件
 * @param filePath 文件路径
 * @param req
 * @param res
 * @param isDeleted 下载完成后是否删除文件，true删除
 */
excel.prototype.download = function (filePath, req, res, isDeleted) {
    var self = this;
    self.req = req;
    self.resp = res;
    fs.exists(filePath, function (exist) {
        if (exist) {
            self._init(filePath, function () {
                var config = self.config
                resp = self.resp;
                fReadStream = fs.createReadStream(filePath, {
                    encoding: 'binary',
                    bufferSize: 1024 * 1024,
                    start: config.startPos,
                    end: config.fileSize
                });
                fReadStream.on('data', function (chunk) {
                    resp.write(chunk, 'binary');
                });
                fReadStream.on('end', function () {
                    //是否删除文件
                    if (isDeleted) {
                        fs.unlink(filePath, function (err, res) {
                        });
                    }
                    resp.end();
                });
            });
        }
        else {
            console.log('文件不存在！');
            return;
        }
    });
};

excel.prototype.createHeader = function (fileName, req) {
    var header = '';
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
        header = 'attachment; filename=' + encodeURIComponent(fileName);
    } else if (userAgent.indexOf('firefox') >= 0) {
        header = 'attachment; filename*="utf8\'\'' + encodeURIComponent(fileName) + '"';
    } else {
        /* safari等其他非主流浏览器只能自求多福了 */
        header = 'attachment; filename=' + new Buffer(fileName).toString('binary');
    }
    return header;
};

module.exports = new excel();