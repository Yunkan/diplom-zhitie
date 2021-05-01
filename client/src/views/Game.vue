<template>
	<div class="game-container">
		<FistFight v-if="game.gameType === 'Кулачный бой' && users.length === 2" :initialUsers="users"></FistFight>

		<div class="result-modal" v-if="result.title">
			<div class="modal-overlay">
				<div class="modal">
					<h1>{{ result.title }}</h1>
					<div v-for="stat in result.stats">{{ statTranslate(stat.name) }}: {{ stat.value }}</div>
					<PrimaryButton title="Понимаю" v-on:click="goHome"></PrimaryButton>
				</div>
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

		.modal-overlay {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .5);

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
	}
</style>
<script>
import { bus } from '../main.js';
const FistFight = () => import('../components/games/FistFight.vue');
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

		bus.$on('fistFight end', async data => {
			this.result.title = data.title;
			this.result.stats = data.stats;

			await this.$store.dispatch('userStat', this.result.stats);
		});
	},
	destroyed() {
		this.$socket.client.emit('user leave', this.$store.getters.getUser);
	},
	methods: {
		goHome() {
			this.$router.push('/');
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
	 	FistFight, PrimaryButton
	 }
}
</script>