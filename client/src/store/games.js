import axios from 'axios';

export default {
	actions: {
		async createGame({ commit }, { gameType, creater }) {
			try {
				const game = await axios.post('/api/games/create', { gameType, creater });
				return game.data.game;
			} catch(e) {
				throw e;
			}
		},
		async showGames() {
			try {
				const games = await axios.get('/api/games/show');
				return games.data.games;
			} catch(e) {
				throw e;
			}
		}
	}
}