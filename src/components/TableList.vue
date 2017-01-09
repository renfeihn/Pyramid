<template>
    <div>
        <h2 class="sub-header">表区域 </h2>
        <form class="form-inline form-filter">

            <div class="form-group">
                <label>表中文名称</label>
                <input class="form-control" v-model="keyword" type="text" />
            </div>
            <div class="form-group">
                <label>表英文名称</label>
                <input class="form-control" v-model="keyword" type="text" />
            </div>
            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="category">
                    <option value="">- 选择表空间 -</option>
                    <option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">{{tableSpace.code}}</option>
                </select>
            </div>
            <a class="btn btn-info" @click="">查询</a>
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
                        <a class="btn btn-sm btn-success" >查看</a>
                        <a class="btn btn-sm btn-info" >编辑</a>
                        <a href="javascript:;" class="btn btn-sm btn-danger" @click="">删除</a>
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
            tables:[]
        }
    },
    methods:{
        getAllTables(){
            this.$http.get('/getAll/tables').then(function(res){
                console.log(res.status);
                console.log(res);
                if(res.status == 200){
                   var re = res.body;
                   this.tables = re;
                }
            },function(res){
                alert('请求 table 失败： '+ res.status);
            });
        }

    },
    components:{

    },
    created(){
        this.getAllTables();
    }
}
</script>
