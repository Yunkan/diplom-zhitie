<template>
	<div class="fistFight-container">
		<div class="user-container">
			<div class="user">
				<p>{{ $store.getters.getUser._id === users[0]._id ? users[0].username : users[1].username }}</p>
				<p>Дыхалка: {{ $store.getters.getUser._id === users[0]._id ? users[0].breath : users[1].breath }}</p>
			</div>
			<div class="user">
				<p>{{ $store.getters.getUser._id === users[0]._id ? users[1].username : users[0].username }}</p>
				<p>Дыхалка: {{ $store.getters.getUser._id === users[0]._id ? users[1].breath : users[0].breath }}</p>
			</div>
		</div>

		<div class="fistFight-info">{{ game.info }}</div>

		<div class="fistFight-interface">
			<PrimaryButton title="Втащить в тело" v-on:click="hitInBody"></PrimaryButton>
			<PrimaryButton title="Втащить в голову" v-on:click="hitInHead"></PrimaryButton>
			<PrimaryButton title="Защитить тело" v-on:click="defBodyTarget('body')"></PrimaryButton>
			<PrimaryButton title="Защитить голову" v-on:click="defBodyTarget('head')"></PrimaryButton>
		</div>
	</div>
</template>
<style lang="scss">
	.fistFight-container {
		padding: 1em;

		.user-container {
			display: flex;
			justify-content: space-between;

			.user {
				margin: 1em;
			}
		}

		&-interface {
			display: flex;
			flex-flow: row wrap;
		}

		&-info {
			padding: 1em;
		}
	}
</style>
<script>
import { bus } from '../../main.js';
const PrimaryButton = () => import('../PrimaryButton.vue');
export default {
	name: 'FistFight',
	props: ['initialUsers'],
	data() {
		return {
			users: {
				...this.initialUsers,
				def: ''
			},
			game: {
				info: '',
				turn: this.initialUsers[0]._id
			}
		}
	},
	created() {
		this.$socket.client.on('technical defeat', data => {
			let stats = [];
			let title = '';
			if(data.user._id === this.$store.getters.getUser._id) {
				stats = [
					{ name: 'health', value: -5 },
					{ name: 'stamina', value: -10 },
					{ name: 'starve', value: -10 },
					{ name: 'rating', value: -10 }
				];
				title = 'Поражение!';
			} else {
				stats = [
					{ name: 'health', value: -5 },
					{ name: 'stamina', value: -10 },
					{ name: 'starve', value: -10 },
					{ name: 'rating', value: 10 },
					{ name: 'money', value: 20 }
				];
				title = 'Противник бежал!!';
			}
			bus.$emit('fistFight end', { stats, title });
		});
		this.$socket.client.emit('fistFight start', this.$store.getters.getUser);
		this.$socket.client.on('fistFight refresh', data => {
			this.users = data.users;
			if(data.game)
				this.game = data.game;
		});
		this.$socket.client.on('fistFight end', data => {
			let stats = [];
			let title = '';
			if(data.winner._id === this.$store.getters.getUser._id) {
				stats = [
					{ name: 'health', value: -5 },
					{ name: 'stamina', value: -10 },
					{ name: 'starve', value: -10 },
					{ name: 'rating', value: 10 },
					{ name: 'money', value: 20 }
				];
				title = 'Победа!';
			} else {
				stats = [
					{ name: 'health', value: -10 },
					{ name: 'stamina', value: -15 },
					{ name: 'starve', value: -15 },
					{ name: 'rating', value: -10 },
					{ name: 'money', value: 10 }
				];
				title = 'Поражение!';
			}

			bus.$emit('fistFight end', { stats, title });
		});
	},
	methods: {
		myTurn() {
			return (this.$store.getters.getUser._id === this.game.turn);
		},
		hitInBody() {
			if(this.myTurn()) {
				this.$socket.client.emit('fistFight hitInBody', this.$store.getters.getUser);
			}
		},
		hitInHead() {
			if(this.myTurn()) {
				this.$socket.client.emit('fistFight hitInHead', this.$store.getters.getUser);
			}
		},
		defBodyTarget(target) {
			if(this.myTurn()) {
				this.$socket.client.emit('fistFight defBodyTarget', { user: this.$store.getters.getUser, target });
			}
		}
	},
	 components: {
	 	PrimaryButton
	 }
}
</script>