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
					{ name: 'rating', value: 5 }
				])"></PrimaryButton>
				<PrimaryButton title="Жаренная свинина(35 м.)" v-on:click="buyService([
					{ name: 'starve', value: 60 },
					{ name: 'stamina', value: -10 },
					{ name: 'money', value: -35 },
					{ name: 'rating', value: 10 }
				])"></PrimaryButton>
				<PrimaryButton title="Роскошный стол(60 м.)" v-on:click="buyService([
					{ name: 'starve', value: 100 },
					{ name: 'stamina', value: -15 },
					{ name: 'money', value: -60 },
					{ name: 'rating', value: 15 }
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
					{ name: 'rating', value: 5 }
				])"></PrimaryButton>
				<PrimaryButton title="Кровать и ванна(30 м.)" v-on:click="buyService([
					{ name: 'starve', value: -10 },
					{ name: 'stamina', value: 60 },
					{ name: 'money', value: -30 },
					{ name: 'rating', value: 10 }
				])"></PrimaryButton>
				<PrimaryButton title="Целая комната(65 м.)" v-on:click="buyService([
					{ name: 'starve', value: -10 },
					{ name: 'stamina', value: 100 },
					{ name: 'money', value: -65 },
					{ name: 'rating', value: 15 }
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
				<PrimaryButton title="Травник(12 м.)" v-on:click="buyService([
					{ name: 'starve', value: -2 },
					{ name: 'stamina', value: -2 },
					{ name: 'money', value: -12 },
					{ name: 'health', value: 40 },
					{ name: 'rating', value: 5 }
				])"></PrimaryButton>
				<PrimaryButton title="Врач(28 м.)" v-on:click="buyService([
					{ name: 'starve', value: -2 },
					{ name: 'stamina', value: -2 },
					{ name: 'money', value: -28 },
					{ name: 'health', value: 60 },
					{ name: 'rating', value: 10 }
				])"></PrimaryButton>
				<PrimaryButton title="Лечебные процедуры(50 м.)" v-on:click="buyService([
					{ name: 'starve', value: -2 },
					{ name: 'stamina', value: 10 },
					{ name: 'money', value: -50 },
					{ name: 'health', value: 100 },
					{ name: 'rating', value: 15 }
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
			flex-flow: row wrap;
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