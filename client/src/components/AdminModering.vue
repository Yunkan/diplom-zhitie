<template>
	<div class="admin-modering-container">
		<div class="user" v-for="user in users">
			<span class="user-name">Имя: {{ user.username }},</span>
			<span class="user-role">
				Роль: <select class="user-role" v-model="user.changedRole">
					<option v-for="role in roles">{{ role }}</option>
				</select>
			</span>
			<PrimaryButton title="Сохранить" v-on:click="saveUser(user._id, user.changedRole)"></PrimaryButton>
		</div>
	</div>
</template>
<style lang="scss">
	.admin-modering-container {
		width: 100%;
		padding: 1em;
		background-color: #fff;
		max-height: 400px;
		overflow: auto;

		.user {
			margin: 1em;
			border-bottom: 1px solid #582E08;

			button {
				font-size: 10px;
			}

			select {
				outline: none;
			}
		}
	}
</style>
<script>
const PrimaryButton = () => import('./PrimaryButton.vue');
export default {
	name: 'AdminModering',
	data() {
		return {
			users: [],
			roles: [
				'admin',
				'user',
				'banned'
			]
		}
	},
	async created() {
		this.users = await this.$store.dispatch('showAllUsers');
		this.users.forEach(user => user.changedRole = user.role);
	},
	methods: {
		async saveUser(id, role) {
			await this.$store.dispatch('changeRole', { id, role });
			this.$socket.client.emit('refresh user', this.users.find(user => user._id === id));
		}
	},
	components: {
		PrimaryButton
	}
}
</script>