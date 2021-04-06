<template>
	<div class="sm-container">	
		<h1>Регистрация</h1>

		<form @submit.prevent="submitHandler">
			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					v-model="email"
					:class="{ invalid: $v.email.$dirty && (!$v.email.required || !$v.email.email) }"
				>
				<small
					class="error-message"
					v-if="$v.email.$dirty && !$v.email.required"
				>Введите Email</small>
				<small
					class="error-message"
					v-else-if="$v.email.$dirty && !$v.email.email"
				>Введите корректный Email</small>
			</div>
			<div class="form-group">
				<label for="username">Имя</label>
				<input
					type="text"
					id="username"
					v-model="username"
					:class="{ invalid: $v.username.$dirty && (!$v.username.required || !$v.username.minLength || !$v.username.maxLength) }"
				>
				<small
					class="error-message"
					v-if="$v.username.$dirty && !$v.username.required"
				>Введите имя</small>
				<small
					class="error-message"
					v-else-if="$v.username.$dirty && !$v.username.minLength"
				>Слишком короткое имя</small>
				<small
					class="error-message"
					v-else-if="$v.username.$dirty && !$v.username.maxLength"
				>Слишком длинное имя</small>
			</div>
			<div class="form-group">
				<label for="password">Пароль</label>
				<input
					type="password"
					id="password"
					v-model="password"
					:class="{ invalid: $v.password.$dirty && (!$v.password.required || !$v.password.minLength) }"
				>
				<small
					class="error-message"
					v-if="$v.password.$dirty && !$v.password.required"
				>Введите пароль</small>
				<small
					class="error-message"
					v-else-if="$v.password.$dirty && !$v.password.minLength"
				>Слишком короткий пароль</small>
			</div>

			<button type="submit">Отправить</button>
			<router-link class="link" to="/login">Уже есть аккаунт?</router-link>
			<div class="error-message">
				{{ error }}
			</div>
		</form>
	</div>
</template>
<script>
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';

export default {
	data() {
		return {
			email: '',
			username: '',
			password: '',
			error: ''
		}
	},
	validations: {
		email: {
			required,
			email
		},
		username: {
			required,
			minLength: minLength(4),
			maxLength: maxLength(10)
		},
		password: {
			required,
			minLength: minLength(6)
		}
	},
	methods: {
		async submitHandler() {
			if(this.$v.$invalid) {
				this.$v.$touch();
				return;
			}

			const formData = {
				email: this.email,
				username: this.username,
				password: this.password
			}

			try {
				await this.$store.dispatch('register', formData);
				this.$router.push('/login');
			} catch(e) {
				this.error = e.response.data.message;
			}
		}
	}
}
</script>