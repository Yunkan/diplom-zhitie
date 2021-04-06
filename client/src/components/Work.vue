<template>
	<div class="work-container">
		<PrimaryButton title="Уборка" v-on:click="setWorkType('Cleaning')"></PrimaryButton>
		<PrimaryButton title="Сортировка" v-on:click="setWorkType('Sorting')"></PrimaryButton>

		<div class="work-overlay" v-if="working">
			<Cleaning v-if="workType === 'Cleaning'"></Cleaning>
			<Sorting v-else-if="workType === 'Sorting'"></Sorting>
			<PrimaryButton title="Закончить" v-on:click="closeWork"></PrimaryButton>
		</div>
	</div>
</template>
<style lang="scss">
	.work-container {
		display: flex;
		justify-content: space-around;

		.work-overlay {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background-color: rgba(0, 0, 0, .5);
		}
	}
</style>
<script>
const PrimaryButton = () => import('./PrimaryButton.vue');
const Cleaning = () => import('./works/Cleaning.vue');
const Sorting = () => import('./works/Sorting.vue');
export default {
	name: 'Work',
	data() {
		return {
			working: false,
			workType: ''
		}
	},
	methods: {
		setWorkType(type) {
			this.working = true;
			this.workType = type;
		},
		closeWork() {
			this.working = false;
			this.workType = '';
		}
	},
	components: {
		PrimaryButton, Cleaning, Sorting
	}
}
</script>