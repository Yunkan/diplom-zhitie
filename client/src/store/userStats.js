import axios from 'axios';
import Vue from 'vue';

export default {
	actions: {
		async userStat({ commit }, stats) {
			try {
				let user = await axios.post('/api/userStats/update', { userId: this.getters.getUser._id, stats });

				if(user.data.user.health <= 0) {
					user = await axios.get(`api/userStats/reborne/${this.getters.getUser._id}`); 
					const gameOver = document.createElement('div');
					gameOver.classList.add('game-over-container');
					gameOver.addEventListener('click', () => {
						gameOver.remove();
					});
					gameOver.innerHTML = `\
							<h1>Вы умерли!</h1>\
							<button class="primary-button">Понимаю</button>\
						`;
					document.querySelector('.split-container').appendChild(gameOver);
				}
				commit('setUser', user.data.user);
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