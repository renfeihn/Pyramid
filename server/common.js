/**
 * 常量配置
 */
const Models = {
    // 系统端口 预计上线端口 19919/15816
    SERVER_PORT: 8080,

    // 表
    table_name: "tables",
    // 数据字典
    dictionary_name: "dictionarys",
    // 域
    domain_name: "domains",
    // 表空间
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