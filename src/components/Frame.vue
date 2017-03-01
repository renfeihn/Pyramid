<template>
    <div id="Container">
        <div id="Header">

            <div id="logo">
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
        <div class="Clear"></div>
        <div id="Footer"></div>
    </div>


</template>
<script>
    import leftNav from './LeftNav.vue'

    export default{
        data(){
            return {
                db_type: 'oracle',
                options: [
                    {text: 'ORACLE', value: 'oracle'},
                    {text: 'MYSQL', value: 'mysql'}
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
            if (null != db && undefined != db && '' != db && db.length > 0) {
                this.db_type = db;
            } else {
                localStorage.setItem('dbms', this.db_type);
            }
        }
    }
</script>
<style scoped src="../css/dashboard.css"></style>
