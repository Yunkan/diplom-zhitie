import axios from 'axios';
import Vue from 'vue';
import { bus } from '../main.js';

export default {
	actions: {
		async userStat({ commit }, stats) {
			try {
				let user = await axios.post('/api/userStats/update', { userId: this.getters.getUser._id, stats });

				if(user.data.user.health <= 0) {
					user = await axios.get(`api/userStats/reborne/${this.getters.getUser._id}`);
					bus.$emit('dead', this.getters.getUser._id);
				}
				commit('setUser', user.data.user);
				bus.$emit('refresh feels', this.getters.getUser);
			} catch(e) {
				throw e;
			}
		},
		async showAllUsers({ commit }, limit) {
			try {
				if(!limit)
					limit = 0;
				const users = await axios.get(`/api/userStats/showAllUsers/${limit}`);
				return users.data.users;
			} catch(e) {
				throw e;
			}
		},
		async changeRole({ commit }, { id, role }) {
			try {
				await axios.post('/api/userStats/changeRole', { id, role });
			} catch(e) {
				throw e;
			}
		}
	}
}