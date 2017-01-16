import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import frame from './components/Frame.vue';
import tableInfo from './components/TableInfo.vue';
import tableList from './components/TableList.vue';
// import VueEditable from './plugins/vue-editable.js';


Vue.use(VueRouter);
Vue.use(VueResource);


// Vue.use(VueEditable);

//routes config
const routes = [
    {path: '/', redirect: '/frame'},
    {path: '/frame', component:frame,
        children:[
            {path:'/tableList', component:tableList, name:'tableList'},
            {path:'/tableInfo', component:tableInfo, name:'tableInfo'}
        ]
    }
];

//genartor VueRouter object
const router = new VueRouter({
    mode: 'history',
    routes
});

//bind and render
const app = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');




