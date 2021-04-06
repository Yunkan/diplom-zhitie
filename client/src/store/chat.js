import axios from 'axios';

export default {
	actions: {
		async sendMessage({ commit }, { userId, username, text, date }) {
			try {
				await axios.post('/api/chat/send', { userId, username, text, date });
			} catch(e) {
				throw e;
			}
		},
		async showMessages({ commit }) {
			try {
				const messages = await axios.get('/api/chat/show');
				await commit('setMessages', messages.data.messages);
			} catch(e) {
				throw e;
			}
		}
	}
}