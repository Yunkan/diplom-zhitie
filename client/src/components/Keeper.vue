<template>
	<div class="keeper-container">
		<div class="container-block">
			<h2>Еда:</h2>
			<div class="btns-block">
				<PrimaryButton title="Хлеб(5 м.)" v-on:click="buyService([
								{ name: 'starve', value: 10 },
								{ name: 'stamina', value: -10 },
								{ name: 'money', value: -5 }
							])"></PrimaryButton>
				<PrimaryButton title="Хлеб с колбасой(8 м.)" v-on:click="buyService([
								{ name: 'starve', value: 25 },
								{ name: 'stamina', value: -10 },
								{ name: 'money', value: -8 }
							])"></PrimaryButton>
				<PrimaryButton title="Курица(20 м.)" v-on:click="buyService([
								{ name: 'starve', value: 40 },
								{ name: 'stamina', value: -10 },
								{ name: 'money', value: -20 },
								{ name: 'rating', value: 1 }
							])"></PrimaryButton>
			</div>
		</div>
		<div class="container-block">
			<h2>Отдых:</h2>
			<div class="btns-block">
				<PrimaryButton title="Сено(5 м.)" v-on:click="buyService([
								{ name: 'starve', value: -5 },
								{ name: 'stamina', value: 10 },
								{ name: 'money', value: -5 }
							])"></PrimaryButton>
				<PrimaryButton title="Кровать(8 м.)" v-on:click="buyService([
								{ name: 'starve', value: -10 },
								{ name: 'stamina', value: 25 },
								{ name: 'money', value: -8 }
							])"></PrimaryButton>
				<PrimaryButton title="Уютная кровать(15 м.)" v-on:click="buyService([
								{ name: 'starve', value: -10 },
								{ name: 'stamina', value: 40 },
								{ name: 'money', value: -15 },
								{ name: 'ratin', value: 1 }
							])"></PrimaryButton>
			</div>
		</div>
		<div class="container-block">
			<h2>Самочувствие:</h2>
			<div class="btns-block">
				<PrimaryButton title="Бинт(5 м.)" v-on:click="buyService([
								{ name: 'starve', value: -2 },
								{ name: 'stamina', value: -2 },
								{ name: 'money', value: -5 },
								{ name: 'health', value: 10 }
							])"></PrimaryButton>
				<PrimaryButton title="Сиропчик(8 м.)" v-on:click="buyService([
								{ name: 'starve', value: -2 },
								{ name: 'stamina', value: -2 },
								{ name: 'money', value: -8 },
								{ name: 'health', value: 20 }
							])"></PrimaryButton>
				<PrimaryButton title="Лекарь(12 м.)" v-on:click="buyService([
								{ name: 'starve', value: -2 },
								{ name: 'stamina', value: -2 },
								{ name: 'money', value: -12 },
								{ name: 'health', value: 40 },
								{ name: 'rating', value: 1 }
							])"></PrimaryButton>
			</div>
		</div>

	</div>
</template>
<style lang="scss">
	.keeper-container {
		width: 100%;
		margin: 0 auto;
		padding: 1em 0;

		h2 {
			border-bottom: 1px solid #59270B;
			@media (max-width: 376px) {
				font-size: 14px;
			}
		}

		.btns-block {
			display: flex;
			justify-content: center;
		}
	}
</style>
<script>
const PrimaryButton = () => import("./PrimaryButton.vue");
export default {
	name: "Keeper",
	data() {
		return {
			user: this.$store.getters.getUser
		}
	},
	methods: {
		async buyService(stats) {
			const cost = stats.find(stat => stat.name === 'money');
			if(this.user.money >= Math.abs(cost.value)) {
				await this.$store.dispatch('userStat', stats);
			}
		}
	},
	components: {
		PrimaryButton
	}
}
</script>