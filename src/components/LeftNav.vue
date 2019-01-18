<template>
    <div>

        <el-menu :default-active="navselected" class="el-menu-vertical-demo">
            <el-submenu index="1">
                <template slot="title"><i class="el-icon-message"></i>数据结构</template>

                <a href="/tableList?system=Ensemble">
                    <el-menu-item index="1-1">核心系统</el-menu-item>
                </a>
                <a href="/tableList?system=Limarket">
                    <el-menu-item index="1-2">计价系统</el-menu-item>
                </a>
                <a href="/tableList?system=Accounting">
                    <el-menu-item index="1-3">核算系统</el-menu-item>
                </a>
            </el-submenu>
            <el-menu-item index="2"><a href="/dictionaryList"><i class="el-icon-menu"></i>数据字典</a></el-menu-item>
            <el-menu-item index="3"><a href="/domainList"><i class="el-icon-menu"></i>数据域</a></el-menu-item>
            <el-menu-item index="4"><a href="/tableSpaceList"><i class="el-icon-setting"></i>表空间</a></el-menu-item>
            <el-menu-item index="5"><a href="/tableSelect"><i class="el-icon-setting"></i>统计分析</a></el-menu-item>
        </el-menu>

    </div>
</template>
<script>
    export default{
        data(){
            return {
                tables: [],
                domains: [],
                tableSpaces: [],
                navselected:''
            }
        },
        methods: {

            // 根据URL判断当前激活标签
            initActive(){
                var system = this.$route.query.system;
                // console.log('system: ' + system);
                if (null != system && undefined != system && '' != system && system.length > 0) {
                    switch(system){
                    case 'Ensemble':
                      this.navselected = '1-1';
                      break;
                    case 'Limarket':
                      this.navselected = '1-2';
                      break;
                    case 'Accounting':
                      this.navselected = '1-3';
                      break;
                    default:
                      this.navselected = '1-1';
                    }
                }
            },

            getAllTables(){
                this.$http.get('/getAll/tables').then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.tables = re;
                    }
                }, function (res) {
                    alert('LeftNav 页面 请求table失败： ' + res.status);
                });
            },
            getAllDomains(){
                this.$http.get('/getAll/domains').then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.domains = re;
                    }
                }, function (res) {
                    alert('LeftNav 页面 请求domain失败： ' + res.status);
                });
            },
            getAllTableSpaces(){
                this.$http.get('/getAll/table_spaces').then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        //console.lib('tableSpaces:  '+re);
                        this.tableSpaces = re;
                    }
                }, function (res) {
                    alert('LeftNav 页面 请求table space失败： ' + res.status);
                });
            }
        },
        created(){
            this.initActive();
            //this.getAllTables();
            //this.getAllDomains();
            //this.getAllTableSpaces();
        },
        components: {}
    }


</script>
