<template>
    <div>
        <h2 class="sub-header">工作区域 </h2>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="table.table_space">
                    <option value="">- 选择表空间 -</option>
                    <option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">
                        {{tableSpace.code}}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label>表名称</label>
                <input class="form-control" v-model="table.code" type="text"/>
            </div>
            <div class="form-group">
                <label>表中文描述</label>
                <input class="form-control" v-model="table.comment" type="text"/>
            </div>

            <a class="btn btn-info" @click="">保存</a>
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
                    <th>索引</th>
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


var data_types = ['Integer', 'Byte', 'Number', 'Decimal', 'Float', 'Boolean', 'Date','Variable Characters','Double'];

export default{
    data(){
        return{
            table:[],
            // table 中 attr 的属性
            tableAttr:[],
            // 所有domain域
            domains:[],
            // 所有表空间
            tableSpaces:[],
            // 选中行的索引
            selectRowIndex:-1
        }
    },
    methods:{
        getTable(code){
            this.$http.get('/getTable/'+code).then(function(res){
                if(res.status == 200){
                    var re = res.body;
                    this.table = re;
                    if(null != re && re.attr instanceof Array){
                        this.tableAttr = (this.table).attr;
                        this.selectRowIndex = this.tableAttr.length;
                    }else{
                        this.tableAttr = null;
                    }
                }
            },function(res){
                alert('TableInfo 页面 请求 table '+code+' 失败： '+ res.status);
            });
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
        selectRow(e,index){
            // 设置高亮
            //var tr = e.target;
            //tr.setAttribute("style", "background-color: #f5f5f5");
            this.selectRowIndex = index;
        },
        addRow(i){
            if(this.selectRowIndex != -1){
                this.tableAttr.splice(this.selectRowIndex+i,0,new Object());
            }else{
                this.tableAttr.push(new Object());
            }
        },
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
                                (that.tableAttr[index]).length = (that.domains[i]).length;
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
        }// domain end

    },
    components:{

    },
    created(){
        this.tableCode = window.location.search.split('=')[1];

        this.getTable(this.tableCode);
        this.getAllDomains();
        this.getTableSpaces();
    }
}






</script>
