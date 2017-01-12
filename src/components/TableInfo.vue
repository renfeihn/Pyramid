<template>
    <div>
        <h2 class="sub-header">工作区域 </h2>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表空间</label>
                <select class="form-control" v-model="category">
                    <option value="">- 选择表空间 -</option>
                    <option v-for="(tableSpace, index) in tableSpaces" :value="tableSpace.code.toString()">
                        {{tableSpace.code}}
                    </option>
                </select>
            </div>
            <div class="form-group">
                <label>表中文名称</label>
                <input class="form-control" v-model="comment" type="text"/>
            </div>
            <div class="form-group">
                <label>表英文名称</label>
                <input class="form-control" v-model="code" type="text"/>
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
                    <th>default</th>
                    <th>domain</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(table,index) in tables.attr">
                    <td>{{table.name}}</td>
                    <td>{{table.code}}</td>
                    <td>{{table.data_type}}</td>
                    <td>{{table.lengths}}</td>
                    <td>{{table.precision}}</td>
                    <td>{{table.M}}</td>
                    <td>{{table.P}}</td>
                    <td>{{table.comment}}</td>
                    <td>{{table.default}}</td>
                    <td>{{table.domain}}</td>
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
            tableSpaces:[],
        }
    },
    methods:{
        getTable(code){
            this.$http.get('/getTable/'+code).then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.tables = re;
                }
            },function(res){
                alert('请求 table '+code+' 失败： '+ res.status);
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
        }

    },
    components:{

    },
    created(){
        this.tableCode = window.location.search.split('=')[1];
        console.log('code:  '+this.tableCode);
        this.getTable(this.tableCode);
        this.getTableSpaces();
    }
}


</script>
