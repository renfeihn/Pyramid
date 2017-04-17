<template>
    <div>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>域名称</label>
                <input class="form-control" v-model="code" @change="getAllDomains();" type="text"/>
            </div>
            <a class="btn btn-info" @click="getAllDomains();">筛选</a>

            <a class="btn btn-info" href="/domainInfo">新增domain</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>名称</th>
                    <th>描述</th>
                    <th>数据类型</th>
                    <th>长度</th>
                    <th>精度</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(domain,index) in domains">
                    <td>{{domain.code}}</td>
                    <td>{{domain.comment}}</td>
                    <td>{{domain.dataType}}</td>
                    <td>{{domain.lengths}}</td>
                    <td>{{domain.precision}}</td>
                    <td>
                        <router-link :to="{path:'/domainInfo', query:{domainCode:domain.code}}"
                                     class="btn btn-sm btn-success">查看
                        </router-link>
                        <!--暂时去掉删除，留作后期做权限处理
                        <a class="btn btn-sm btn-danger" @click="deleteTable(domain.code);">删除</a>-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
<script>

    export default{
        data(){
            return {
                code: '',
                comment: '',
                domains: []
            }
        },
        methods: {
            getAllDomains(){
                let API = '/getAll/domains?page=' + '&code=' + this.code + '&comment=' + this.comment;
                this.$http.get(API).then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.domains = re;
                    }
                }, function (res) {
                    this.$message.error('DomainList 页面 请求 table 失败： ' + res.status);
                });
            },
            deleteTable(code){
                this.$http.post('/deleteFile', {
                    type: 'domains',
                    code: code
                }).then(function (res) {
                    if (res.status == 200) {
                        console.log('删除domain成功');
                        // 提示信息并新获取table
                        var re = res.body;
                        if (re) {
                            console.log(re);
                            this.getAllDomains();
                            this.$message.success(re);
                        }
                    } else {
                        this.$message.error('删除domain失败');
                    }
                }, function (res) {
                    this.$message.error('删除domain失败' + res.status + '  ' + res.body);
                });
            }
        },
        components: {},
        created(){
            this.getAllDomains();
        }
    }

</script>
