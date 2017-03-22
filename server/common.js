/**
 * 常量配置
 */
const Models = {
    // 系统端口 预计上线端口 19919/15816 项目名称 Pyramid 金字塔
    SERVER_PORT: 19919,
    // 日志路径 相对于项目跟路径 也可以配置绝对路径 ##必须以斜杠结尾##
    LOG_PATH: 'logs/',

    // 表（目录名称）
    table_name: "tables",
    // 数据字典（目录名称）
    dictionary_name: "dictionarys",
    // 域（目录名称）
    domain_name: "domains",
    // 表空间（目录名称）
    table_space_name: "table_spaces",

    // JSON源数据路径
    // 约定以/开头的为linux/MAC 系统根目录 linux 路径 /home/renfei/...
    // 以c: d: .... h: i: 开头的(忽略大小写)为windows
    // data/source 项目内的相对路径
    //  sourcePath: 'F:/JSON/',
    sourcePath: 'data/source/',
    // 生成SQL路径
    // targerPath: 'g:/target/',
    targerPath: 'data/target/',

    // 生成EXCEL默认路径
    EXCEL_PATH: "uploadFile/excel/"

};

module.exports = Models;