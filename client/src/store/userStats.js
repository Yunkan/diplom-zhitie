import axios from 'axios';

export default {
	actions: {
		async userStat({ commit }, stats) {
			try {
				const user = await axios.post('/api/userStats/update', { userId: this.getters.getUser._id, stats });
				commit('setUser', user.data.user);
			} catch(e) {
				throw e;
			}
		},
		async showAllUsers() {
			try {
				const users = await axios.get('/api/userStats/showAllUsers');
				return users.data.users;
			} catch(e) {
				throw e;
			}
		}
	}
}