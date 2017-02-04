<template>
    <div>
        <h2 class="sub-header">表区域 </h2>

        <p class="alert alert-danger" v-for="item in errors">{{item}}</p>
        <textarea v-model="content" v-show="textshow" rows="5" cols="100"></textarea>
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

            <a class="btn btn-info" href="/tableInfo">新增表</a>
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
                        <router-link :to="{path:'/tableInfo', query:{tableCode:table.name}}" class="btn btn-sm btn-success">查看</router-link>
                        <a class="btn btn-sm btn-danger" @click="deleteTable(table.code);">删除</a>
                        <a class="btn btn-sm btn-info" @click="getSql(table.code);">SQL预览</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>

export default{
    data(){
        return{
            code:'',
            comment:'',
            tableSpace:'',
            tables:[],
            tableSpaces:[],
            errors:[],    //服务端验证失败的返回
            // 选中行的索引
            content:'',
            textshow:false
        }
    },
    methods:{
        getTableSpaces(){
            this.$http.get('/getAll/table_spaces').then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.tableSpaces = re;
                }
            },function(res){
                alert('TableList 页面 请求 table space 失败： '+ res.status);
            });
        },
        getAllTables(){
            let API = '/getAll/tables?page='+'&code='+this.code+'&comment='+this.comment+'&tableSpace='+this.tableSpace;
            this.$http.get(API).then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.tables = re;
                }
            },function(res){
                alert('TableList 页面 请求 table 失败： '+ res.status);
            });
        },
        deleteTable(code){
            this.$http.post('/deleteFile',{
                type : 'tables',
                code : code
            }).then(function(res){
                if(res.status==200){
                    console.log('删除表成功');
                    // 提示信息并新获取table
                    var re = res.body;
                    if(re){
                        this.errors = re;
                        this.getAllTables();
                    }
                }else{
                    console.log('删除表失败')
                }
            },function(res){
                console.log('删除表失败'+ res.status + '  '+res.body);
                this.errors = res.body;
            });
        },
        generatorSql(){
            this.$http.post('/generatorSql',{
                type : 'table',
                db_type : localStorage.getItem('dbms')
            }).then(function(res){
                if(res.status==200){
                    console.log('生成sql成功');
                    // 弹出框，展示sql
                    var re = res.body;
                    if(re){
                        this.errors = re;
                    }
                }else{
                    console.log('生成sql失败')
                }
            },function(res){
                console.log('生成sql失败'+ res.status + '  '+res.body);
                this.errors = res.body;
            });
        },
        getSql(code){
            this.$http.post('/showSQL',{
                type : 'table',
                db_type : localStorage.getItem('dbms'),
                code : code
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
                this.errors = res.body;
            });
        }
    },
    components:{

    },
    created(){
        this.getTableSpaces();
        this.getAllTables();
    }
}

</script>
