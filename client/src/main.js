import Vue from 'vue';
import Vuelidate from 'vuelidate';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSocketIOExt from 'vue-socket.io-extended';
import VueCookies from 'vue-cookies';
import { io } from 'socket.io-client';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(VueAxios, axios);
Vue.use(VueCookies);

const socket = io('http://localhost:5000');

Vue.use(VueSocketIOExt, socket);

export const bus = new Vue();

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
