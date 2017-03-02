import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import frame from './components/Frame.vue';
import tableInfo from './components/TableInfo.vue';
import tableList from './components/TableList.vue';
import dictionaryList from './components/DictionaryList.vue';
import dictionaryInfo from './components/DictionaryInfo.vue';
import domainList from './components/DomainList.vue';
import domainInfo from './components/DomainInfo.vue';
import tableSpaceList from './components/TableSpaceList.vue';
import tableSelect from './components/analysis/TableSelect.vue';


Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);

//routes config
const routes = [
    {path: '/', redirect: '/frame'},
    {path: '/frame', component:frame,
        children:[
            {path:'/tableList', component:tableList, name:'tableList'},
            {path:'/tableInfo', component:tableInfo, name:'tableInfo'},
            {path:'/dictionaryList', component:dictionaryList, name:'dictionaryList'},
            {path:'/dictionaryInfo', component:dictionaryInfo, name:'dictionaryInfo'},
            {path:'/domainList', component:domainList, name:'domainList'},
            {path:'/domainInfo', component:domainInfo, name:'domainInfo'},
            {path:'/tableSpaceList', component:tableSpaceList, name:'tableSpaceList'},
            {path:'/tableSelect', component:tableSelect, name:'tableSelect'},
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




