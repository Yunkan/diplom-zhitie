<template>
	<div class="games-container">
		<div class="create-game-container">
			<label for="gameType">Игра</label>
			<select v-model="currentGame.gameType" id="gameType">
				<option value="Кулачный бой">Кулачный бой</option>
				<option value="4 в ряд">4 в ряд</option>
			</select>
			<PrimaryButton title="Создать" v-on:click="createGame"></PrimaryButton>
		</div>
		<div class="exist-games-container">
			<div class="game" v-for="game in existGames">
				<h3>Игра: {{ game.gameType }}</h3>
				<p>Создатель: {{ game.creater }}</p>
				<PrimaryButton title="Играть" v-on:click="playGame(game._id)"></PrimaryButton>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	.games-container {
		.create-game-container {
			display: flex;
			flex-direction: column;
			background-color: #643409;
			padding: 1em;
			color: #fff;

			select {
				outline: none;
			}
		}

		.exist-games-container {
			display: flex;
			flex-flow: row wrap;
			justify-content: center;
			margin-top: 1em;

			.game {
				color: #fff;
				background-color: #643409;
				margin: 0 1em 1em 0;
				padding: 1em;
			}
		}
	}
</style>
<script>
const PrimaryButton = () => import('./PrimaryButton.vue');
export default {
	name: 'Games',
	data() {
		return {
			existGames: [],
			currentGame: {
				gameType: 'Кулачный бой'
			}
		}
	},
	async created() {
		this.existGames = await this.$store.dispatch('showGames');
		this.$socket.client.on('refresh games', data => {
			this.existGames.push(data);
		});
		this.$socket.client.on('remove game', data => {
			this.existGames.splice(this.existGames.indexOf(data), 1);
		});
	},
	methods: {
		async createGame() {
			this.currentGame.creater = this.$store.getters.getUser.username;
			const newGame = await this.$store.dispatch('createGame', this.currentGame);

			this.$socket.client.emit('refresh games', newGame);
			this.$router.push(`/game/${newGame._id}`);
		},
		playGame(id) {
			this.$router.push(`/game/${id}`);
		}
	},
	components: {
		PrimaryButton
	}
}
</script>