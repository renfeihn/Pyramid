<template>
    <div>
        <h2 class="sub-header">表详细信息 </h2>

        <el-dialog title="SQL脚本" v-model="textshow">
            <textarea v-model="content" v-show="textshow" rows="10" cols="100"></textarea>
        </el-dialog>

        <el-dialog title="列信息" v-model="dialogFormVisible">
            <form class="form-horizontal" :model="tableColumns">
                <div class="form-group">
                    <label class="col-sm-2 control-label">数据字典</label>
                    <div class="col-sm-4">
                        <el-select v-model="tableColumns.dictionary"
                                   @change="selectDictionary"
                                   filterable placeholder="请选择">
                            <el-option
                                    v-for="item in dictionarys"
                                    :label=column(item.code,item.comment)
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                    <label class="col-sm-2 control-label">列名称</label>
                    <div class="col-sm-4">
                        <input class="form-control" v-model="tableColumns.code"
                               @blur="checkColumnCode(tableColumns.code);" type="text"/>
                        <input v-model="tableColumnCode" type="hidden"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">是否必填</label>
                    <div class="col-sm-4">
                        <el-switch on-text="" off-text="" v-model="tableColumns.M"></el-switch>
                    </div>
                    <label class="col-sm-2 control-label">是否主键</label>
                    <div class="col-sm-4">
                        <el-switch on-text="" off-text="" v-model="tableColumns.P"></el-switch>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">数据类型</label>
                    <div class="col-sm-4">
                        <select class="form-control" v-model="tableColumns.dataType">
                            <template v-for="data_type in data_types">
                                <option :value="data_type" v-if="data_type == tableColumns.dataType" selected>
                                    {{data_type}}
                                </option>
                                <option :value="data_type" v-else>
                                    {{data_type}}
                                </option>
                            </template>
                        </select>

                    </div>
                    <label class="col-sm-2 control-label">长度</label>
                    <div class="col-sm-4">
                        <input class="form-control" v-model="tableColumns.lengths" type="text"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">精度</label>
                    <div class="col-sm-4">
                        <input class="form-control" v-model="tableColumns.precision" type="text"/>
                    </div>
                    <label class="col-sm-2 control-label">默认值</label>
                    <div class="col-sm-4">
                        <input class="form-control" v-model="tableColumns.defaults" type="text"/>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">描述</label>
                    <div class="col-sm-10">
                        <textarea v-model="tableColumns.comment" class="form-control" rows="4"></textarea>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">取值范围</label>
                    <div class="col-sm-10">
                        <textarea v-model="tableColumns.scope" placeholder="示例：A:正常,C:销户" class="form-control"
                                  rows="4"></textarea>
                    </div>
                </div>

                <div class="form-group text-center">
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


            <a class="btn btn-info" @click="save();">保存</a>
            <a class="btn btn-info" @click="showSQL();">sql 预览</a>
            <router-link :to="{path:'/tableList', query:{reCode:reCode,system:system}}"
                         class="btn btn-sm btn-success">返回
            </router-link>
        </form>
        <br/>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label class="control-label" style="margin-top: -22px;">所属系统</label>
                <el-select v-model="table.system" size="small" placeholder="请选择">
                    <el-option
                            v-for="item in systems"
                            :label="item.code"
                            :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <div class="form-group">
                <label class="control-label" style="margin-top: -22px;">垂直/水平</label>
                <el-select v-model="table.dbType" size="small" placeholder="请选择">
                    <el-option
                            v-for="item in class1s"
                            :label="item.code"
                            :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <div  class="form-group">
                <label class="control-label" style="margin-top: -22px;">参数/业务</label>
                <el-select v-model="table.parameter" size="small" placeholder="请选择">
                    <el-option
                            v-for="item in class2s"
                            :label="item.code"
                            :value="item.code">
                    </el-option>
                </el-select>
            </div>

        </form>
        <br/>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表中文描述</label>
                <!--<div class="col-sm-4">-->
                    <textarea class="form-control" v-model="table.comment" cols="102" rows="4"></textarea>
                <!--</div>-->
            </div>
        </form>

        <br>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="列管理" name="first">
                <form class="form-inline form-filter">
                    <br>
                    <a class="btn btn-info" @click="moveRow(-1);">上移</a>
                    <a class="btn btn-info" @click="moveRow(1);">下移</a>
                    <a class="btn btn-info" @click="addRow(1);">新增</a>
                    <a class="btn btn-info" @click="addRow(2);">修改</a>
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
                        <tbody ref="tbodyId">
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
                        <tbody ref="ibodyId">
                        <tr v-for="(ind,index) in tableIndexs" @click="selectIndexEvent($event,index);">
                            <td>
                                {{index+1}}
                            </td>
                            <td>
                                <input class="form-control" v-model="ind.code" @blur="checkIndex(ind.code,index);"
                                       type="text"/>
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

    function isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    /**
     * 检查表对象属性
     */
    function checkTableVal(tmp, system) {
        var newTmp;
        if (undefined != tmp && null != tmp && !isEmptyObject(tmp)) {

            if (null == tmp.system || undefined == tmp.system) {
                tmp.system = '';
            }
            if (null == tmp.dbType || undefined == tmp.dbType) {
                tmp.dbType = '';
            }
            if (null == tmp.parameter || undefined == tmp.parameter) {
                tmp.parameter = '';
            }
            if (null == tmp.table_space || undefined == tmp.table_space) {
                tmp.table_space = '';
            }
            if (null == tmp.code || undefined == tmp.code) {
                tmp.code = '';
            }
            if (null == tmp.comment || undefined == tmp.comment) {
                tmp.precision = '';
            }
            if (null == tmp.attr || undefined == tmp.attr) {
                tmp.attr = [];
            }
            if (null == tmp.indexs || undefined == tmp.indexs) {
                tmp.indexs = [];
            }
            newTmp = tmp;
        } else {
            newTmp = {
                "system": system,
                "dbType": "",
                "parameter": "",
                "table_space": "",
                "code": "",
                "comment": "",
                "attr": [],
                "indexs": []
            };
        }
        return newTmp;
    }

    /**
     * 检查表中列对象属性
     */
    function checkColumnVal(tmp) {
        var newTmp;
        if (undefined != tmp && null != tmp && !isEmptyObject(tmp)) {

            if (null == tmp.dictionary || undefined == tmp.dictionary) {
                tmp.dictionary = '';
            }
            if (null == tmp.code || undefined == tmp.code) {
                tmp.code = '';
            }
            if (null == tmp.dataType || undefined == tmp.dataType) {
                tmp.dataType = '';
            }
            if (null == tmp.lengths || undefined == tmp.lengths) {
                tmp.lengths = '';
            }
            if (null == tmp.precision || undefined == tmp.precision) {
                tmp.precision = '';
            }
            if (null == tmp.comment || undefined == tmp.comment) {
                tmp.comment = '';
            }
            if (null == tmp.defaults || undefined == tmp.defaults) {
                tmp.defaults = '';
            }
            if (null == tmp.scope || undefined == tmp.scope) {
                tmp.scope = '';
            }
            if (null == tmp.M || undefined == tmp.M) {
                tmp.M = false;
            }
            if (null == tmp.P || undefined == tmp.P) {
                tmp.P = false;
            }
            newTmp = tmp;
        } else {
            newTmp = {
                "code": "",
                "dataType": "",
                "lengths": "",
                "precision": "",
                "M": false,
                "P": false,
                "comment": "",
                "defaults": "",
                "scope": "",
                "dictionary": ""
            };
        }
        return newTmp;
    }


    export default{
        data(){
            return {
                // 默认激活的页签
                activeName: 'first',
                // 系统ID
                system: '',
                // 表对象
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
                // sql数据
                content: '',
                // 控制sql弹出框
                textshow: false,
                // 弹出框页面的列对象
                tableColumns: {},
                // 弹出框页面的列code
                tableColumnCode: '',
                // 控制列弹出框
                dialogFormVisible: false,
                // 数据字典信息
                dictionarys: [],
                // 查询的单个数据字典对象
                dictionary: {},
                //返回查询页面的模糊搜索值
                reCode:'',
                // option 判断列是新增还是修改 默认0 新增1 修改2
                option: '0',
                // 所属系统
                systems: [{"code": "Ensemble"}, {"code": "Limarket"}, {"code": "Accounting"}],
                // 所属分类1
                class1s: [{"code": "upright"}, {"code": "level"}],
                // 所属分类2
                class2s: [{"code": "init_para"}, {"code": "busi_para"}, {"code": "tran"}],
                // 数据类型
                data_types: ['Integer', 'Number', 'Char', 'Varchar', 'Date', 'Timestamp', 'Clob', 'Blob']
            }
        },
        methods: {
            handleClick(tab, event) {
                //console.lib(tab, event);
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
            // 作废，无用，统一在提交时校验是表名是否用重复 20170302
            checkTableCode(code){
//                this.$http.get('/checkTableCode/' + code + '?oldCode=' + this.tableCode).then(function (res) {
//                    if (res.status == 200) {
//
//                    }
//                }, function (res) {
//                    console.lib('未通过服务端校验' + res.status + '  ' + res.body);
//                    this.table.name = '';
//                    this.$message.error(res.body);
//                });

            },
            // 检查新增的列code是否已经存在
            checkColumnCode(code){
                var flag = false;
                // 如果未做修改，不进行重复检查
                if (code == this.tableColumnCode) {
                    return;
                }
                if (null != this.tableAttr && undefined != this.tableAttr && this.tableAttr.length > 0) {
                    this.tableAttr.forEach(function (attr, index, attrs) {
                        if (undefined != attr && null != attr) {
                            if (code == attr.code) {
                                flag = true;
                            }
                        }
                    });
                }

                if (flag) {
                    this.$message.error('列名已存在');
                    this.tableColumns.code = this.tableColumns.code + '_1';
                }
            },
            // 选中行
            selectRow(e, index){
                this.selectRowNum = index;
                // 设置高亮
                var tr = e.currentTarget;
                var tbd = tr.parentNode;
                if (null != tbd.childNodes) {
                    for (var i in tbd.childNodes) {
                        if (!isNaN(i)) {
                            if (tr == tbd.childNodes[i]) {
                                (tbd.childNodes[i]).style = "background-color: #DEDEDE";
                            } else {
                                (tbd.childNodes[i]).style = '';
                            }
                        }
                    }
                }
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
            // 移动索引
            moveRow(i){
                console.log('移动的行号：' + this.selectRowNum + '  操作i: ' + i);
                if (this.selectRowNum < 0) {
                    this.$message.error('请先选择一行,再进行操作');
                    return;
                }

                // 如果是首行，不能上移
                if (this.selectRowNum == 0 && i < 0) {
                    this.$message.warning('首行不能上移');
                    return;
                }
                // 如果是尾行，不能下移
                if (this.selectRowNum == (this.tableAttr.length - 1) && i > 0) {
                    this.$message.warning('尾行不能下移');
                    return;
                }
                const tr = this.tableAttr[this.selectRowNum];
                this.tableAttr.splice(this.selectRowNum, 1);
                this.tableAttr.splice(this.selectRowNum + i, 0, tr);
                // 移动完成，修改原选中的行号
                this.selectRowNum = this.selectRowNum + i;
                console.log('当前行号：' + this.selectRowNum);
                // 修改高亮显示
                const tbd = this.$refs.tbodyId;
                if (null != tbd.childNodes) {
                    for (var i in tbd.childNodes) {
                        if (!isNaN(i)) {
                            if (this.selectRowNum == i) {
                                (tbd.childNodes[i]).style = "background-color: #DEDEDE";
                            } else {
                                (tbd.childNodes[i]).style = '';
                            }
                        }
                    }
                }
            },
            // 新增列，弹出页面
            addRow(i){
                this.option = i;
                // 打开先清空页面数据
                this.tableColumns = {};
                this.dictionary = {};

                if (this.option == '1') {     // 新增
                    // 查询所有数据字典信息 有疑问？？？
                    this.tableColumns = checkColumnVal();
                    this.getAllDictionarys();
                } else if (this.option == '2') {    // 修改
                    // 如果未选中不能进行修改
                    if (this.selectRowNum < 0) {
                        this.$message.error('请先选择一行,再进行操作');
                        return;
                    }
                    this.getAllDictionarys();
                    // 将选中的数据赋值给弹出页面
                    var attr = this.tableAttr[this.selectRowNum];
                    attr = checkColumnVal(attr);
                    this.tableColumnCode = attr.code;
                    this.tableColumns = attr;
                } else {
                    return;
                }

                this.dialogFormVisible = true;
            },
            // 删除一行
            deleteRow(){
                if (this.selectRowNum >= 0) {
                    this.tableAttr.splice(this.selectRowNum, 1);
                } else {
                    this.$message.error('请先选择一行,再进行操作');
                    return;
                }
            },
            // 根据选中的code查询数据字典赋值给页面
            selectDictionary(code){
                console.log('选择了---' + code);

                if (null != code && '' != code && undefined != code) {
                    this.$http.get('/getDictionary/' + code).then(function (res) {
                        if (res.status == 200) {
                            var re = res.body;
                            console.log('请求的re: ' + re.code);

                            this.tableColumns.code = re.code;
                            this.tableColumns.dataType = re.dataType;
                            this.tableColumns.lengths = re.lengths;
                            this.tableColumns.precision = re.precision;
                            this.tableColumns.column = re.comment;
                            this.tableColumns.scope = re.scope;
                            this.tableColumns.defaults = re.defaults;
                        }
                    }, function (res) {
                        this.$message.error('TableInfo 页面 请求 dictionary ' + code + ' 失败： ' + res.status);
                    });
                }

            },
            // 确定事件
            columnsButton(){
                console.log('-----------点击了确定-----------');

                // 如果数据字典不选择，则需要添加当前列为数据字典
                if (!this.tableColumns.dictionary) {
                    var columnTemp = {
                        "domain": this.tableColumns.code,
                        "code": this.tableColumns.code,
                        "dataType": this.tableColumns.dataType,
                        "lengths": this.tableColumns.lengths,
                        "precision": this.tableColumns.precision,
                        "comment": this.tableColumns.comment,
                        "defaults": this.tableColumns.defaults,
                        "scope": this.tableColumns.scope
                    };
                    console.log(columnTemp);
                    // 保存数据字典
                    this.$http.post('/saveDictionary', {
                        data: columnTemp,
                        oldCode: ''
                    }).then(function (res) {
                        if (res.status == 200) {
                            console.log('添加dictionary成功');
                        } else {
                            console.log('添加dictionary失败');
                        }
                    }, function (res) {
                        console.log('添加dictionary失败，未通过服务端校验' + res.status + '  ' + res.body);
                    });

                    // 保存domain信息
                    // 删除 domain 属性、scope 属性
                    var domainTemp = {
                        "code": this.tableColumns.code,
                        "dataType": this.tableColumns.dataType,
                        "lengths": this.tableColumns.lengths,
                        "precision": this.tableColumns.precision,
                        "comment": this.tableColumns.comment,
                        "defaults": this.tableColumns.defaults
                    };
                    console.log(domainTemp);
                    this.$http.post('/saveDomain', {
                        data: domainTemp,
                        oldCode: ''
                    }).then(function (res) {
                        if (res.status == 200) {
                            console.log('新增domain成功');
                        } else {
                            console.log('新增diomain失败')
                        }
                    }, function (res) {
                        console.log('新增domain失败，未通过服务端校验' + res.status + '  ' + res.body);
                    });


                }
                ;

                // 判断数据字典和code不能为空
                // 目前数据字典可为空
//                if (!this.tableColumns.dictionary || !this.tableColumns.code) {
                if (!this.tableColumns.code) {
                    this.$message.error('请将信息填写完整');
                    return;
                }
                this.dialogFormVisible = false;
                if (this.option == '1') {
                    // 新增，将当前tableColumns 添加到table最后
                    this.tableColumns = checkColumnVal(this.tableColumns);
                    this.tableAttr.push(this.tableColumns);
                } else if (this.option == '2') {
                    // 修改，删除原数组中选中的行数据，将当前的tableColumns添加到原位置
                    this.tableColumns = checkColumnVal(this.tableColumns);
                    this.tableAttr.splice(this.selectRowNum, 1);
                    this.tableAttr.splice(this.selectRowNum, 0, this.tableColumns)
                }


            },

            // 选中的索引行号
            selectIndexEvent(e, index){
                console.log('选中的索引行号：' + index);
                this.selectIndexRowNum = index;

                // 设置高亮
                var tr = e.currentTarget;
                var tbd = tr.parentNode;
                if (null != tbd.childNodes) {
                    for (var i in tbd.childNodes) {
                        if (!isNaN(i)) {
                            if (tr == tbd.childNodes[i]) {
                                tbd.childNodes[i].style = 'background-color: #DEDEDE';
                            } else {
                                tbd.childNodes[i].style = '';
                            }

                        }
                    }
                }
            },
            // 添加一行索引
            addIndexRow(){
                if(this.tableIndexs===undefined){
                    this.tableIndexs=[];
                }
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

                // 高亮显示
                const tbd = this.$refs.ibodyId;
                if (null != tbd.childNodes) {
                    for (var i in tbd.childNodes) {
                        if (!isNaN(i)) {
                            if (this.selectIndexRowNum == i) {
                                (tbd.childNodes[i]).style = "background-color: #DEDEDE";
                            } else {
                                (tbd.childNodes[i]).style = '';
                            }
                        }
                    }
                }
            },
            //获取数据字典封装
            column(code,comment){
                var commentMin=comment.substr(0,10);
             return code+'  - '+commentMin;
            },
            // 检查新修改的索引名称是否有重复
            checkIndex(code, n){
                console.log('code: ' + code + '  n: ' + n)
                var flag = false;
                if (undefined != this.tableIndexs && null != this.tableIndexs && this.tableIndexs.length > 0) {
                    (this.tableIndexs).forEach(function (ind, i, indexs) {
                        if (null != ind && undefined != ind) {
                            if (ind.code == code && n != i) {
                                flag = true;
                            }

                        }
                    })
                }

                if (flag) {
                    this.$message.error('该索引名称已存在');
                    ((this.tableIndexs)[n]).code = ((this.tableIndexs)[n]).code + '_1';
                }
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
            save(){
                const newCode = this.table.code;
                if (null == newCode || undefined == newCode || '' == newCode) {
                    this.$message.warning('请填写表名称');
                    return;
                }

                // 添加column 处理数据
                if (undefined != this.tableAttr && null != this.tableAttr && this.tableAttr.length > 0) {
                    var tattrs = new Array();
                    (this.tableAttr).forEach(function (attr, index, attrs) {
                        tattrs.push(checkColumnVal(attr));
                    });
                    this.table.attr = tattrs;
                } else {
                    this.table.attr = [];
                }
                // 添加索引
                this.table.indexs = this.tableIndexs;
                // 添加模块ID
                this.table.system = this.system;
                this.$http.post('/saveTable', {
                    data: this.table,
                    oldCode: this.tableCode
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('添加表成功');
                        this.$message.success('添加表成功');
                        this.$router.push('/tableList?system=' + this.system+'&reCode='+this.reCode);
                    } else {
                        console.log('添加表失败');
                        this.$message.error('添加表失败');
                    }
                }, function (res) {
                    console.log('添加表失败，未通过服务端校验' + res.status + '  ' + res.body);
                    this.$message.error(res.body);
                });

            },
            showSQL(){
                // 处理数据
                this.table.attr = this.tableAttr;
                // 添加索引
                this.table.indexs = this.tableIndexs;
                this.$http.post('/showSQL', {
                    type: 'tables',
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
                        }
                    } else {
                        console.log('生成sql失败');
                        this.$message.error('生成sql失败');
                    }
                }, function (res) {
                    console.log('生成sql失败' + res.status + '  ' + res.body);
                    this.$message.error(res.body);
                });

            }
        },
        components: {},
        created(){
            // 模块ID
            var mo = this.$route.query.system;
            if (null != mo && undefined != mo && '' != mo && mo.length > 0) {
                this.system = mo;
            } else {
                this.system = '';
            }
            //reCode
            var moCode=this.$route.query.reCode;
            if (null != moCode && undefined != moCode && '' != moCode && moCode.length > 0) {
                this.reCode = moCode;
            } else {
                this.reCode = '';
            }
            console.log('system: ' + this.system);
            this.getAllDomains();
            this.getTableSpaces();

            // 查看或者修改是的 表CODE
            var tcode = this.$route.query.tableCode;
            if (null != tcode && undefined != tcode && '' != tcode && tcode.length > 0) {
                console.log('code: ' + this.tableCode);
                this.tableCode = tcode;
                this.getTable(this.tableCode);
            } else {
                this.table = checkTableVal('', this.system);
            }

        }
    }

</script>
