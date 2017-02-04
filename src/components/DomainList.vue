<template>
    <div>
        <h2 class="sub-header">domain区域 </h2>

        <p class="alert alert-danger" v-for="item in errors">{{item}}</p>
        <textarea v-model="content" v-show="textshow" rows="5" cols="100"></textarea>
        <br>

        <form class="form-inline form-filter">
            <div class="form-group">
                <label>domain名称</label>
                <input class="form-control" v-model="code" type="text"/>
            </div>
            <!--<div class="form-group">-->
                <!--<label>domain中文描述</label>-->
                <!--<input class="form-control" v-model="comment" type="text"/>-->
            <!--</div>-->
            <a class="btn btn-info" @click="getAllDomains();">筛选</a>

            <a class="btn btn-info" href="/domainInfo">新增domain</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>名称</th>
                    <th>描述</th>
                    <th>默认值</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(domain,index) in domains">
                    <td>{{domain.code}}</td>
                    <td>{{domain.comment}}</td>
                    <td>{{domain.defaults}}</td>
                    <td>
                        <router-link :to="{path:'/domainInfo', query:{domainCode:domain.name}}" class="btn btn-sm btn-success">查看</router-link>
                        <a class="btn btn-sm btn-danger" @click="deleteTable(domain.code);">删除</a>
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
            domains:[],
            errors:[],    //服务端验证失败的返回
            // 选中行的索引
            content:'',
            textshow:false
        }
    },
    methods:{
        getAllDomains(){
            let API = '/getAll/domains?page='+'&code='+this.code+'&comment='+this.comment;
            this.$http.get(API).then(function(res){
                if(res.status == 200){
                   var re = res.body;
                   this.domains = re;
                }
            },function(res){
                alert('DomainList 页面 请求 table 失败： '+ res.status);
            });
        },
        deleteTable(code){
            this.$http.post('/deleteFile',{
                type : 'domains',
                code : code
            }).then(function(res){
                if(res.status==200){
                    console.log('删除domain成功');
                    // 提示信息并新获取table
                    var re = res.body;
                    if(re){
                        this.errors = re;
                        this.getAllDomains();
                    }
                }else{
                    console.log('删除domain失败')
                }
            },function(res){
                console.log('删除domain失败'+ res.status + '  '+res.body);
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
