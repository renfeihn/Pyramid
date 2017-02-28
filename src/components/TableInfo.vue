<template>
    <div>
        <h2 class="sub-header">表信息区域 </h2>

        <el-dialog title="SQL脚本" v-model="textshow">
            <textarea v-model="content" v-show="textshow" rows="10" cols="100"></textarea>
        </el-dialog>

        <el-dialog title="列信息" v-model="dialogFormVisible">
                <el-switch on-text="" off-text=""></el-switch>
            <form class="form-horizontal" :model="columns">
                <div class="form-group">
                    <label class="col-sm-2 control-label">数据字典</label>
                    <div class="col-sm-4">
                        <el-select v-model="columns.dictionary"
                                   @change="selectDictionary"
                                   filterable placeholder="请选择">
                            <el-option
                                    v-for="item in dictionarys"
                                    :label="item.code"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <label class="col-sm-2 control-label">列名称</label>
                    <div class="col-sm-4">
                        <input class="form-control" v-model="columns.code" type="text"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">数据类型</label>
                    <div class="col-sm-4">
                        <input class="form-control" readonly="isReadOnly" v-model="columns.dataType" type="text"/>

                    </div>
                    <label class="col-sm-2 control-label">长度</label>
                    <div class="col-sm-4">
                        <input class="form-control" readonly="isReadOnly" v-model="columns.lengths" type="text"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">精度</label>
                    <div class="col-sm-4">
                        <input class="form-control" readonly="isReadOnly" v-model="columns.precision" type="text"/>
                    </div>
                    <label class="col-sm-2 control-label">默认值</label>
                    <div class="col-sm-4">
                        <input class="form-control" readonly="isReadOnly" v-model="columns.defaults" type="text"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">是否必填</label>
                    <div class="col-sm-4">
                        <el-switch on-text="" off-text="" v-model="columns.M"></el-switch>
                    </div>
                    <label class="col-sm-2 control-label">是否主键</label>
                    <div class="col-sm-4">
                        <el-switch on-text="" off-text="" v-model="columns.p"></el-switch>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">描述</label>
                    <div class="col-sm-4">
                        <input class="form-control" readonly="isReadOnly" v-model="columns.comment" type="text"/>
                    </div>
                    <label class="col-sm-2 control-label">取值范围</label>
                    <div class="col-sm-4">
                        <input class="form-control" readonly="isReadOnly" v-model="columns.scope" type="text"/>
                    </div>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="columnsButton">确 定</el-button>
                </div>
            </form>
        </el-dialog>

        <br>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="table.table_space">
                    <template v-for="tableSpace in tableSpaces">
                        <option :value="tableSpace.code" v-if="tableSpace.code == table.table_space" selected>
                            {{tableSpace.code}}
                        </option>
                        <option :value="tableSpace.code" v-else>
                            {{tableSpace.code}}
                        </option>
                    </template>
                </select>

            </div>
            <div class="form-group">
                <label>表名称</label>
                <input v-model="tableCode" type="hidden"/>
                <input class="form-control" v-model="table.code" @blur="checkTableCode(table.code);" type="text"/>
            </div>
            <div class="form-group">
                <label>表中文描述</label>
                <input class="form-control" v-model="table.comment" type="text"/>
            </div>

            <a class="btn btn-info" @click="save();">保存</a>
            <a class="btn btn-info" @click="showSQL();">sql 预览</a>
        </form>
        <br>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="列管理" name="first">
                <form class="form-inline form-filter">
                    <br>
                    <a class="btn btn-info" @click="">上移</a>
                    <a class="btn btn-info" @click="">下移</a>
                    <a class="btn btn-info" @click="addRow();">新增</a>
                    <a class="btn btn-info" @click="">修改</a>
                    <a class="btn btn-info" @click="deleteRow();">删除</a>
                </form>
                <div class="table-responsive articleList">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th width="2%"></th>
                            <th width="15%">列名</th>
                            <th width="13%">数据类型</th>
                            <th width="10%">长度</th>
                            <th width="10%">精度</th>
                            <th width="10%">是否必填</th>
                            <th width="10%">是否主键</th>
                            <th width="10%">描述</th>
                            <th width="10%">默认值</th>
                            <th width="10%">数据字典</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(tb,index) in tableAttr" @click="selectRow($event,index);">
                            <td>{{index+1}}</td>
                            <td>{{tb.code}}</td>
                            <td>{{tb.dataType}}</td>
                            <td>{{tb.lengths}}</td>
                            <td>{{tb.precision}}</td>
                            <td>{{tb.M}}</td>
                            <td>{{tb.P}}</td>
                            <td>{{tb.comment}}</td>
                            <td>{{tb.defaults}}</td>
                            <td>{{tb.dictionary}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="索引管理" name="second">
                <form class="form-inline form-filter">
                    <br>
                    <a class="btn btn-info" @click="moveIndexRow(-1);">上移</a>
                    <a class="btn btn-info" @click="moveIndexRow(1);">下移</a>
                    <a class="btn btn-info" @click="addIndexRow();">新增</a>
                    <a class="btn btn-info" @click="deleteIndexRow();">删除</a>
                </form>
                <div class="table-responsive articleList">

                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th width="2%"></th>
                            <th width="20%">索引名称</th>
                            <th width="20%">是否唯一</th>
                            <th width="38%">列项</th>
                            <th width="20%">表空间</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(ind,index) in tableIndexs" @click="selectIndexEvent($event,index);">
                            <td>
                                {{index+1}}
                            </td>
                            <td>
                                <el-input v-model="ind.code"></el-input>
                            </td>
                            <td>
                                <el-switch on-text="" off-text="" v-model="ind.U"></el-switch>
                            </td>
                            <td>
                                <el-select v-model="ind.columns" multiple placeholder="请选择">
                                    <el-option
                                            v-for="attr in tableAttr"
                                            :label="attr.code"
                                            :value="attr.code">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="ind.table_space"
                                           filterable placeholder="请选择">
                                    <el-option
                                            v-for="item in tableSpaces"
                                            :label="item.code"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import editable from '../plugins/editable.js';

    var data_types = ['Integer', 'Number', 'Char', 'Varchar', 'Date', 'Timestamp', 'Clob', 'Blob'];

    export default{
        data(){
            return {
                // 默认激活的页签
                activeName: 'first',
                // 模块ID
                module: '',
                table: {},
                // table 中 attr 的属性
                tableAttr: [],
                // table 中 的索引
                tableIndexs: [],
                // 所有domain域
                domains: [],
                // 所有表空间
                tableSpaces: [],
                // 选中行的行号
                selectRowNum: -1,
                // 选中的索引行号
                selectIndexRowNum: -1,
                content: '',
                textshow: false,
                // 页面累计行数
                maxRowSize: 0,
                // 页面索引累计行数
                maxIndexRowSize: 0,
                // 弹出框页面的列对象
                columns:{},
                // 列详情的显示属性
                dialogFormVisible : false,
                // 数据字典信息
                dictionarys:[],
                // 查询的单个数据字典对象
                dictionary:{}
            }
        },
        methods: {
            handleClick(tab, event) {
                //console.log(tab, event);
            },
            getTable(code){
                if (null != code && '' != code && undefined != code) {
                    this.$http.get('/getTable/' + code).then(function (res) {
                        if (res.status == 200) {
                            var re = res.body;
                            this.table = re;
                            console.log('table_space: ' + re.table_space);
                            if (!(null != re && re.attr instanceof Array)) {
                                this.tableAttr = null;
                                this.tableIndexs = null;
                            } else {
                                this.tableAttr = (this.table).attr;
                                this.maxRowSize = this.tableAttr.length;

                                this.tableIndexs = (this.table).indexs;

                            }
                        }
                    }, function (res) {
                        this.$message.error('TableInfo 页面 请求 table ' + code + ' 失败： ' + res.status);
                    });
                }

            },
            getAllDomains(){
                this.$http.get('/getAll/domains').then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.domains = re;
                    }
                }, function (res) {
                    this.$message.error('TableInfo 页面 请求domain失败： ' + res.status);
                });
            },
            getTableSpaces(){
                this.$http.get('/getAll/table_spaces').then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.tableSpaces = re;
                    }
                }, function (res) {
                    this.$message.error('TableInfo 页面 请求 table space 失败： ' + res.status);
                });
            },
            // 检查表名是否存在，如果新表名和老表名一致则不校验
            checkTableCode(code){
                this.$http.get('/checkTableCode/' + code + '?oldCode=' + this.tableCode).then(function (res) {
                    if (res.status == 200) {

                    }
                }, function (res) {
                    console.log('未通过服务端校验' + res.status + '  ' + res.body);
                    this.table.name = '';
                    this.$message.error(res.body);
                });

            },
            // 选中行
            selectRow(e, index){
                this.selectRowNum = index;
                // 设置高亮
                //var tr = e.currentTarget;

                //console.log('tr:  '+tr.innerHTML);
                /*
                 var tbd = tr.parentNode;
                 console.log(tdb);
                 if(null != tbd && tbd instanceof Array){
                 for(var i in tbd){
                 if(tr == tbd[i]){
                 tbd[i].setAttribute("style", "background-color: #DEDEDE");
                 }else{
                 tbd[i].removeAttribute("style");
                 }
                 }
                 }
                 */

            },
            getAllDictionarys(){
                let API = '/getAll/dictionarys?page=' + '&code=' + this.code + '&comment=' + this.comment;
                this.$http.get(API).then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.dictionarys = re;
                    }
                }, function (res) {
                    this.$message.error('TableList 页面 请求 dictionarys 失败： ' + res.status);
                });
            },
            getDictionary(code){
                if (null != code && '' != code && undefined != code) {
                    this.$http.get('/getDictionary/' + code).then(function (res) {
                        if (res.status == 200) {
                            var re = res.body;
                            this.dictionary = re;
                        }
                    }, function (res) {
                        this.$message.error('DictionaryInfo 页面 请求 dictionary ' + code + ' 失败： ' + res.status);
                    });
                }
            },
            // 新增列，弹出页面
            addRow(){
//                this.maxRowSize++;
//                const tr = new Object();
//                tr.name = 'Column_' + (this.maxRowSize);
//                tr.code = 'Column_' + (this.maxRowSize);
//
//                // 如果没有选中行，第一次 add before 在首行添加，  第一次 add after 在数组尾行添加
//                if (this.selectRowNum == -1) {
//                    if (null != this.tableAttr && this.tableAttr instanceof Array) {
//                        if (i == 1) {
//                            this.selectRowNum = this.tableAttr.length;
//                        }
//                    }
//                    if (i == 0) {
//                        this.selectRowNum = 0;
//                    }
//                }
//                this.tableAttr.splice(this.selectRowNum + i, 0, tr);
                // 查询所有数据字典信息
                this.getAllDictionarys();
                this.dialogFormVisible = true;


            },
            // 删除一行
            deleteRow(){
                if (this.selectRowNum >= 0) {
                    this.tableAttr.splice(this.selectRowNum, 1);
                }else{
                    this.$message.error('请先选择一行,再进行操作');
                    return;
                }
            },
            // 根据选中的code查询数据字典赋值给页面
            selectDictionary(code){
                console.log('选择了');
                //
                this.getDictionary(code);
                if(!this.dictionary){
                    columns.code = this.dictionary.code;
                    columns.dataType = this.dictionary.dataType;
                    columns.lengths = this.dictionary.lengths;
                    columns.precision = this.dictionary.precision;
                    columns.defaults = this.dictionary.defaults;

                }

            },
            columnsButton(){
                console.log('-----------点击了确定-----------');
                this.dialogFormVisible = false;

            },

            // 选中的索引行号
            selectIndexEvent(e, index){
                console.log('选中的索引行号：' + index);
                this.selectIndexRowNum = index;
            },
            // 添加一行索引
            addIndexRow(){
                console.log('--- add index row --- ' + (this.tableIndexs).length);
                const indexSize = (this.tableIndexs).length + 1;
                const tr = new Object();
                tr.code = 'Index_' + (indexSize);
                tr.U = false;
                tr.columns = [];
                tr.table_space = '';
                this.tableIndexs.splice(indexSize, 0, tr);
            },
            // 移动索引
            moveIndexRow(i){
                console.log('移动的行号：' + this.selectIndexRowNum + '  操作i: ' + i);
                if (this.selectIndexRowNum < 0) {
                    this.$message.error('请先选择一行,再进行操作');
                    return;
                }

                // 如果是首行，不能上移
                if (this.selectIndexRowNum == 0 && i < 0) {
                    this.$message.warning('首行不能上移');
                    return;
                }
                // 如果是尾行，不能下移
                if (this.selectIndexRowNum == (this.tableIndexs.length - 1) && i > 0) {
                    this.$message.warning('尾行不能下移');
                    return;
                }
                const tr = this.tableIndexs[this.selectIndexRowNum];
                this.tableIndexs.splice(this.selectIndexRowNum, 1);
                this.tableIndexs.splice(this.selectIndexRowNum + i, 0, tr)
                // 移动完成，修改原选中的行号
                this.selectIndexRowNum = this.selectIndexRowNum + i;
            },
            deleteIndexRow(){
                if (this.selectIndexRowNum >= 0) {
                    this.tableIndexs.splice(this.selectIndexRowNum, 1);
                    this.selectIndexRowNum = -1;
                } else {
                    this.$message.error('请先选择一行,再进行操作');
                    return;
                }
            },

            // 普通的input
            editInput(e, field, data, index){
                var that = this;
                editable.editInput(e, function (value) {
                    // 如果数据修改 更新到 model 中
                    (that.tableAttr[index])[field] = value;
                });
            },
            // dataType
            editDataType(e, field, data, index){
                var that = this;
                editable.editSelect(e, data_types, function (value) {
                    //如果数据没有被修改这个回调方法不会执行
                    (that.tableAttr[index])[field] = value;
                });
            },
            // dataType
            editYN(e, field, data, index){
                var that = this;
                var yn = ['Y', 'N'];
                editable.editSelect(e, yn, function (value) {
                    //如果数据没有被修改这个回调方法不会执行
                    (that.tableAttr[index])[field] = value;
                });
            },
            // domain
            editDomain(e, field, data, index){
                var that = this;
                if (null != that.domains && that.domains instanceof Array) {
                    var options = new Array();
                    for (var i in that.domains) {
                        options.push((that.domains[i]).code);
                    }
                    if (options.length > 0) {
                        editable.editSelect(e, options, function (value) {
                            // 如果数据没有被修改这个回调方法不会执行
                            // 如果数据修改，则用domain的属性覆盖改行的数据
                            for (var i in that.domains) {
                                if (value == (that.domains[i]).code) {
                                    (that.tableAttr[index]).name = (that.domains[i]).name;
                                    (that.tableAttr[index]).code = (that.domains[i]).code;
                                    (that.tableAttr[index]).dataType = (that.domains[i]).dataType;
                                    (that.tableAttr[index]).lengths = (that.domains[i]).lengths;
                                    (that.tableAttr[index]).precision = (that.domains[i]).precision;
                                    (that.tableAttr[index]).comment = (that.domains[i]).comment;
                                    (that.tableAttr[index]).defaults = (that.domains[i]).defaults;
                                    // 移除事件不可修改
                                } else {
                                    // 添加事件
                                }
                            }
                        });
                    }
                }
            },// domain end

            save(){
                const newCode = this.table.code;
                if (null == newCode || undefined == newCode || '' == newCode) {
                    this.$message.warning('请填写表名称');
                    return;
                }

                // 处理数据
                this.table.attr = this.tableAttr;
                // 添加模块ID
                this.table.module = this.module;
                this.$http.post('/saveTable', {
                    data: this.table,
                    oldCode: this.tableCode
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('添加表成功');
                        this.$message.success('添加表成功');
                        this.$router.push('/tableList?module=' + this.module);
                    } else {
                        console.log('添加表失败');
                        this.$message.error('添加表失败');
                    }
                }, function (res) {
                    console.log('添加表失败，未通过服务端校验' + res.status + '  ' + res.body);
                    this.$message.error(res.body);
                    //this.errors=res.body;
                });

            },
            showSQL(){
                // 处理数据
                this.table.attr = this.tableAttr;
                this.$http.post('/showSQL', {
                    type: 'table',
                    db_type: localStorage.getItem('dbms'),
                    data: this.table
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('生成sql成功');
                        // 弹出框，展示sql
                        var re = res.body;
                        if (re) {
                            this.textshow = true;
                            this.content = re;
                            // 先清除错误信息
                            //this.errors = [];
                        }
                    } else {
                        console.log('生成sql失败');
                        this.$message.error('生成sql失败');
                    }
                }, function (res) {
                    console.log('生成sql失败' + res.status + '  ' + res.body);
                    this.$message.error(res.body);
                    //this.errors=res.body;
                });

            }
        },
        components: {},
        created(){
            // 模块ID
            var mo = this.$route.query.module;
            if (null != mo && undefined != mo && '' != mo && mo.length > 0) {
                this.module = mo;
            } else {
                this.module = '';
            }
            console.log('module: ' + this.module);

            // 查看或者修改是的 表CODE
            var tcode = this.$route.query.tableCode;
            if (null != tcode && undefined != tcode && '' != tcode && tcode.length > 0) {
                this.tableCode = tcode;
            } else {
                this.tableCode = '';
            }
            console.log('code: ' + this.tableCode);

            this.getAllDomains();
            this.getTableSpaces();
            this.getTable(this.tableCode);
        }
    }

</script>
