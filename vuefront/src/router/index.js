import Vue from 'vue'
import VueRouter from 'vue-router'
import MultiView from "../views/MultiView.vue";
import StreamView from "../views/StreamView";

Vue.use(VueRouter)

const routes = [
    {
        path: '/MultiView',
        name: 'MultiView',
        component: MultiView
    },
    {
        path: '/StreamView',
        name: 'StreamView',
        component: StreamView
    },
    {
        path : '*',
        redirect : '/MultiView'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;