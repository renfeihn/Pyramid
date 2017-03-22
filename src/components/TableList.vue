<template>
    <div>
        <!--<h2>表区域 </h2>-->
        <el-dialog title="SQL脚本" v-model="sql_dialog_show">
            <textarea v-model="content" rows="10" cols="100"></textarea>
        </el-dialog>
        <br>

        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表名称</label>
                <input class="form-control" v-model="code" @change="getAllTables();" type="text"/>
            </div>

            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="tableSpace">
                    <option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">
                        {{tableSpace.code}}
                    </option>
                </select>
            </div>
            <a class="btn btn-info" @click="getAllTables();">筛选</a>

            <a class="btn btn-info" :href="'/tableInfo?system=' + system">新增表</a>
            <a class="btn btn-info" @click="generatorSql();">生成SQL</a>
        </form>


        <!--<br/>-->
        <!--<el-table-->
                <!--:data="tables"-->
                <!--border-->
                <!--style="width: 100%">-->
            <!--<el-table-column-->
                    <!--prop="dbType"-->
                    <!--label="垂直/水平"-->
                    <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--prop="parameter"-->
                    <!--label="分类2"-->
                    <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--prop="code"-->
                    <!--label="表名"-->
                    <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--prop="comment"-->
                    <!--label="描述"-->
                    <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--prop="table_space"-->
                    <!--label="表空间"-->
                    <!--width="120">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--fixed="right"-->
                    <!--label="操作"-->
                    <!--width="120">-->
                <!--<template scope="scope">-->

                    <!--<el-button-->
                            <!--@click.native.prevent="deleteRow(scope.$index, tableData4)"-->
                            <!--type="text"-->
                            <!--size="small">-->
                        <!--查看-->
                    <!--</el-button>-->

                    <!--<el-button-->
                            <!--@click.native.prevent="deleteRow(scope.$index, tableData4)"-->
                            <!--type="text"-->
                            <!--size="small">-->
                        <!--移除-->
                    <!--</el-button>-->

                <!--</template>-->
            <!--</el-table-column>-->
        <!--</el-table>-->

        <div class="table-responsive articleList">
            <table class="table table-striped">
                    <thead>
                    <tr>
                    <th width="10%">垂直/水平</th>
                    <th width="10%">业务/参数</th>
                    <th width="15%">表名</th>
                    <th width="34%">描述</th>
                    <th width="15%">表空间</th>
                    <th width="16%">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(table,index) in tables">
                    <td>{{table.dbType}}</td>
                    <td>{{table.parameter}}</td>
                    <td>
                        <router-link :to="{path:'/tableInfo', query:{system:system,tableCode:table.code}}">{{table.code}}</router-link>
                    </td>
                    <td>{{table.comment}}</td>
                    <td>{{table.table_space}}</td>
                    <td>
                        <router-link :to="{path:'/tableInfo', query:{system:system,tableCode:table.code}}"
                                     class="btn btn-sm btn-success">查看
                        </router-link>
                        <a class="btn btn-sm btn-danger" @click="deleteTable(table);">删除</a>
                        <!--<a class="btn btn-sm btn-info" @click="getSql(table.code);">SQL预览</a>-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>

<script>
    export default{
        data(){
            return {
                // 系统
                system: '',
                // dbType 垂直、水平
                dbType: '',
                // parameter init/busi_para
                parameter: '',
                code: '',
                comment: '',
                tableSpace: '',
                tables: [],
                tableSpaces: [],
                content: '',
                sql_dialog_show: false
            }
        },
        methods: {
            getTableSpaces(){
                this.$http.get('/getAll/table_spaces').then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.tableSpaces = re;
                    }
                }, function (res) {
                    this.$message.error('TableList 页面 请求 table space 失败： ' + res.status);
                });
            },
            getAllTables(){
                let API = '/getAll/tables?system=' + this.system + '&code=' + this.code + '&dbType=' + this.dbType +
                    '&parameter=' + this.parameter + '&tableSpace=' + this.tableSpace;
                this.$http.get(API).then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.tables = re;
                    }
                }, function (res) {
                    this.$message.error('TableList 页面 请求 table 失败： ' + res.status);
                });
            },
            deleteTable(tableTemp){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/deleteTableFile', {
                        table: tableTemp
                    }).then(function (res) {
                        if (res.status == 200) {
                            console.log('删除表成功');
                            this.$message.success('删除成功!');
                            // 提示信息并新获取table
                            var re = res.body;
                            if (re) {
                                this.getAllTables();
                            }
                        } else {
                            console.log('删除表失败');
                            this.$message.error('删除失败!');
                        }
                    }, function (res) {
                        console.log('删除表失败' + res.status + '  ' + res.body);
                        this.$message.error('删除表失败' + res.status + '  ' + res.body);
                    });
                }).catch(() => {
                    this.$message.info('已取消删除');
                });
            },
            generatorSql(){
                this.$http.post('/generatorSql', {
                    type: 'tables',
                    db_type: localStorage.getItem('dbms'),
                    system: this.system
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('生成sql成功');
                        // 下载sql
                        var re = res.body;
                        this.$message.success(re);
                    } else {
                        console.log('生成sql失败');
                        this.$message.error('生成sql失败!');
                    }
                }, function (res) {
                    console.log('生成sql失败' + res.status + '  ' + res.body);
                    this.$message.error('生成sql失败' + res.status + '  ' + res.body);
                });
            },
            getSql(code){
                this.$http.post('/showSQL', {
                    type: 'tables',
                    db_type: localStorage.getItem('dbms'),
                    code: code
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('生成sql成功');
                        // 弹出框，展示sql
                        var re = res.body;
                        if (re) {
                            this.sql_dialog_show = true;
                            this.content = re;
                        }
                    } else {
                        console.log('生成sql失败');
                        this.$message.error('生成sql失败!');
                    }
                }, function (res) {
                    console.log('生成sql失败' + res.status + '  ' + res.body);
                    this.$message.error('生成sql失败' + res.status + '  ' + res.body);
                });
            }
        },
        components: {},
        created(){
            var mo = this.$route.query.system;
            console.log('mo: ' + mo);
            if (null != mo && undefined != mo && '' != mo && mo.length > 0) {
                this.system = mo;
            } else {
                this.system = '';
            }
            console.log('system: ' + this.system);
            this.getTableSpaces();
            this.getAllTables();
        }
    }
</script>