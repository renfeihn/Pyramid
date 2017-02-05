<template>
    <div>
        <ul class="nav nav-sidebar">

            <li><a href="#" ><i class="fa fa-chevron-down"></i>&nbsp;Ensemble</a></li>
            <li><a href="/tableList?module=Ensemble" style="margin-left:15px;"><i class="fa fa-th-list"></i>&nbsp;tables</a></li>

            <li><a href="#" ><i class="fa fa-chevron-down"></i>&nbsp;Limarket</a></li>
            <li><a href="/tableList?module=Limarket" style="margin-left:15px;"><i class="fa fa-th-list"></i>&nbsp;tables</a></li>

            <li><a href="#" ><i class="fa fa-chevron-down"></i>&nbsp;Accounting</a></li>
            <li><a href="/tableList?module=Accounting" style="margin-left:15px;"><i class="fa fa-th-list"></i>&nbsp;tables</a></li>

            <!--<li v-for="(table, index) in tables">-->
                <!--<router-link :to="{path:'/tableInfo', query:{tableCode:table.name}}"> {{table.name}}</router-link>-->
            <!--</li>-->

            <li><a href="/domainList" ><i class="fa fa-th-list"></i>&nbsp;domain</a> </li>

            <!--<li v-for="(domain, index) in domains">-->
                <!--<a href="/"><i class="fa fa-files-o"></i>&nbsp;{{domain.code}}</a>-->
            <!--</li>-->

            <li><a href="/tableSpaceList"><i class="fa fa-th-list"></i>&nbsp;table space</a></li>

            <!--<li v-for="(tableSpace, index) in tableSpaces">-->
                <!--<a href="/"><i class="fa fa-files-o"></i>&nbsp;{{tableSpace.code}}</a>-->
            <!--</li>-->

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
                    if(res.status == 200){
                       var re = res.body;
                       this.tables = re;
                    }
                },function(res){
                    alert('LeftNav 页面 请求table失败： '+ res.status);
                });
            },
            getAllDomains(){
                this.$http.get('/getAll/domains').then(function(res){
                    if(res.status == 200){
                       var re = res.body;
                       this.domains = re;
                    }
                },function(res){
                    alert('LeftNav 页面 请求domain失败： '+ res.status);
                });
            },
            getAllTableSpaces(){
                this.$http.get('/getAll/table_spaces').then(function(res){
                    if(res.status == 200){
                       var re = res.body;
                       //console.log('tableSpaces:  '+re);
                       this.tableSpaces = re;
                    }
                },function(res){
                    alert('LeftNav 页面 请求table space失败： '+ res.status);
                });
            }
        },
        created(){
            //this.getAllTables();
            //this.getAllDomains();
            //this.getAllTableSpaces();
        },
        components:{

        }
    }



</script>
