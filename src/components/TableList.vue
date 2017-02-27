<template>
    <div>
        <h2 class="sub-header">表区域 </h2>

        <!--<p class="alert alert-danger" v-for="item in errors">{{item}}</p>-->
        <el-dialog title="SQL脚本" v-model="sql_dialog_show">
            <textarea v-model="content" rows="10" cols="100"></textarea>
        </el-dialog>
        <br>

        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表名称</label>
                <input class="form-control" v-model="code" @change="getAllTables();" type="text"/>
            </div>
            <!--<div class="form-group">-->
            <!--<label>表中文描述</label>-->
            <!--<input class="form-control" v-model="comment" type="text"/>-->
            <!--</div>-->
            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="tableSpace">
                    <option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">
                        {{tableSpace.code}}
                    </option>
                </select>
            </div>
            <a class="btn btn-info" @click="getAllTables();">筛选</a>

            <a class="btn btn-info" :href="'/tableInfo?module=' + module">新增表</a>
            <a class="btn btn-info" @click="generatorSql();">生成SQL</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <!--<th>name</th>-->
                    <th>表名</th>
                    <th>描述</th>
                    <th>表空间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(table,index) in tables">
                    <!--<td>{{table.name}}</td>-->
                    <td>{{table.code}}</td>
                    <td>{{table.comment}}</td>
                    <td>{{table.table_space}}</td>
                    <td>
                        <router-link :to="{path:'/tableInfo', query:{module:module,tableCode:table.code}}"
                                     class="btn btn-sm btn-success">查看
                        </router-link>
                        <a class="btn btn-sm btn-danger" @click="deleteTable(table.code);">删除</a>
                        <a class="btn btn-sm btn-info" @click="getSql(table.code);">SQL预览</a>
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
                module: '',  // 模块ID
                code: '',
                comment: '',
                tableSpace: '',
                tables: [],
                tableSpaces: [],
                // errors:[],    //服务端验证失败的返回
                // 选中行的索引
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
                let API = '/getAll/tables?module=' + this.module + '&code=' + this.code + '&comment=' + this.comment + '&tableSpace=' + this.tableSpace;
                this.$http.get(API).then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.tables = re;
                    }
                }, function (res) {
                    this.$message.error('TableList 页面 请求 table 失败： ' + res.status);
                });
            },
            deleteTable(code){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('/deleteFile', {
                        type: 'tables',
                        code: code
                    }).then(function (res) {
                        if (res.status == 200) {
                            console.log('删除表成功');
                            this.$message.success('删除成功!');
                            // 提示信息并新获取table
                            var re = res.body;
                            if (re) {
                                // this.errors = re;
                                this.getAllTables();
                            }
                        } else {
                            console.log('删除表失败');
                            this.$message.error('删除失败!');
                        }
                    }, function (res) {
                        console.log('删除表失败' + res.status + '  ' + res.body);
                        this.$message.error('删除表失败' + res.status + '  ' + res.body);
                        // this.errors = res.body;
                    });
                }).catch(() => {
                    this.$message.info('已取消删除');
                });
            },
            generatorSql(){
                this.$http.post('/generatorSql', {
                    type: 'table',
                    db_type: localStorage.getItem('dbms')
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('生成sql成功');
                        // 下载sql
                        var re = res.body;
                        //if(re){
                        //this.errors = re;
                        //}
                    } else {
                        console.log('生成sql失败');
                        this.$message.error('生成sql失败!');
                    }
                }, function (res) {
                    console.log('生成sql失败' + res.status + '  ' + res.body);
                    this.$message.error('生成sql失败' + res.status + '  ' + res.body);
                    //this.errors = res.body;
                });
            },
            getSql(code){
                this.$http.post('/showSQL', {
                    type: 'table',
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
                            // 先清除错误信息
                            //this.errors = [];
                        }
                    } else {
                        console.log('生成sql失败');
                        this.$message.error('生成sql失败!');

                    }
                }, function (res) {
                    console.log('生成sql失败' + res.status + '  ' + res.body);
                    this.$message.error('生成sql失败' + res.status + '  ' + res.body);
                    //this.errors = res.body;
                });
            }
        },
        components: {},
        created(){
            var mo = this.$route.query.module;
            console.log('mo: ' + mo);

            if (null != mo && undefined != mo && '' != mo && mo.length > 0) {
                this.module = mo;
            } else {
                this.module = '';
            }
            console.log('module: ' + this.module);

            this.getTableSpaces();
            this.getAllTables();
        }
    }


</script>
