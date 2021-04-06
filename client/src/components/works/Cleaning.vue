<template>
	<div class="mini-game-container">
		<canvas id="cnv"></canvas>
		<PrimaryButton title="Дальше" v-on:click="nextClean"></PrimaryButton>
		<h1 class="mini-game-result">{{ cleaningResult }}</h1>
	</div>
</template>
<style lang="scss">
	#cnv {
		position: absolute;
		top: 50%;
		left: 25%;
		transform: translate(0, -50%);

		@media (max-width: 768px) {
			left: 5%;
		}
	}
</style>
<script>
import { bus } from '../../main.js';
const PrimaryButton = () => import('../PrimaryButton.vue');
export default {
	name: 'Cleaning',
	data() {
		return {
			mouse: {
				x: 0,
				y: 0,
				down: false
			},
			cleaningResult: '',
			screenSizeK: 0
		}
	},
	mounted() {
		const cnv = document.getElementById('cnv');

		if(window.matchMedia("(max-width: 376px)").matches) {
			this.screenSizeK = 1.5;
		} else {
			this.screenSizeK = 1;
		}

		cnv.width = cnv.height = 450 / this.screenSizeK;

		this.vueCanvas = cnv.getContext('2d');
		this.vueCanvas.fillStyle = '#fff';
		this.vueCanvas.fillRect(0, 0, cnv.width, cnv.height);

		cnv.addEventListener('mousemove', this.positionHandler);
		cnv.addEventListener('touchstart', this.positionHandler);
		cnv.addEventListener('touchmove', this.positionHandler);
		cnv.addEventListener('mousedown', () => this.mouse.down = true);
		cnv.addEventListener('mouseup', () => this.mouse.down = false);

		this.setDirt();
	},
	methods: {
		positionHandler(e) {
			if(e.clientX && e.clientY) {
				this.mouse.x = e.offsetX;
				this.mouse.y = e.offsetY;
				if(this.mouse.down)
					this.startClear();
			} else if(e.targetTouches) {
				this.mouse.x = e.targetTouches[0].pageX - e.targetTouches[0].target.offsetLeft - 25 / this.screenSizeK;
				this.mouse.y = e.targetTouches[0].pageY - e.targetTouches[0].target.offsetTop / 2 - 25 / this.screenSizeK;
				this.mouse.down = true;
				if(this.mouse.down) 
					this.startClear();
				e.preventDefault();
			}
		},
		setDirt() {
			for(let i = 0; i < ~~(Math.random() * 20) + 20; i++) {
				this.vueCanvas.beginPath();
				this.vueCanvas.globalAlpha = Math.random();
				this.vueCanvas.fillStyle = '#682C07';
				this.vueCanvas.arc(~~(Math.random() * cnv.width - cnv.width / 2) + cnv.width / 2,
								   ~~(Math.random() * cnv.height - cnv.height / 2) + cnv.width / 2,
								   (~~(Math.random() * 20) + 20) / this.screenSizeK, 0, Math.PI * 2);
				this.vueCanvas.fill();
			}
		},
		startClear() {
			this.vueCanvas.beginPath();
			this.vueCanvas.globalAlpha = 0.25;
			this.vueCanvas.fillStyle = '#fff';
			this.vueCanvas.arc(this.mouse.x, this.mouse.y, 50 / this.screenSizeK, 0, 2 * Math.PI);
			this.vueCanvas.fill();
		},
		async nextClean() {
			const imgData = this.vueCanvas.getImageData(0, 0, cnv.width, cnv.height)
			if(!imgData.data.find(pixel => pixel < 230)) {
				const stats = [
					{ name: 'starve', value: -2 },
					{ name: 'stamina', value: -2 },
					{ name: 'money', value: 3 }
				];
				await this.$store.dispatch('userStat', stats);
				bus.$emit('refresh feels', this.$store.getters.getUser);
				this.cleaningResult = '';
				this.setDirt();
			} else {
				this.cleaningResult = 'Грязно!';
			}
		}
	},
	 components: {
	 	PrimaryButton
	 }
}
</script>