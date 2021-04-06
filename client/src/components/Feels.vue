<template>
	<div class="stats-container">
		<h2>Ощущения:</h2>
		<div class="stat">Самочувствие: {{ user.health }}</div>
		<div class="stat">Еда: {{ user.starve }}</div>
		<div class="stat">Энергия: {{ user.stamina }}</div>
		<div class="stat">Деньги: {{ user.money }}м.</div>
		<div class="stat">Рейтинг: {{ user.rating }}</div>
	</div>
</template>
<style lang="scss">
	.stats-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		@media (max-width: 768px) {
			h2 {
				font-size: 16px;
			}

			.stat {
				font-size: 12px;
			}
		}

		@media (max-width: 376px) {
			h2 {
				font-size: 12px;
			}

			.stat {
				font-size: 8px;
			}
		}

		.stat {
			padding: .5em 1em;
		}
	}
</style>
<script>
import { bus } from '../main.js';
export default {
	name: 'Feels',
	data() {
		return {
			user: this.$store.getters.getUser
		}
	},
	created() {
		bus.$on('refresh feels', data => {
			this.user = data;
		});
	}
}
</script>