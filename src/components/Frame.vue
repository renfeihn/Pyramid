<template>
    <div style="padding-top:40px">
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>

                    <select class="navbar-brand" @change="dbmsChange();" v-model="db_type">
                        <template v-for="option in options">
                            <option :value="option.value" v-if="option.value == db_type" selected>
                                {{option.text}}
                            </option>
                            <option :value="option.value" v-else>
                                {{option.text}}
                            </option>
                        </template>
                    </select>
                </div>
            </div>
        </nav>

        <div class="container-fluid float-top">
            <div class="row">
                <div class="col-sm-3 col-md-2 sidebar">
                    <left-nav></left-nav>
                </div>
                <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import leftNav from './LeftNav.vue'

export default{
    data(){
        return{
            db_type:'oracle',
            options: [
              { text: 'ORACLE', value: 'oracle' },
              { text: 'MYSQL', value: 'mysql' }
            ]
        }
    },
    methods:{
        dbmsChange(){
            localStorage.setItem('dbms',this.db_type);
        }
    },
    components:{
        leftNav,
    },
    created(){
        var db = localStorage.getItem('dbms');
        if(null != db && undefined != db && '' != db && db.length > 0){
            this.db_type = db;
        }else{
            localStorage.setItem('dbms',this.db_type);
        }
    }
}
</script>
<style scoped src="../css/dashboard.css"></style>

