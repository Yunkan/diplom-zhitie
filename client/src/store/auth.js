import axios from 'axios';

export default {
	actions: {
		async register({ commit }, { email, username, password }) {
			try {
				await axios.post('/api/auth/register', { email, username, password });
			} catch(e) {
				throw e;
			}
		},
		async login({ commit }, { username, password }) {
			try {
				const user = await axios.post('/api/auth/login', { username, password });
				commit('setUser', user.data.user);
			} catch(e) {
				throw e;
			}
		}
	}
}