<template>
	<div class="md-container">
		<h1>
			Меня зовут "{{ user.username }}"
		</h1>

		<div class="status-bar" :style="{ color: status.color }">{{ status.text }}</div>

		<div class="main-actions">
			<PrimaryButton title="Начать приключение(100 м.)" v-on:click="startAdventure"></PrimaryButton>
			<PrimaryButton title="Стырить яблоки" v-on:click="stealApples"></PrimaryButton>
			<PrimaryButton title="Спать на земле" v-on:click="freeService([
				{ name: 'stamina', value: 10 },
				{ name: 'starve', value: -5 },
				{ name: 'rating', value: -1 }
			])"></PrimaryButton>
			<PrimaryButton title="Подорожник" v-on:click="freeService([
				{ name: 'health', value: 10 },
				{ name: 'starve', value: -5 },
				{ name: 'stamina', value: -5 },
				{ name: 'rating', value: -1 }
			])"></PrimaryButton>
			<PrimaryButton title="Просить милостыни" v-on:click="freeWork"></PrimaryButton>
		</div>

		<Adventure v-if="adventure" :adventure="this.adventure"></Adventure>

		<AdminPanel v-if="user.role === 'admin'"></AdminPanel>
	</div>
</template>
<style lang="scss">
	h1 {
		@media (max-width: 376px) {
			font-size: 18px;
		}
	}

	.main-actions {
		@media (max-width: 376px) {
			button {
				font-size: 12px;
			}
		}
	}

	.main-actions {
		display: flex;
		flex-direction: column;
	}

	.status-bar {
		text-align: center;
		font-size: 20px;
	}
</style>
<script>
import { bus } from '../main.js';
const AdminPanel = () => import('../components/AdminPanel');
const PrimaryButton = () => import('../components/PrimaryButton');
const Adventure = () => import('../components/Adventure');
export default {
	data() {
		return {
			user: this.$store.getters.getUser,
			adventure: null,
			status: {
				text: '',
				color: ''
			}
		}
	},
	created() {
		bus.$on('end adventure', (adventure) => {
			this.adventure = null;
		});
	},
	methods: {
		async startAdventure() {
			if(this.$store.getters.getUser.money >= 100) {
				await this.$store.dispatch('userStat', [{ name: 'money', value: -100 }]);
				this.adventure = await this.$store.dispatch('showAdventure');
			}
		},
		async freeService(stats) {
			await this.$store.dispatch('userStat', stats);
		},
		async stealApples() {
			if(~~(Math.random() * 100) <= 75) {
				this.status.text = 'Успех!';
				this.status.color = '#0f0';
				await this.$store.dispatch('userStat', [
					{ name: 'starve', value: 10 },
					{ name: 'stamina', value: -3 },
					{ name: 'rating', value: -1 },
				]);
			} else {
				this.status.text = 'Тебя поймали!';
				this.status.color = '#f00';
				await this.$store.dispatch('userStat', [
					{ name: 'starve', value: -3 },
					{ name: 'stamina', value: -3 },
					{ name: 'rating', value: -1 },
					{ name: 'health', value: -3 },
				]);
			}

			setTimeout(() => this.status.text = '', 5000);
		},
		async freeWork() {
			if(~~(Math.random() * 100) <= 75) {
				this.status.text = 'Успех!';
				this.status.color = '#0f0';
				await this.$store.dispatch('userStat', [
					{ name: 'money', value: 1 },
					{ name: 'starve', value: -2 },
					{ name: 'stamina', value: -2 },
					{ name: 'rating', value: -1 },
				]);
			} else {
				this.status.text = 'Тебя прогнали!';
				this.status.color = '#f00';
				await this.$store.dispatch('userStat', [
					{ name: 'starve', value: -2 },
					{ name: 'stamina', value: -2 },
					{ name: 'rating', value: -1 },
				]);
			}

			setTimeout(() => this.status.text = '', 5000);
		}
	},
	components: {
		AdminPanel, PrimaryButton, Adventure
	}
}
</script>