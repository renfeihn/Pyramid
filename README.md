Pyramid 金字塔
===
Vue+Nodejs+Webpack  类似Powerdesigner功能，管理表、数据字典、数据域、表空间等


## 安装步骤：

环境需要：git、nodejs 4+ 、npm 2+
+ 1.git clone： https://github.com/renfeihn/Pyramid
+ 2.在项目根目录下运行（安装依赖）：npm install
+ 3.依赖安装完成之后运行（进行前端打包）：npm run build
+ 4.运行：npm start  提示 ---- Server up: http://localhost:19919 ---- 即表示运行成功
(如果启动过程中，缺少依赖，请自行安装)
+ 5.访问 http://localhost:19919

## 配置：
+ 1.common.js 为项目公共配置常量文件，可修改
+ 2.日志输出路径配置，查看common.js，看说明配置，不配置默认为:项目根目录/logs/下

## VUE 资料参考:
+ 官方中文网站
http://cn.vuejs.org/
+ 简书VUE资料汇总
[简书资料汇总](http://www.jianshu.com/p/afd8e1db7d9b)
+ Vue-router2
[Vue-router2](http://router.vuejs.org/zh-cn/index.html)
+ ElementUI 饿了么PC端UI
PC端 elementUI  [PC官网](http://element.eleme.io)
+ MintUI 饿了么移动端UI
移动端 MintUI [移动端官网](http://mint-ui.github.io)
+ iView 
一套基于 Vue.js 的 UI 组件库，主要服务于 PC 界面的中后台产品。[官网](https://www.iviewui.com/components/layout)
+ vue-carbon
web端组件UI库  [网址](https://myronliu347.github.io/vue-carbon)

## Nodejs 参考资料：
+ nodejs 官网中文文档 http://nodejs.cn/api/

## 预计新功能介绍
#### 计划设计开发单机版本、共享版
+ 1. 单机版介绍：目前现有功能满足
+ 2. 共享版：由redis存储、序列化。引入单文件version控制。
        启动时由redis读取本地文件，然后访问时从redis取，最后由redis定时序列化本地。