<template>
	<div class="game-container">
		<div v-if="game.gameType === 'Кулачный бой' && users.length === 2">
			<FistFight :initialUsers="users"></FistFight>
		</div>
		<div v-else-if="game.gameType === '4 в ряд' && users.length === 2">
			<ConnectFour :initialUsers="users"></ConnectFour>
		</div>
		<div v-else>
			<h1>Ну, подождём...</h1>
		</div>
		
		<div class="result-modal" v-if="result.title">
			<div class="modal">
				<h1>{{ result.title }}</h1>
				<div v-for="stat in result.stats">{{ statTranslate(stat.name) }}: {{ stat.value }}</div>
				<PrimaryButton title="Понимаю" v-on:click="goBack"></PrimaryButton>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	.result-modal {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;

		.modal {
			background-color: #AB663C;
			color: #fff;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 1em;
		}
	}
</style>
<script>
import { bus } from '../main.js';
const FistFight = () => import('../components/games/FistFight.vue');
const ConnectFour = () => import('../components/games/ConnectFour.vue');
const PrimaryButton = () => import('../components/PrimaryButton.vue');
export default {
	data() {
		const id = this.$route.params.id;
		return {
			game: {
				_id: id
			},
			users: [],
			result: {
				title: '',
				stats: []
			}
		}
	},
	created() {
		this.$socket.client.emit('user join', { user: this.$store.getters.getUser, game: this.game });
		this.$socket.client.on('refresh user', data => {
			this.users = data.users;
			this.game = data.game;
		});

		bus.$on('game end', async data => {
			this.result.title = data.title;
			this.result.stats = data.stats;

			await this.$store.dispatch('userStat', this.result.stats);
		});
	},
	destroyed() {
		this.$socket.client.emit('user leave', this.$store.getters.getUser);
	},
	methods: {
		goBack() {
			this.$router.push('/tavern');
		},
		statTranslate(stat) {
			switch(stat) {
				case 'health':
					return 'Самочувствие';
				case 'stamina':
					return 'Энергия';
				case 'starve':
					return 'Еда';
				case 'rating':
					return 'Рейтинг';
				case 'money':
					return 'Деньги';
			}
		}
	},
	 components: {
	 	FistFight, PrimaryButton, ConnectFour
	 }
}
</script>