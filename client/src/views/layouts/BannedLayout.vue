<template>
	<div class="banned-container">
		<h1>Ты забанен!</h1>
		<PrimaryButton title="Выйти" v-on:click="logout"></PrimaryButton>
	</div>
</template>
<style lang="scss">
	.banned-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 50%;
		height: 50vh;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1em;
	    background-color: #148BF0;
	    color: #f00;
	}
</style>
<script>
const PrimaryButton = () => import('@/components/PrimaryButton');
export default {
    components: {
    	PrimaryButton
    },
    methods: {
    	async logout() {
    		await this.$store.dispatch('logout');
			this.$router.push('/login');
    	}
    }
}
</script>