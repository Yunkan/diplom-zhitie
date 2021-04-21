<template>
	<div class="admin-panel">
			<h2>Статистика:</h2>
			<div class="player-stats">
				<PrimaryButton title="Полное самочувствие" v-on:click="addStat([{ name: 'health', value: 100 }])"></PrimaryButton>
				<PrimaryButton title="Полная еда" v-on:click="addStat([{ name: 'starve', value: 100 }])"></PrimaryButton>
				<PrimaryButton title="Полная энергия" v-on:click="addStat([{ name: 'stamina', value: 100 }])"></PrimaryButton>
				<PrimaryButton title="+100 монет" v-on:click="addStat([{ name: 'money', value: 100 }])"></PrimaryButton>
				<PrimaryButton title="+100 рейтинга" v-on:click="addStat([{ name: 'rating', value: 100 }])"></PrimaryButton>
				<PrimaryButton title="Сбросить деньги" v-on:click="addStat([{ name: 'money', value: -user.money }])"></PrimaryButton>
				<PrimaryButton title="Сбросить рейтинг" v-on:click="addStat([{ name: 'rating', value: -user.rating }])"></PrimaryButton>
			</div>
			<AdminAdventures></AdminAdventures>
		</div>
</template>
<style lang="scss">
	.admin-panel {
		padding: 1em;
		margin-top: 1em;

		@media (max-width: 376px) {
			h2 {
				font-size: 16px;
			}
		}

		.player-stats {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			border-bottom: 1px solid #451B07;
		}
	}
</style>
<script>
import { bus } from '../main.js';
const PrimaryButton = () => import('./PrimaryButton.vue');
const AdminAdventures = () => import('./AdminAdventures.vue');
export default {
	name: 'AdminPanel',
	methods: {
		async addStat(stats) {
			await this.$store.dispatch('userStat', stats);
			bus.$emit('refresh feels', this.$store.getters.getUser);
		}
	},
	components: {
		PrimaryButton, AdminAdventures
	}
}
</script>