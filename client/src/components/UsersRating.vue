<template>
	<div class="rating-container">
		<h2>Список лучших:</h2>
		<div class="user" v-for="(user, index) in users">
			{{ index + 1 }}. {{ user.username }} - {{ user.rating }}
		</div>
	</div>
</template>
<style lang="scss">
	.rating-container {
		display: flex;
		flex-flow: column wrap;
		align-items: center;
		user-select: none;

		@media (max-width: 768px) {
			h2 {
				font-size: 16px;
			}

			.user {
				font-size: 12px;
			}
		}

		@media (max-width: 376px) {
			h2 {
				font-size: 12px;
			}

			.user {
				font-size: 8px;
			}
		}

		.user {
			margin-top: 1em;
		}
	}
</style>
<script>
export default {
	name: 'UsersRating',
	data() {
		return {
			users: null
		}
	},
	async created() {
		this.users = await this.$store.dispatch('showAllUsers');
	}
}
</script>