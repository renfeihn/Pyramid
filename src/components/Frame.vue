<template>
    <div id="Container">
        <div id="Header">
            <div>
                <h2 style="margin-left: 8px;">web数据建模及模型管理系统</h2>
                <span id="dbms">
                    <p style="float: left">目标数据库选择：</p>
                    <select @change="dbmsChange();" v-model="db_type">
                        <template v-for="option in options">
                            <option :value="option.value" v-if="option.value == db_type" selected>
                                {{option.text}}
                            </option>
                            <option :value="option.value" v-else>
                                {{option.text}}
                            </option>
                        </template>
                    </select>
                </span>
            </div>
        </div>
        <div id="Content">
            <div id="Content-Left">
                <left-nav></left-nav>
            </div>
            <div id="Content-Main">
                <router-view></router-view>
            </div>
        </div>

    </div>


</template>
<script>
    import leftNav from './LeftNav.vue'

    export default{
        data(){
            return {
                db_type: 'oracle',
                options: [
                    {text: 'MYSQL', value: 'mysql'},
                    {text: 'ORACLE', value: 'oracle'},
                    {text: 'DB2', value: 'db2'}
                ]
            }
        },
        methods: {
            dbmsChange(){
                localStorage.setItem('dbms', this.db_type);
            }
        },
        components: {
            leftNav,
        },
        created(){
            var db = localStorage.getItem('dbms');
            if (!db) {
                this.db_type = db;
            } else {
                localStorage.setItem('dbms', this.db_type);
            }
        }
    }
</script>
<style scoped src="../css/dashboard.css"></style>
