<template>
	<div class="adventure-container">
		<div class="adventure-overflow">
			<div class="adventure-block">
				<div class="adventure-text">{{ text }}</div>
				<div class="adventure-stats">
					<p>Самочувствие: {{ adventure.health }}</p>
					<p>Еда: {{ adventure.starve }}</p>
					<p>Энергия: {{ adventure.stamina }}</p>
					<p>Деньги: {{ adventure.money }}</p>
					<p>Рейтинг: {{ adventure.rating }}</p>
				</div>

				<PrimaryButton class="adventure-btn" title="Понимаю" v-on:click="endAdventure"></PrimaryButton>
			</div>
		</div>
	</div>	
</template>
<style lang="scss">
	.adventure-overflow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .7);

		.adventure-block {
			width: 50%;
			height: 100%;
			margin: 1em auto;
			padding: 1em;
			background-color: #92542F;

			@media (max-width: 768px) {
				font-size: 12px;
			}

			.adventure-text {
				width: 80%;
				padding: 1em;
				margin: 0 auto;
				max-height: 400px;
				overflow: auto;
				text-align: center;
				color: #fff;
			}

			.adventure-btn {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translate(-50%, 0);
			}
		}
	}
</style>
<script>	
import { bus } from '../main.js';
const PrimaryButton = () => import('./PrimaryButton');
export default {
	name: 'Adventure',
	props: ['adventure'],
	data() {
		return {
			text: ''
		}
	},
	async created() {
		function writeText(i) {
			return new Promise((resolve, reject) => {
				setTimeout(() => resolve(i), 25);
			})
		}

		for(let i of this.$props.adventure.text) {
			this.text += await writeText(i);
		}
	},
	methods: {
		endAdventure() {
			bus.$emit('end adventure', this.$props.adventure);
		}
	},
	components: {
		PrimaryButton
	}
}
</script>