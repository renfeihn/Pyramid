/**
 * 常量配置
 */
const Models = {
    // 系统端口 预计上线端口 19919/15816 项目名称 Freedom 自由者
    SERVER_PORT: 8080,
    // 日志路径 相对于项目跟路径 也可以配置绝对路径 ##必须以斜杠结尾##
    LOG_PATH : 'logs/',

    // 表（目录名称）
    table_name: "tables",
    // 数据字典（目录名称）
    dictionary_name: "dictionarys",
    // 域（目录名称）
    domain_name: "domains",
    // 表空间（目录名称）
    table_space_name: "table_spaces",
    // JSON源数据路径
    sourcePath: 'data/source/',
    // 生成SQL路径
    targerPath: 'data/target/',


    // 类型
    TABLE_TYPE: "table",

    // 创建文件夹的权限 默认权限0777
    AUTH_NUM: '0777'

};

module.exports = Models;