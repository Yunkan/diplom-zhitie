<template>
	<div class="game-container">
		<canvas id="cnv"></canvas>
	</div>
</template>
<style lang="scss">
	.game-container {
		width: 100%;
		height: 100%;
		margin: 1em 0;
		overflow: hidden;
	}
</style>
<script>
export default {
	data() {
		const user = this.$store.getters.getUser;
		return {
			enemies: [],
			player: {
				...user,
				x: null,
				y: null,
				r: 25,
				up: false,
				down: false,
				left: false,
				right: false,
				down: false,
				speed: 3,
				draw(ctx) {
					ctx.beginPath();
					ctx.fillStyle = '#0f0';
					ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
					ctx.fill();
					this.move();
				},
				move() {
					if(this.up && this.y >= 25) {
						this.y -= this.speed;
					}
					if(this.down && this.y <= 975) {
						this.y += this.speed;
					}
					if(this.left && this.x >= 25) {
						this.x -= this.speed;
					}
					if(this.right && this.x <= 975) {
						this.x += this.speed;
					}
				}
			}
		}
	},
	created() {
		this.$socket.client.emit('user join', this.player);
		this.$socket.client.on('set user position', data => {
			this.player.x = data.player.x;
			this.player.y = data.player.y;

			this.enemies = data.enemies;
		});
	},
	mounted() {
		const cnv = document.getElementById('cnv');
		const ctx = cnv.getContext('2d');
		this.vueCanvas = ctx;

		cnv.width = window.innerWidth / 2;
		cnv.height = window.innerHeight;

		window.addEventListener('keydown', e => {
			switch(e.key.toLowerCase()) {
				case 'w':
				case 'ц':
					this.player.moved = true;
					this.player.up = true;
					break;
				case 's':
				case 'ы':
					this.player.moved = true;
					this.player.down = true;
					break;
				case 'a':
				case 'ф':
					this.player.moved = true;
					this.player.left = true;
					break;
				case 'd':
				case 'в':
					this.player.moved = true;
					this.player.right = true;
					break;
			}
		});
		window.addEventListener('keyup', e => {
			switch(e.key.toLowerCase()) {
				case 'w':
				case 'ц':
					this.player.moved = false;
					this.player.up = false;
					break;
				case 's':
				case 'ы':
					this.player.moved = false;
					this.player.down = false;
					break;
				case 'a':
				case 'ф':
					this.player.moved = false;
					this.player.left = false;
					break;
				case 'd':
				case 'в':
					this.player.moved = false;
					this.player.right = false;
					break;
			}
		});

		this.animate();
	},
	destroyed() {
		this.$socket.client.emit('user leave', this.player);
	},
	methods: {
		animate() {
			this.vueCanvas.fillStyle = '#fff';
			this.vueCanvas.fillRect(0, 0, window.innerWidth, window.innerHeight);

			this.enemies.forEach(enemy => {
				this.vueCanvas.beginPath();
				this.vueCanvas.fillStyle = '#f00';
				this.vueCanvas.arc(enemy.x, enemy.y, enemy.r, 0, Math.PI * 2)
				this.vueCanvas.fill();
			});

			this.player.draw(this.vueCanvas);
				this.$socket.client.emit('set user position', this.player);

			requestAnimationFrame(this.animate);
		}
	}
}
</script>