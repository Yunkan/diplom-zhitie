import axios from 'axios';

export default {
	actions: {
		async createAdventure({ commit }, { _id, text, health, starve, stamina, money, rating }) {
			try {
				const adventure = await axios.post('/api/adventure/create', { _id, text, health, starve, stamina, money, rating });
				return adventure.data.adventure;
			} catch(e) {
				throw e;
			}
		},
		async showAdventuresList({ commit }) {
			try {
				const adventuresList = await axios.get('/api/adventure/showAdventuresList');
				return adventuresList.data.adventuresList;
			} catch(e) {
				throw e;
			}
		},
		async deleteAdventure({ commit }, { _id, text, health, starve, stamina, money, rating }) {
			try {
				await axios.post('/api/adventure/delete', { _id, text, health, starve, stamina, money, rating });
			} catch(e) {
				throw e;
			}
		},
		async showAdventure({ commit }) {
			try {
				const adventure = await axios.get('/api/adventure/show');
				return adventure.data.adventure;
			} catch(e) {
				throw e;
			}
		}
	}
}