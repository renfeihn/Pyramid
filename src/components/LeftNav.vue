<template>
    <div>
        <ul class="nav nav-sidebar">
            <li><a href="/tableList" @click="getAllTables()"><i class="fa fa-th-list"></i>&nbsp;tables</a>
            </li>

            <li v-for="(table, index) in tables">
                <a href="/index"><i class="fa fa-files-o"></i>&nbsp;{{table.name}}</a>
            </li>

            <li><a href="javascript:;" @click="getAllDomains()"><i class="fa fa-th-list"></i>&nbsp;domain</a>
            </li>

            <li v-for="(domain, index) in domains">
                <a href="/index"><i class="fa fa-files-o"></i>&nbsp;{{domain.code}}</a>
            </li>

            <li><a href="javascript:;" @click="getAllTableSpaces()"><i class="fa fa-th-list"></i>&nbsp;table space</a>
            </li>

            <li v-for="(tableSpace, index) in tableSpaces">
                <a href="/index"><i class="fa fa-files-o"></i>&nbsp;{{tableSpace.code}}</a>
            </li>

        </ul>
    </div>
</template>
<style scoped src="../css/dashboard.css">
</style>
<script>
    export default{
        data(){
            return{
                tables:[],
                domains:[],
                tableSpaces:[]
            }
        },
        methods:{
            getAllTables(){
                this.$http.get('/getAll/tables').then(function(res){
                    console.log(res.status);
                    if(res.status == 200){
                       var re = res.body;
                       //console.log('tables:  '+re);
                       this.tables = re;
                    }
                },function(res){
                    alert('请求table失败： '+ res.status);
                });
            },
            getAllDomains(){
                this.$http.get('/getAll/domains').then(function(res){
                    console.log(res.status);
                    if(res.status == 200){
                       var re = res.body;
                       //console.log('domains:  '+re);
                       this.domains = re;
                    }
                },function(res){
                    alert('请求domain失败： '+ res.status);
                });
            },
            getAllTableSpaces(){
                this.$http.get('/getAll/table_spaces').then(function(res){
                    console.log(res.status);
                    console.log(res);
                    if(res.status == 200){
                       var re = res.body;
                       //console.log('tableSpaces:  '+re);
                       this.tableSpaces = re;
                    }
                },function(res){
                    alert('请求table space失败： '+ res.status);
                });
            }
        },
        created(){
            this.getAllTables();
            this.getAllDomains();
            this.getAllTableSpaces();
        },
        components:{

        }
    }



</script>
