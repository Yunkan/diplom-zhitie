import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index.js'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: {
            layout: 'main'
        },
        component: () => import('../views/Home.vue')
    },
    {
    	path: '/login',
    	name: 'Login',
        meta: {
            layout: 'empty'
        },
    	component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        meta: {
            layout: 'empty'
        },
        component: () => import('../views/Register.vue')
    },
    {
        path: '/tavern',
        name: 'Tavern',
        meta: {
            layout: 'main'
        },
        component: () => import('../views/Tavern.vue')
    },
    {
        path: '/game',
        name: 'Game',
        meta: {
            layout: 'main'
        },
        component: () => import('../views/Game.vue')
    },
    {
        path: "*",
        meta: {
            layout: 'main'
        },
        component: () => import('../views/PageNotFound.vue')
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    if ((to.name === 'Home' || to.name === 'Tavern' || to.name === 'Game') && !store.getters.getUser) next({ name: 'Login' })
    else next();
});

export default router;
