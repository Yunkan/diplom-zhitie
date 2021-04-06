import Vue from 'vue';
import Vuex from 'vuex';
import VueCookies from 'vue-cookies';
import auth from './auth';
import chat from './chat';
import userStats from './userStats';
import adventure from './adventure';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: VueCookies.get('user'),
		messages: null
	},
	mutations: {
		setUser(state, user) {
			VueCookies.set('user', user);
			state.user = VueCookies.get('user');
		},
		setMessages(state, messages) {
			state.messages = messages;
		},
		removeUser(state) {
			state.user = null;
			VueCookies.remove('user');
		}
	},
	actions: {
	},
	getters: {
		getUser: state => state.user,
		getMessages: state => state.messages
	},
	modules: {
		auth, chat, userStats, adventure
	}
});
