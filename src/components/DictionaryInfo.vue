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
                                :label=column(item.code,item.comment)
                                :value="item.code">
                        </el-option>
                    </el-select>
                </div>
                <label class="col-sm-2 control-label">名称</label>
                <div class="col-sm-4">
                    <input class="form-control" v-model="dictionaryCode" type="hidden"/>
                    <input class="form-control" v-model="dictionary.code" @blur="checkDictionaryCode(dictionary.code);"
                           type="text"/>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">数据类型</label>
                <div class="col-sm-4">
                    <input class="form-control" readonly="isReadOnly" v-model="dictionary.dataType" type="text"/>
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
                <label class="col-sm-2 control-label">描述</label>
                <div class="col-sm-4">
                    <textarea v-model="dictionary.comment" class="form-control" rows="4"></textarea>
                </div>
                <label class="col-sm-2 control-label">取值范围</label>
                <div class="col-sm-4">
                    <textarea v-model="dictionary.scope" placeholder="示例：A:正常,C:销户" class="form-control" rows="4"></textarea>
                </div>
            </div>

            <div class="form-group text-center">
                <a class="btn btn-info" @click="save();">保存</a>
                <a class="btn btn-success" href="javascript:history.go(-1);">返回</a>
            </div>
        </form>
    </div>
</template>
<script>

    function isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }

    /**
     * 检查数据字典属性 如果不存在的属性，赋空
     */
    function checkObjectVal(tmp) {
        var newTmp;
        if (undefined != tmp && null != tmp && !isEmptyObject(tmp)) {

            if (null == tmp.domain || undefined == tmp.domain) {
                tmp.domain = '';
            }
            if (null == tmp.code || undefined == tmp.code) {
                tmp.code = '';
            }
            if (null == tmp.dataType || undefined == tmp.dataType) {
                tmp.dataType = '';
            }
            if (null == tmp.lengths || undefined == tmp.lengths) {
                tmp.lengths = '';
            }
            if (null == tmp.precision || undefined == tmp.precision) {
                tmp.precision = '';
            }
            if (null == tmp.comment || undefined == tmp.comment) {
                tmp.comment = '';
            }
            if (null == tmp.defaults || undefined == tmp.defaults) {
                tmp.defaults = '';
            }
            if (null == tmp.scope || undefined == tmp.scope) {
                tmp.scope = '';
            }
            newTmp = tmp;
        } else {
            newTmp = {
                "domain": "",
                "code": "",
                "dataType": "",
                "lengths": "",
                "precision": "",
                "comment": "",
                "defaults": "",
                "scope": ""
            };
        }
        return newTmp;
    }


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
                            console.log('查询 getDictionary 完成！');
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
                        console.log('查询 getAllDomains 完成！');
                        this.domains = re;
                    }
                }, function (res) {
                    this.$message.error('DictionaryInfo 页面 请求domain失败： ' + res.status);
                });
            },
            selectDomain(code){
                console.log('选中的值：' + code);
                // 获取domain，赋值给当前页面
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
            //获取数据字典封装
            column(code,comment){
                var commentMin=comment.substr(0,10);
                return code+'  - '+commentMin;
            },
            save(){
                const newCode = this.dictionary.code;
                if (null == newCode || undefined == newCode || '' == newCode) {
                    this.$message.warning('请填写数据字典名称');
                    return;
                }

                this.dictionary = checkObjectVal(this.dictionary);

                // 处理数据
                this.$http.post('/saveDictionary', {
                    data: this.dictionary,
                    oldCode: this.dictionaryCode
                }).then(function (res) {
                    if (res.status == 200) {
                        this.$message.success('添加dictionary成功');
                        this.$router.push('/dictionaryList?reCode='+this.reCode);
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
            // 模块ID
            var mo = this.$route.query.dictionaryCode;
            console.log('mo: ' + mo);
            if (null != mo && undefined != mo && '' != mo && mo.length > 0) {
                this.dictionaryCode= mo;
            } else {
                this.dictionaryCode = '';
            }
            //reCode
            var moCode=this.$route.query.reCode;
            if (null != moCode && undefined != moCode && '' != moCode && moCode.length > 0) {
                this.reCode = moCode;
            } else {
                this.reCode = '';
            }
            console.log('code: ' + this.dictionaryCode);

            if ('' != this.dictionaryCode) {
                this.getDictionary(this.dictionaryCode);
            } else {
                // 有疑问？？？
                this.dictionary = checkObjectVal();
            }

            // 获取domains
            this.getAllDomains();

        }
    }

</script>
