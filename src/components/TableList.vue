<template>
    <div>
        <h2 class="sub-header">表区域 </h2>
        <form class="form-inline form-filter">

            <div class="form-group">
                <label>表名称</label>
                <input class="form-control" v-model="code" type="text"/>
            </div>
            <div class="form-group">
                <label>表中文描述</label>
                <input class="form-control" v-model="comment" type="text"/>
            </div>
            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="tableSpace">
                    <option value="">- 选择表空间 -</option>
                    <option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">
                        {{tableSpace.code}}
                    </option>
                </select>
            </div>
            <a class="btn btn-info" @click="">筛选</a>

            <a class="btn btn-info" href="/tableInfo/code=">新增表</a>
            <a class="btn btn-info" @click="">生成sql</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>name</th>
                    <th>code</th>
                    <th>comment</th>
                    <th>table space</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(table,index) in tables">
                    <td>{{table.name}}</td>
                    <td>{{table.code}}</td>
                    <td>{{table.comment}}</td>
                    <td>{{table.table_space}}</td>
                    <td>
                        <router-link :to="{path:'/tableInfo', query:{tableCode:table.name}}" class="btn btn-sm btn-success">查看</router-link>
                        <a href="javascript:;" class="btn btn-sm btn-danger" @click="">删除</a>
                        <a class="btn btn-sm btn-info">脚本</a>
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
            tables:[],
            tableSpaces:[]
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
        getAllTables(page,code,comment,tableSpace){
            let API = '/getAll/tables?page='+page+'&code='+code+'&comment='+comment+'&tableSpace='+tableSpace;
            this.$http.get(API).then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.tables = re;
                }
            },function(res){
                alert('TableList 页面 请求 table 失败： '+ res.status);
            });
        },
        getSql(){


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
