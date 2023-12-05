<template>
    <div>
        <form class="form-inline form-filter">
            <div class="form-group">
                <label>数据字典名称</label>
                <input class="form-control" v-model="code" placeholder="@首字母筛选，如@ACC" type="text"/>
            </div>
            <a class="btn btn-info" @click="getAllDictionarys();">筛选</a>

            <a class="btn btn-info" href="/dictionaryInfo">新增数据字典</a>
        </form>

        <div class="table-responsive articleList">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th width="20%">名称</th>
                    <th width="15%">描述</th>
                    <th width="10%">长度</th>
                    <th width="10%">精度</th>
                    <th width="15%">取值范围</th>
                    <th width="10%">默认值</th>
                    <th width="10%">数据域</th>
                    <th width="20%">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(dictionary,index) in dictionarys">
                    <router-link :to="{path:'/dictionaryInfo', query:{dictionaryCode:dictionary.code}}">{{dictionary.code}}</router-link>
                    <td>{{dictionary.comment}}</td>
                    <td>{{dictionary.lengths}}</td>
                    <td>{{dictionary.precision}}</td>
                    <td>{{dictionary.scope}}</td>
                    <td>{{dictionary.defaults}}</td>
                    <td>{{dictionary.domain}}</td>
                    <td>
                        <router-link :to="{path:'/dictionaryInfo', query:{dictionaryCode:dictionary.code,reCode:code}}"
                                     class="btn btn-sm btn-success">查看
                        </router-link>
<!--       暂隐藏删除
                 <a class="btn btn-sm btn-danger" @click="deleteTable(dictionary.code);">删除</a>-->
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- 分页 -->
        <div class="page-bar">
            <ul>
                <li><a :class="setButtonClass(0)" @click="prvePage(page)">上一页</a></li>
                <li v-for="index in indexs" :class="{ active: page == index }">
                    <a @click="btnClick(index)">{{ index < 1 ? "..." : index }}</a>
                </li>
                <li><a :class="setButtonClass(1)" @click="nextPage(page)">下一页</a></li>
            </ul>
        </div>
    </div>
</template>

<style scoped src="../css/pagination.css"></style>

<script>

    export default{
        data(){
            return {
                //
                code: '',
                comment: '',
                dictionarys: [],
                // 当前页
                page: 1,
                // 总页数
                pages: 1
            }
        },
        methods: {
            // 分页开始
            // 页码点击事件
            btnClick: function (data) {
                if (data < 1) return;
                if (data != this.page) {
                    this.page = data;
                    this.getAllDictionarys();
                }
            },
            // 下一页
            nextPage: function (data) {
                if (this.page >= this.pages) return;
                this.btnClick(parseInt(this.page) + 1);
            },
            // 上一页
            prvePage: function (data) {
                if (this.page <= 1) return;
                this.btnClick(parseInt(this.page) - 1);
            },
            // 设置按钮禁用样式
            setButtonClass: function (isNextButton) {
                if (isNextButton) {
                    return this.page >= this.pages ? "page-button-disabled" : ""
                } else {
                    return this.page <= 1 ? "page-button-disabled" : ""
                }
            },
            // 分页结束

            getAllDictionarys(){
                // let API = '/getAll/tables?page=' + this.page + '&system=' + this.system + '&code=' + this.code + '&dbType=' + this.dbType +
                //     '&parameter=' + this.parameter + '&tableSpace=' + this.tableSpace;
                let API = '/getAll/dictionarys?page=' + this.page + '&code=' + this.code + '&comment=' + this.comment;
                this.$http.get(API).then(function (res) {
                    if (res.status == 200) {
                        var re = res.body;
                        // this.dictionarys = re;

                        this.dictionarys = re.items;
                        this.page = re.page;
                        this.pages = re.pages;
                        // 本地缓存当前页
                        localStorage.setItem('currentPage_dict', this.page);

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
        computed: {
            indexs: function () {
                var left = 1;
                var right = this.pages;
                var ar = [];
                if (this.pages >= 11) {
                    if (this.page > 5 && this.page < parseInt(this.pages) - 4) {
                        left = parseInt(this.page) - 5;
                        right = parseInt(this.page) + 4;
                    } else {
                        if (this.page <= 5) {
                            left = 1;
                            right = 10;
                        } else {
                            right = this.pages;
                            left = parseInt(this.pages) - 9
                        }
                    }
                }
                while (left <= right) {
                    ar.push(left);
                    left++;
                }
                if (ar[0] > 1) {
                    ar[0] = 1;
                    ar[1] = -1;
                }
                if (ar[ar.length - 1] < this.pages) {
                    ar[ar.length - 1] = this.pages;
                    ar[ar.length - 2] = 0;
                }
                return ar
            }
        },
        created(){
            //reCode
            var moCode=this.$route.query.reCode;
            if (null != moCode && undefined != moCode && '' != moCode && moCode.length > 0) {
                this.code = moCode;
            } else {
                this.code = '';
            }


            // 当前页记录本地缓存，以便于返回时使用
            let currentPage = localStorage.getItem('currentPage_dict');
            if (null != currentPage && undefined != currentPage && '' != currentPage && currentPage.length > 0) {
                this.page = currentPage;
            } else {
                localStorage.setItem('currentPage_dict', this.page);
            }

            this.getAllDictionarys();
        }
    }

</script>
