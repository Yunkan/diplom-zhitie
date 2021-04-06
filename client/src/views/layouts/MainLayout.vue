<template>
	<div class="container">
		<div class="md-container">
			<Navbar></Navbar>
			<div class="split-container">
				<div class="side-bar">
					<Feels></Feels>
					<UsersRating></UsersRating>
				</div>
				
				<router-view />
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	.split-container {
		display: grid;
		grid-template-columns: 30% 70%;

		.side-bar {
			display: flex;
			flex-direction: column;
			border-right: 2px solid darken(#803F06, 15%);
		}
	}
</style>
<script>
const Navbar = () => import('@/components/Navbar.vue');
const Feels = () => import('@/components/Feels.vue');
const UsersRating = () => import('@/components/UsersRating.vue');

export default {
	components: {
		Navbar, Feels, UsersRating
	}
}
</script>