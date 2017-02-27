<template>
    <div>
        <h2 class="sub-header">domain区域 </h2>
        <br>
        <form class="form-horizontal">
            <div class="form-group">
                <label class="col-sm-2 control-label">名称</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="domainCode" type="hidden"/>
                    <input class="form-control" v-model="domain.code" @blur="checkDomainCode(domain.code);"
                           type="text"/>
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
<script>

    export default{
        data(){
            return {
                data_types: ['Integer', 'Number', 'Char', 'Varchar', 'Date', 'Timestamp', 'Clob', 'Blob'],
                // 传递进来的 code 参数
                domainCode: '',
                // domain域
                domain: {}
            }
        },
        methods: {
            getDomain(code){
                if (null != code && '' != code && undefined != code) {
                    this.$http.get('/getDomain/' + code).then(function (res) {
                        if (res.status == 200) {
                            var re = res.body;
                            this.domain = re;
                        }
                    }, function (res) {
                        this.$message.error('DomainInfo 页面 请求 domain ' + code + ' 失败： ' + res.status);
                    });
                }
            },

            checkDomainCode(code){
                this.$http.get('/checkDomainCode/' + code + '?oldCode=' + this.domainCode).then(function (res) {
                    if (res.status == 200) {
                    }
                }, function (res) {
                    this.$message.error('未通过服务端校验' + res.status + '  ' + res.body);
                    //this.errors = res.body;
                });
            },

            save(){
                // 处理数据
                var msg;
                if (null != this.domainCode && undefined != this.domainCode && '' != this.domainCode) {
                    msg = '保存';
                } else {
                    msg = '新增';
                }

                const newCode = this.domain.code;
                if (null == newCode || undefined == newCode || '' == newCode) {
                    this.$message.warning('请填写数据域名称');
                    return;
                }

                this.$http.post('/saveDomain', {
                    data: this.domain,
                    oldCode: this.domainCode
                }).then(function (res) {
                    if (res.status == 200) {
                        this.$message.success(msg + 'domain成功');
                        this.$router.push('/domainList');
                    } else {
                        this.$message.error(msg + 'diomain失败')
                    }
                }, function (res) {
                    this.$message.error(msg + 'domain失败，未通过服务端校验' + res.status + '  ' + res.body);
                });

            }
        },
        components: {},
        created(){
            var params = window.location.search.split('=');
            console.log('params: ' + params);

            if (null != params && undefined != params && '' != params && params.length > 0) {
                this.domainCode = params[1];
            }
            console.log('code: ' + this.domainCode);

            this.getDomain(this.domainCode);
        }
    }

</script>
