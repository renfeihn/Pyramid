<template>
    <div>
        <h2 class="sub-header">domain区域 </h2>
        <p class="alert alert-danger" v-for="item in errors">{{item}}</p>
        <textarea v-model="content" v-show="textshow" rows="5" cols="100"></textarea>
        <br>
        <form class="form-horizontal">
            <div class="form-group">
                <label class="col-sm-2 control-label">名称</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="domainCode" type="hidden"/>
                    <input class="form-control" v-model="domain.code" @blur="checkDomainCode(domain.code);" type="text"/>
                </div>
                <label class="col-sm-2 control-label">中文描述</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="domain.comment" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">数据类型</label>
                <div class="col-sm-4">
                    <select class="form-control" v-model="domain.dataType">
                        <template v-for="data_type in data_types">
                            <option :value="data_type" v-if="data_type == domain.dataType" selected>
                                {{data_type}}
                            </option>
                            <option :value="data_type" v-else>
                                {{data_type}}
                            </option>
                        </template>
                    </select>

                </div>
                <label class="col-sm-2 control-label">长度</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="domain.lengths" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">精度</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="domain.precision" type="text"/>
                </div>
                <label class="col-sm-2 control-label">默认值</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="domain.defaults" type="text"/>
                </div>
            </div>

            <a class="btn btn-info" @click="save();">保存</a>
        </form>
    </div>
</template>
<style scoped src="../css/dashboard.css">

</style>
<script>

export default{
    data(){
        return{
            data_types : ['Integer', 'Number', 'Float', 'Char', 'Varchar', 'Nverchar', 'Date', 'Timestamp', 'Clob', 'Blob'],
            // 传递进来的 code 参数
            domainCode:'',
            // domain域
            domain:{},
            // 服务端验证失败的返回
            errors:[],
            // 选中行的索引
            content:'',
            // 错误信息是否显示
            textshow:false
        }
    },
    methods:{
        getDomain(code){
            if(null != code && '' != code && undefined != code){
                this.$http.get('/getDomain/'+code).then(function(res){
                    if(res.status == 200){
                        var re = res.body;
                        this.domain = re;
                    }
                },function(res){
                    alert('DomainInfo 页面 请求 domain '+code+' 失败： '+ res.status);
                });
            }
        },

        checkDomainCode(code){
            this.$http.get('/checkDomainCode/'+code+'?oldCode='+this.domainCode).then(function(res){
                if(res.status == 200){
                    this.errors=[];
                }
            },function(res){
                console.log('未通过服务端校验'+ res.status + '  '+res.body);
                this.errors = res.body;
            });
        },

        save(){
            // 处理数据
            this.$http.post('/saveDomain',{
                data : this.domain,
                oldCode : this.domainCode
            }).then(function(res){
                if(res.status==200){
                    console.log('添加domain成功');
                    this.$router.push('/domainList');
                }else{
                    console.log('添加diomain失败')
                }
            },function(res){
                console.log('添加domain失败，未通过服务端校验'+ res.status + '  '+res.body);
                this.errors=res.body;
            });

        }
    },
    components:{

    },
    created(){
        var params = window.location.search.split('=');
        console.log('params: ' + params);

        if(null != params && undefined != params && '' != params && params.length > 0){
            this.domainCode = params[1];
        }
        console.log('code: ' + this.domainCode);

        this.getDomain(this.domainCode);
    }
}

</script>
