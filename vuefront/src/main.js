import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import loadScript from 'vue-plugin-load-script';
import * as filters from "./util/filter";

Vue.config.productionTip = false;

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
})

new Vue({
    router,
    store,
    vuetify,
    loadScript,
    render: h => h(App)
}).$mount('#app')
