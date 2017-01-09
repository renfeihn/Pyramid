<template>
    <div>
        <h2 class="sub-header">工作区域 </h2>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="category">
                    <option value="">- 选择表空间 -</option>
                    <option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">{{tableSpace.code}}</option>
                </select>
            </div>
            <div class="form-group">
                <label>表中文名称</label>
                <input class="form-control" v-model="keyword" type="text" />
            </div>
            <div class="form-group">
                <label>表英文名称</label>
                <input class="form-control" v-model="keyword" type="text" />
            </div>
            <a class="btn btn-info" @click="">保存</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>name</th>
                    <th>code</th>
                    <th>data_type</th>
                    <th>length</th>
                    <th>precision</th>
                    <th>M</th>
                    <th>p</th>
                    <th>comment</th>
                    <th>defaule</th>
                    <th>domain</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>

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
            tableSpaces:[]
        }
    },
    methods:{
        getAllTableSpaces(){
            this.$http.get('/getAll/table_space').then(function(res){
                console.log(res.status);
                console.log(res);
                if(res.status == 200){
                   var re = res.body;
                   this.tableSpaces = re.table_spaces;
                }
            },function(res){
                alert('请求table space失败： '+ res.status);
            });
        }

    },
    components:{

    },
    created(){
        this.getAllTableSpaces();
    }
}
</script>
