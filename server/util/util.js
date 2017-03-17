const common = require('./../common');
const fs = require("fs");
const path = require("path");

const isObject = function (obj) {
    return obj instanceof Object;
};


const isArray = function (obj) {
    return typeof obj == "object" && obj.constructor == Array;
};


const isNull = function (obj) {
    return isNotNull(obj) ? false : true;
};

const isNotNull = function (obj) {
    if (null != obj && undefined != obj && '' != obj && 'undefined' != obj && obj.length > 0) {
        return true
    } else {
        return false;
    }

};

const nvl = function (source, target) {
    if (isNull(source)) {
        return target;
    }
    return source;
};

/**
 * 判断日志目录是否存在，不存在时创建日志目录
 * fs.mkdirSync('creatdir2', 0777); 目录权限（读写权限），默认0777
 * @param dirpath 将创建的目录路径
 * @returns {boolean}
 */
const checkAndCreateDir = function (dirname, authNum) {
    if (isNull(authNum)) {
        authNum = common.AUTH_NUM;
    }
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (checkAndCreateDir(path.dirname(dirname), authNum)) {
            fs.mkdirSync(dirname, authNum);
            return true;
        }
    }
};

const getRourcePath = function () {
    const fullPath = common.sourcePath.toLowerCase();

    // 约定以/开头的为linux/MAC 系统根目录 linux 路径 /home/renfei/...
    // 以c: d: e: 开头的为windows
    if (fullPath.startsWith("/") ||
        fullPath.startsWith("c:") ||
        fullPath.startsWith("d:") ||
        fullPath.startsWith("e:") ||
        fullPath.startsWith("f:") ||
        fullPath.startsWith("g:") ||
        fullPath.startsWith("h:") ||
        fullPath.startsWith("i:")) {

        return common.sourcePath;
    } else {
        // 项目内的相对路径
        return path.join(__dirname, "../../", common.sourcePath);
    }
};

const getTargetPath = function () {
    const fullPath = common.targerPath.toLowerCase();

    // 约定以/开头的为linux/MAC 系统根目录 linux 路径 /home/renfei/...
    // 以c: d: e: 开头的为windows
    if (fullPath.startsWith("/") ||
        fullPath.startsWith("c:") ||
        fullPath.startsWith("d:") ||
        fullPath.startsWith("e:") ||
        fullPath.startsWith("f:") ||
        fullPath.startsWith("g:") ||
        fullPath.startsWith("h:") ||
        fullPath.startsWith("i:")) {

        return common.targerPath;
    } else {
        // 项目内的相对路径
        return path.join(__dirname, "../../", common.targerPath);
    }
};

const Models = {
    nvl: nvl,
    isNull: isNull,
    isNotNull: isNotNull,
    isObject: isObject,
    isArray: isArray,
    getRourcePath: getRourcePath,
    getTargetPath: getTargetPath,
    checkAndCreateDir: checkAndCreateDir
};

module.exports = Models;