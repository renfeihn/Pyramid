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
                    <router-link class="navbar-brand" to="/">首页</router-link>
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
    components:{
        leftNav,
    }
}
</script>
<style scoped src="../css/dashboard.css">

</style>

