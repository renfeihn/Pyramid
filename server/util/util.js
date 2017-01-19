const isObject = function (obj) {
    return obj instanceof Object;
};


const isArray = function (obj) {
    return typeof obj == "object" && obj.constructor == Array;
};


const isNull = function (obj) {
    console.log('isNull: ' + obj);
    return isNotNull(obj) ? false : true;
};

const isNotNull = function (obj) {
    if (null != obj && undefined != obj && '' != obj && obj.length > 0) {
        return true
    } else {
        return false;
    }

};


const Models = {
    isNull: isNull,
    isNotNull: isNotNull,
    isObject: isObject,
    isArray: isArray
};

module.exports = Models;