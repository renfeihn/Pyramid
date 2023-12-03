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
    //生成sql是否带列描述
    comment: "false",
    //生成sql是否带表描述
    commentTable: "false",
    // JSON源数据路径
    // 约定以/开头的为linux/MAC 系统根目录 linux 路径 /home/renfei/...
    // 以c: d: .... h: i: 开头的为windows
    // data/source 项目内的相对路径
    sourcePath: 'data/source/',
    // 生成SQL路径
    targerPath: 'D:/project/source/fx/ModelBank/db/3table/',
    // targerPath: 'F:/svn/ModelBank/db/3table/',

    // 生成EXCEL默认路径
    EXCEL_PATH: "uploadFile/excel/",

    // 创建文件目录，指定的权限
    AUTH_NUM: "0777",

    // 分页每页显示数目
    PAGE_NUM: "10",


    // redis 服务配置
    REDIS_SERVER_IP: "47.116.125.203",
    REDIS_SERCER_PORT: "6379"

};

module.exports = Models;
