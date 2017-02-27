<template>
    <div>

        <h2 class="sub-header">数据字典详细 </h2>
        <br>

        <form class="form-horizontal">
            <div class="form-group">
                <!-- 选择domain域 -->
                <label class="col-sm-2 control-label">数据域</label>
                <div class="col-sm-4">
                    <el-select v-model="dictionary.domain"
                               @change="selectDomain"
                               filterable placeholder="请选择">
                        <el-option
                                v-for="item in domains"
                                :label="item.code"
                                :value="item.code">
                        </el-option>
                    </el-select>

                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">名称</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="dictionaryCode" type="hidden"/>
                    <input class="form-control" v-model="dictionary.code" @blur="checkDictionaryCode(dictionary.code);"
                           type="text"/>
                </div>
                <label class="col-sm-2 control-label">中文描述</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="dictionary.comment" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">数据类型</label>
                <div class="col-sm-4">
                    <input class="form-control" readonly="isReadOnly" v-model="dictionary.dataType" type="text"/>
                    <!--<select class="form-control" readonly="isReadOnly" v-model="dictionary.dataType">-->
                    <!--<template v-for="data_type in data_types">-->
                    <!--<option :value="data_type" v-if="data_type == dictionary.dataType" selected>-->
                    <!--{{data_type}}-->
                    <!--</option>-->
                    <!--<option :value="data_type" v-else>-->
                    <!--{{data_type}}-->
                    <!--</option>-->
                    <!--</template>-->
                    <!--</select>-->
                </div>
                <label class="col-sm-2 control-label">长度</label>
                <div class="col-sm-4">
                    <input class="form-control" readonly="isReadOnly" v-model="dictionary.lengths" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">精度</label>
                <div class="col-sm-4">
                    <input class="form-control" readonly="isReadOnly" v-model="dictionary.precision" type="text"/>
                </div>
                <label class="col-sm-2 control-label">默认值</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="dictionary.defaults" type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">取值范围</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="dictionary.scope" type="text"/>
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
                dictionaryCode: '',
                // 数据字典
                dictionary: {},
                // 所有domain域
                domains: []
            }
        },
        methods: {
            getDictionary(code){
                if (null != code && '' != code && undefined != code) {
                    this.$http.get('/getDictionary/' + code).then(function (res) {
                        if (res.status == 200) {
                            var re = res.body;
                            this.dictionary = re;
                        }
                    }, function (res) {
                        this.$message.error('DictionaryInfo 页面 请求 dictionary ' + code + ' 失败： ' + res.status);
                    });
                }
            },
            getAllDomains(){
                this.$http.get('/getAll/domains').then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        this.domains = re;
                    }
                }, function (res) {
                    this.$message.error('DictionaryInfo 页面 请求domain失败： ' + res.status);
                });
            },
            selectDomain(code){
                console.log('选中的值：' + code);
                // 获取domain，赋值给当前页面

                // 如果当前数据字典对象为空，表示新增
                if (null == (this.dictionary).code || undefined == (this.dictionary).code || '' == (this.dictionary).code) {
                    return;
                }
                if (null != code && '' != code && undefined != code) {
                    this.$http.get('/getDomain/' + code).then(function (res) {
                        if (res.status == 200) {
                            var re = res.body;
                            this.dictionary.dataType = re.dataType;
                            this.dictionary.lengths = re.lengths;
                            this.dictionary.precision = re.precision;
                        }
                    }, function (res) {
                        this.$message.error('DictionaryInfo 页面 请求 domain ' + code + ' 失败： ' + res.status);
                    });
                }

            },
            checkDictionaryCode(code){
                this.$http.get('/checkDictionaryCode/' + code + '?oldCode=' + this.domainCode).then(function (res) {
                    if (res.status == 200) {
                    }
                }, function (res) {
                    console.log('未通过服务端校验' + res.status + '  ' + res.body);
                    this.$message.error(res.body);
                });
            },

            save(){
                const newCode = this.dictionary.code;
                if (null == newCode || undefined == newCode || '' == newCode) {
                    this.$message.warning('请填写数据字典名称');
                    return;
                }

                // 处理数据
                this.$http.post('/saveDictionary', {
                    data: this.dictionary,
                    oldCode: this.dictionaryCode
                }).then(function (res) {
                    if (res.status == 200) {
                        this.$message.success('添加dictionary成功');
                        this.$router.push('/dictionaryList');
                    } else {
                        console.log('添加dictionary失败');
                        this.$message.error('添加dictionary失败');
                    }
                }, function (res) {
                    console.log('添加dictionary失败，未通过服务端校验' + res.status + '  ' + res.body);
                    this.$message.error(res.body);
                });

            }
        },
        components: {},
        created(){
            var params = window.location.search.split('=');
            console.log('params: ' + params);

            if (null != params && undefined != params && '' != params && params.length > 0) {
                this.dictionaryCode = params[1];
            }
            console.log('code: ' + this.dictionaryCode);
            if ('' != this.dictionaryCode) {
                this.getDictionary(this.dictionaryCode);
            }

            // 获取domains
            this.getAllDomains();
        }
    }

</script>
