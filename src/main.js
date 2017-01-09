import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import frame from './components/Frame.vue';
import index from './components/Index.vue';
import tableList from './components/TableList.vue';


Vue.use(VueRouter);
Vue.use(VueResource);

//routes config
const routes = [
    {path: '/', redirect: '/frame'},
    {path: '/frame', component:frame,
        children:[
            {path:'/index', component:index, name:'index'},
            {path:'/tableList', component:tableList, name:'tableList'}
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




