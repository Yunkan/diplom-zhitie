<template>
	<div class="chat-container">
		<div class="chat-messages">
			<div :class="{
					'chat-messages-mine': $store.getters.getUser._id === message.userId,
			 		'chat-messages-stranger': $store.getters.getUser._id !== message.userId
			 	}"
			 	v-for="message in messages">
				<div class="chat-messages-name">{{ message.username }}:</div>
				<div class="chat-messages-text">{{ message.text }}</div>
				<div class="chat-messages-time">{{ message.date }}</div>
			</div>
		</div>
		<div class="chat-interface">
			<textarea class="chat-interface-text" v-model="text"></textarea>
			<PrimaryButton title="Сообщить" v-on:click="sendMessage"></PrimaryButton>
		</div>
	</div>
</template>
<style lang="scss">
	.chat {
		&-container {
			padding: 1em 0;
			border-left: none;
		}

		&-messages {
			min-height: 600px;
			max-height: 600px;
			overflow: auto;
			padding: 0 .5em;
			background-color: #451705;
			color: #fff;
			margin-bottom: 1em;

			&-stranger,
			&-mine {
				display: grid;
				grid-template-columns: 10% 80% 10%;
				grid-auto-rows: 100px;
				grid-gap: 1em 0;
				justify-items: center;
				align-items: center;
				padding: 0 1em;
				color: #969494;
				border-bottom: 1px solid #fff;

				@media (max-width: 768px) {
					grid-template-columns: 20% 70% 10%;
					font-size: 12px;
				}

				@media (max-width: 376px) {
					font-size: 8px;
					grid-auto-rows: 75px;					
					grid-template-columns: 30% 60% 10%;
				}
			}

			&-mine {
				color: #fff;
			}

			&-text {
				width: 100%;
				word-wrap: break-word;
				margin-left: 1em;
			}
		}

		&-interface {
			display: flex;
			justify-content: center;

			@media (max-width: 376px) {
				flex-direction: column;
			}

			&-text {
				width: 100%;
				background-color: #451705;
				outline: none;
				border: none;
				padding: 1em 1em;
				resize: none;
				color: #fff;

				@media (max-width: 768px) {
					font-size: 12px;
				}

				@media (max-width: 376px) {
					font-size: 8px;
				}
			}
		}
	}
</style>
<script>
const PrimaryButton = () => import('./PrimaryButton.vue');
export default {
	name: 'Chat',
	data() {
		return {
			messages: [],
			text: ''
		}
	},
	async created() {
		await this.$store.dispatch('showMessages');
		this.messages = this.$store.getters.getMessages;
		this.$socket.client.on('send message', data => {
			this.messages.push(data);
		});
	},
	methods: {
		sendMessage() {
			if(!this.text.match(/<[^<>]+>/g)) {
				const messageData = {
					userId: this.$store.getters.getUser._id,
					username: this.$store.getters.getUser.username,
					text: this.text,
					date: `${new Date().getHours()}:${new Date().getMinutes()}`
				}

				this.messages.push(messageData);

				this.$store.dispatch('sendMessage', messageData);
				this.$socket.client.emit('send message', messageData);
			}

			this.text = '';
		}
	},
	components: {
		PrimaryButton
	}
}
</script>