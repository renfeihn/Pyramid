<template>
    <div>
        <h2 class="sub-header">工作区域 </h2>
        <p class="alert alert-danger" v-for="item in errors">{{item}}</p>
        <textarea v-model="content" v-show="textshow" rows="5" cols="100"></textarea>
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
                <input class="form-control" v-model="table.code" @blur="checkTableCode(table.code);" type="text"/>
            </div>
            <div class="form-group">
                <label>表中文描述</label>
                <input class="form-control" v-model="table.comment" type="text"/>
            </div>

            <a class="btn btn-info" @click="save();">保存</a>
            <a class="btn btn-info" @click="showSQL();">sql 预览</a>
        </form>
        <form class="form-inline form-filter">
            <br>
            <a class="btn btn-info" @click="addRow(0);">add before</a>
            <a class="btn btn-info" @click="addRow(1);">add after</a>
            <a class="btn btn-info" @click="deleteRow();">remove</a>
        </form>
        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th></th>
                    <th>name</th>
                    <th>code</th>
                    <th>data_type</th>
                    <th>length</th>
                    <th>precision</th>
                    <th>M</th>
                    <th>p</th>
                    <th>comment</th>
                    <th>default</th>
                    <th>domain</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(tb,index) in tableAttr" @click="selectRow($event,index);">
                    <td>{{index+1}}</td>
                    <td @dblclick="editInput($event,'name',tb,index)">{{tb.name}}</td>
                    <td @dblclick="editInput($event,'code',tb,index)">{{tb.code}}</td>
                    <td @dblclick="editDataType($event,'dataType',tb,index)">{{tb.dataType}}</td>
                    <td @dblclick="editInput($event,'lengths',tb,index)">{{tb.lengths}}</td>
                    <td @dblclick="editInput($event,'precision',tb,index)">{{tb.precision}}</td>
                    <td @dblclick="editInput($event,'M',tb,index)">{{tb.M}}</td>
                    <td @dblclick="editInput($event,'P',tb,index)">{{tb.P}}</td>
                    <td @dblclick="editable($event,'comment',tb,index)">{{tb.comment}}</td>
                    <td @dblclick="editInput($event,'defaults',tb,index)">{{tb.defaults}}</td>
                    <td @dblclick="editDomain($event,'domain',tb,index)">{{tb.domain}}</td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>

import editable from '../plugins/editable.js';

var data_types = ['Integer', 'Number', 'Float', 'Char', 'Varchar', 'Nverchar', 'Date', 'Timestamp', 'Clob', 'Blob'];

export default{
    data(){
        return{
            table:{},
            // table 中 attr 的属性
            tableAttr:[],
            // 所有domain域
            domains:[],
            // 所有表空间
            tableSpaces:[],
            errors:[],    //服务端验证失败的返回
            // 选中行的索引
            selectRowIndex:-1,
            content:'',
            textshow:false,
            // 页面累计行数
            maxRowSize:0
        }
    },
    methods:{
        getTable(code){
            if(null != code && '' != code && undefined != code){
                this.$http.get('/getTable/'+code).then(function(res){
                    if(res.status == 200){
                        var re = res.body;
                        this.table = re;
                        console.log('table_space: '+ re.table_space);
                        if(null != re && re.attr instanceof Array){
                            this.tableAttr = (this.table).attr;
                            this.maxRowSize = this.tableAttr.length;
                        }else{
                            this.tableAttr = null;
                        }
                    }
                },function(res){
                    alert('TableInfo 页面 请求 table '+code+' 失败： '+ res.status);
                });
            }

        },
        getAllDomains(){
            this.$http.get('/getAll/domains').then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.domains = re;
                }
            },function(res){
                alert('TableInfo 页面 请求domain失败： '+ res.status);
            });
        },
        getTableSpaces(){
            this.$http.get('/getAll/table_spaces').then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.tableSpaces = re;
                }
            },function(res){
                alert('TableInfo 页面 请求 table space 失败： '+ res.status);
            });
        },
        checkTableCode(code){
            this.$http.get('/checkTableCode/'+code).then(function(res){
                if(res.status == 200){
                    this.errors=[];
                    this.table.name = code;
                }
            },function(res){
                console.log('未通过服务端校验'+ res.status + '  '+res.body);
                this.table.name = '';
                this.errors = res.body;
            });

        },
        // 选中行
        selectRow(e,index){
            // 设置高亮
            var tr = e.currentTarget;
            console.log('tr:  '+tr.innerHTML);
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
            this.selectRowIndex = index;
        },
        // 添加一行
        addRow(i){
            this.maxRowSize ++;
            const tr = new Object();
            tr.name  = 'Column_'+(this.maxRowSize);
            tr.code  = 'Column_'+(this.maxRowSize);

            // 如果没有选中行，第一次 add before 在首行添加，  第一次 add after 在数组尾行添加
            if (this.selectRowIndex == -1){
                if(null != this.tableAttr && this.tableAttr instanceof Array){
                    if(i == 1){
                        this.selectRowIndex = this.tableAttr.length;
                    }
                }
                if(i == 0){
                    this.selectRowIndex = 0;
                }
            }
            this.tableAttr.splice(this.selectRowIndex+i,0,tr);
        },
        // 删除一行
        deleteRow(){
            if(this.selectRowIndex != -1){
                this.tableAttr.splice(this.selectRowIndex,1);
            }
        },
        // 普通的input
        editInput(e,field,data,index){
            var that = this;
            editable.editInput(e,function(value){
                // 如果数据修改 更新到 model 中
                (that.tableAttr[index])[field] = value;
            });
        },
        // dataType
        editDataType(e,field,data,index){
            var that = this;
            editable.editSelect(e,data_types,function(value){
                //如果数据没有被修改这个回调方法不会执行
                (that.tableAttr[index])[field] = value;
            });
        },
        // domain
        editDomain(e,field,data,index){
            var that = this;
            if(null != that.domains && that.domains instanceof Array){
                var options = new Array();
                for(var i in that.domains){
                    options.push((that.domains[i]).code);
                }
                if(options.length > 0){
                    editable.editSelect(e,options,function(value){
                        // 如果数据没有被修改这个回调方法不会执行
                        // 如果数据修改，则用domain的属性覆盖改行的数据
                        for(var i in that.domains){
                            if(value == (that.domains[i]).code){
                                (that.tableAttr[index]).name = (that.domains[i]).name;
                                (that.tableAttr[index]).code = (that.domains[i]).code;
                                (that.tableAttr[index]).data_type = (that.domains[i]).data_type;
                                (that.tableAttr[index]).lengths = (that.domains[i]).lengths;
                                (that.tableAttr[index]).precision = (that.domains[i]).precision;
                                (that.tableAttr[index]).comment = (that.domains[i]).comment;
                                (that.tableAttr[index]).defaults = (that.domains[i]).defaults;
                                // 移除事件不可修改
                            }else{
                                // 添加事件
                            }
                        }
                    });
                }
            }
        },// domain end

        save(){
            // 处理数据
            this.table.attr = this.tableAttr;
            this.$http.post('/saveTable',{
                data : this.table
            }).then(function(res){
                if(res.status==200){
                    console.log('添加表成功');
                    this.$router.push('/tableList');
                }else{
                    console.log('添加表失败')
                }
            },function(res){
                console.log('添加表失败，未通过服务端校验'+ res.status + '  '+res.body);
                this.errors=res.body;
            });

        },
        showSQL(){

            // 处理数据
            this.table.attr = this.tableAttr;
            this.$http.post('/showSQL',{
                type : 'table',
                db_type : localStorage.getItem('dbms'),
                data : this.table
            }).then(function(res){
                if(res.status==200){
                    console.log('生成sql成功');
                    // 弹出框，展示sql
                    var re = res.body;
                    if(re){
                        this.textshow = true;
                        this.content = re;
                        // 先清除错误信息
                        this.errors = [];
                    }
                }else{
                    console.log('生成sql失败')
                }
            },function(res){
                console.log('生成sql失败'+ res.status + '  '+res.body);
                this.errors=res.body;
            });

        }
    },
    components:{

    },
    created(){
        var params = window.location.search.split('=');
        console.log('params: ' + params);

        if(null != params && undefined != params && '' != params && params.length > 0){
            this.tableCode = params[1];
        }else{
            this.tableCode = '';
        }
        console.log('code: ' + this.tableCode);

        this.getTable(this.tableCode);
        this.getAllDomains();
        this.getTableSpaces();
    }
}

</script>
