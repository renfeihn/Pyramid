<template>
    <div>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>数据字典名称</label>
                <input class="form-control" v-model="code" type="text"/>
            </div>
            <a class="btn btn-info" @click="getAllDictionarys();">筛选</a>

            <a class="btn btn-info" href="/dictionaryInfo">新增数据字典</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th width="25%">名称</th>
                    <th width="22%">描述</th>
                    <th width="23%">取值范围</th>
                    <th width="10%">默认值</th>
                    <th width="10%">数据域</th>
                    <th width="20%">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(dictionary,index) in dictionarys">
                    <router-link :to="{path:'/dictionaryInfo', query:{dictionaryCode:dictionary.code}}">{{dictionary.code}}</router-link>
                    <td>{{dictionary.comment}}</td>
                    <td>{{dictionary.scope}}</td>
                    <td>{{dictionary.defaults}}</td>
                    <td>{{dictionary.domain}}</td>
                    <td>
                        <router-link :to="{path:'/dictionaryInfo', query:{dictionaryCode:dictionary.code}}"
                                     class="btn btn-sm btn-success">查看
                        </router-link>
                        <a class="btn btn-sm btn-danger" @click="deleteTable(dictionary.code);">删除</a>
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
                //
                code: '',
                comment: '',
                dictionarys: []
            }
        },
        methods: {
            getAllDictionarys(){
                let API = '/getAll/dictionarys?page=' + '&code=' + this.code + '&comment=' + this.comment;
                this.$http.get(API).then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.dictionarys = re;
                    }
                }, function (res) {
                    this.$message.error('DictionaryList 页面 请求 dictionary 失败： ' + res.status);
                });
            },
            deleteTable(code){
                this.$http.post('/deleteFile', {
                    type: 'dictionarys',
                    code: code
                }).then(function (res) {
                    if (res.status == 200) {
                        // 提示信息并新获取table
                        var re = res.body;
                        if (re) {
                            this.$message.success(re);
                            this.getAllDictionarys();
                        }
                    } else {
                        this.$message.error('删除dictionary失败')
                    }
                }, function (res) {
                    this.$message.error(res.body);
                });
            }
        },
        components: {},
        created(){
            this.getAllDictionarys();
        }
    }

</script>
