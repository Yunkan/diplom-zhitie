<template>
	<div class="navbar-container">
		<input type="checkbox" id="navbarToggle">
		<label class="navbarToggle" for="navbarToggle"></label>
		<div class="navbar">
			<router-link class="nav-link" active-class="active" to="/" exact>Главная</router-link>
			<router-link class="nav-link" active-class="active" to="/tavern" exact>Таверна</router-link>
			<PrimaryButton title="Выйти" v-on:click="logout"></PrimaryButton>
		</div>
	</div>
</template>
<style lang="scss">
	#navbarToggle {
		display: none;

		&:checked {
			~ .navbar {
				width: 80%;
			}

			~ .navbarToggle {
				transform: rotateZ(-45deg);

				&:before {
					transform: rotateZ(90deg);
					top: 0;
				}

				&:after {
					top: 0;
				}
			}
		}
	}
	.navbarToggle {
		display: none;
		height: 8px;
		width: 50px;
		background-color: #3F1F03;
		border: none;
		position: relative;
		left: 50%;
		top: 15px;
		transform: translate(-50%, 0);
		transition: .6s;

		&:before,
		&:after {
			content: "";
			height: 8px;
			width: 50px;
			background-color: #3F1F03;
			position: absolute;
			left: 0;
			transition: .6s;
		}

		&:before {
			top: 12px;
		}

		&:after {
			top: 24px;
		}

		@media (max-width: 768px) {
			display: block;
		}

		@media (max-width: 376px) {
			height: 5px;

			&:before,
			&:after {
				height: 5px;
			}
		}
	}

	.navbar {
		display: flex;
		justify-content: center;
		overflow: hidden;
		z-index: 9999;

		@media (max-width: 768px) {
			width: 0%;
			height: auto;
			position: absolute;
			flex-direction: column;
			left: 50%;
			bottom: 25%;
			transform: translate(-50%, 0);
			background-color: #DBA066;
			transition: width .6s;
		}

		.nav-link {
			text-decoration: none;
			margin: 1em;
			padding: 1em;
			background-color: #803F06;
			color: #FCDC06;
			text-align: center;
			border: none;
			outline: none;
			cursor: pointer;
			transition: .2s;

			&.active,
			&:hover {
				background-color: darken(#803F06, 15%);
			}
		}
	}
</style>
<script>
const PrimaryButton = () => import('./PrimaryButton.vue');
export default {
	name: 'Navbar',
	methods: {
		logout() {
			this.$store.commit('removeUser');
			this.$router.push('/login');
		}
	},
	components: {
		PrimaryButton
	}
}
</script>