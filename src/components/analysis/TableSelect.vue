<template>
    <div>
        <!--<h2>表区域 </h2>-->
        <el-dialog title="SQL脚本" v-model="sql_dialog_show">
            <textarea v-model="content" rows="10" cols="100"></textarea>
        </el-dialog>
        <br>

        <form class="form-inline form-filter">
            <div class="form-group">
                <label>所属系统</label>
                <select @change="getAllTables();" class="form-control" v-model="system">
                    <option v-for="(item, index) in systems" :value="item.code.toString()">
                        {{item.code}}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>垂直/水平</label>
                <select @change="getAllTables();" class="form-control" v-model="class1">
                    <option v-for="(item, index) in class1s" :value="item.code.toString()">
                        {{item.code}}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>分类2</label>
                <select @change="getAllTables();" class="form-control" v-model="class2">
                    <option v-for="(item, index) in class2s" :value="item.code.toString()">
                        {{item.code}}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>表名称</label>
                <input class="form-control" v-model="code" @change="getAllTables();" type="text"/>
            </div>

            <!--<div class="form-group">-->
            <!--<label>表空间</label>-->
            <!--<select class="form-control" v-model="tableSpace">-->
            <!--<option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">-->
            <!--{{tableSpace.code}}-->
            <!--</option>-->
            <!--</select>-->
            <!--</div>-->
            <a class="btn btn-info" @click="downloadTable();">导出</a>
            <a class="btn btn-info" @click="generatorSql();">生成SQL</a>
        </form>

        <br/>
        <el-table
                :data="tables"
                border
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="system"
                    label="所属系统"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="class1"
                    label="垂直/水平"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="class2"
                    label="分类2"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="表名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="comment"
                    label="描述"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="table_space"
                    label="表空间"
                    show-overflow-tooltip>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                // 系统
                system: '',
                // class1 垂直、水平
                class1: '',
                // class2 init/busi
                class2: '',
                // 所属系统
                systems: [{"code": "Ensemble"}, {"code": "Limarket"}, {"code": "Accounting"}],
                // 所属分类1
                class1s: [{"code": "upright"}, {"code": "level"}],
                // 所属分类2
                class2s: [{"code": "init"}, {"code": "busi"}],
                code: '',
                comment: '',
                tableSpace: '',
                // 列表的复选框
                checkList: [],
                tables: [],
                tableSpaces: [],
                content: '',
                sql_dialog_show: false
            }
        },
        methods: {
            handleSelectionChange(val) {
                console.log(val);
                this.checkList = val;
            },
            downloadTable(){
                if(!(this.checkList).length > 0){
                    this.$confirm('没有选择文件，确定要全部导出吗, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http.post('/downLoad/tableSelect', {
                            data: this.checkList
                        }).then(function (res) {

                        }, function (res) {
                            this.$message.error('TableList 页面 请求 table space 失败： ' + res.status);
                        });
                    }).catch(() => {
                        this.$message.info('已取消删除');
                    });
                }else{
                    this.$http.post('/downLoad/tableSelect', {
                        data: this.checkList
                    });
                }
            },
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
                let API = '/getAll/tables?system=' + this.system + '&code=' + this.code + '&class1=' + this.class1 +
                    '&class2=' + this.class2 + '&tableSpace=' + this.tableSpace;
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
                    type: 'table',
                    db_type: localStorage.getItem('dbms')
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('生成sql成功');
                        // 下载sql
                        var re = res.body;
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
            this.getTableSpaces();
            this.getAllTables();
        }
    }
</script>