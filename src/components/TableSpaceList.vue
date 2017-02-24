<template>
    <div>
        <h2 class="sub-header">表空间区域 </h2>

        <p class="alert alert-danger" v-for="item in errors">{{item}}</p>
        <textarea v-model="content" v-show="textshow" rows="5" cols="100"></textarea>
        <br>

        <form class="form-inline form-filter">
            <div class="form-group">
                <label>表空间名称</label>
                <input class="form-control" v-model="code" type="text"/>
            </div>
            <div class="form-group">
                <label>表空间中文描述</label>
                <input class="form-control" v-model="comment" type="text"/>
            </div>
            <a class="btn btn-info" @click="getAllTables();">筛选</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>名称</th>
                    <th>描述</th>
                    <th>默认表空间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(tableSpace,index) in tableSpaces">
                    <td>{{tableSpace.code}}</td>
                    <td>{{tableSpace.comment}}</td>
                    <td>{{tableSpace.D}}</td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
<script>

export default{
    data(){
        return{
            code:'',
            comment:'',
            tableSpaces:[],
            errors:[],    //服务端验证失败的返回
            // 选中行的索引
            content:'',
            textshow:false
        }
    },
    methods:{
        getAllDomains(){
            let API = '/getAll/table_spaces?page='+'&code='+this.code+'&comment='+this.comment;
            this.$http.get(API).then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.tableSpaces = re;
                }
            },function(res){
                alert('TableSpace 页面 请求 table 失败： '+ res.status);
            });
        },
        deleteTable(code){
            this.$http.post('/deleteFile',{
                type : 'table_spaces',
                code : code
            }).then(function(res){
                if(res.status==200){
                    console.log('删除表空间成功');
                    // 提示信息并新获取table
                    var re = res.body;
                    if(re){
                        this.errors = re;
                        this.getAllDomains();
                    }
                }else{
                    console.log('删除表空间失败')
                }
            },function(res){
                console.log('删除表空间失败'+ res.status + '  '+res.body);
                this.errors = res.body;
            });
        }
    },
    components:{

    },
    created(){
        this.getAllDomains();
    }
}

</script>
