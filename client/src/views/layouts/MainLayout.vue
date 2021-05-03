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
			<Footer></Footer>
			<div class="game-over-container" v-if="dead">
				<div class="text-container">
					<h1>Вы умерли!</h1>
					<PrimaryButton title="Понимаю" v-on:click="acceptDeath"></PrimaryButton>
				</div>
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

    .game-over-container {
    	width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;


		.text-container {
			position: absolute;
			padding: 1em 5em;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #B36A3E;
		}
    }
</style>
<script>
import { bus } from '../../main.js';
const Navbar = () => import('@/components/Navbar.vue');
const Feels = () => import('@/components/Feels.vue');
const UsersRating = () => import('@/components/UsersRating.vue');
const Footer = () => import('@/components/Footer.vue');
const PrimaryButton = () => import('@/components/PrimaryButton.vue');

export default {
	data() {
		return {
			dead: false
		}
	},
	created() {
		bus.$on('dead', data => {
			if(data === this.$store.getters.getUser._id) {
				this.dead = true;
			}
		});
	},
	methods: {
		acceptDeath() {
			this.dead = false;
		}
	},
	components: {
		Navbar, Feels, UsersRating, Footer, PrimaryButton
	}
}
</script>