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
			stones: [],
			mouse: {},
			player: new function() {
				this.info = user;
				this.x = 100;
				this.y = 100;
				this.r = 25;
				this.throwForce = 10;
				this.throwingCooldown = 100;
				this.throwingCurrentCooldown = 0;
				this.movement = {
					up: false,
					down: false,
					left: false,
					right: false,
					down: false
				}
				this.speed = 3;
				this.draw = function(ctx) {
					ctx.beginPath();
					ctx.fillStyle = '#0f0';
					ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
					ctx.fill();
					this.throwingCurrentCooldown--;
					this.move();
				}
				this.move = function() {
					if(this.movement.up && this.y >= this.r) {
						this.y -= this.speed;
					}
					if(this.movement.down && this.y <= 500 - this.r) {
						this.y += this.speed;
					}
					if(this.movement.left && this.x >= this.r) {
						this.x -= this.speed;
					}
					if(this.movement.right && this.x <= 750 - this.r) {
						this.x += this.speed;
					}
				}
				this.throwStone = function(stones, mouse) {
					if(this.throwingCurrentCooldown <= 0) {
						this.throwingCurrentCooldown = this.throwingCooldown;
						const self = this;
						stones.push(new function() {
							this.owner = self;
							this.x = this.owner.x;
							this.y = this.owner.y;
							this.r = 10;
							this.endX = mouse.x;
							this.endY = mouse.y;
							this.angle = Math.atan2(this.endY - this.y, this.endX - this.x);
						    this.dx = Math.cos(this.angle) * this.owner.throwForce;
						    this.dy = Math.sin(this.angle) * this.owner.throwForce;
							this.draw = function(index, ctx) {
								ctx.beginPath();
								ctx.fillStyle = '#545151';
								ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
								ctx.fill();
								this.move(index);
							}
							this.move = function(index) {
								if(this.y <= -this.r || this.y >= 500 + this.r || this.x <= -this.r || this.x >= 750 + this.r) {
									stones.splice(index, 1);
								}
								this.x += this.dx;
								this.y += this.dy;
							}
						});
					}
				}
			}
		}
	},
	created() {
		this.$socket.client.emit('user join', this.player);
		this.$socket.client.on('set user position', data => {
			this.enemies = data.enemies;
		});
		this.$socket.client.on('set stones position', data => {
			this.stones = data.stones;
		});
	},
	mounted() {
		const cnv = document.getElementById('cnv');
		const ctx = cnv.getContext('2d');
		this.vueCanvas = ctx;
		cnv.width = 750;
		cnv.height = 500;
		window.addEventListener('keydown', e => {
			switch(e.key.toLowerCase()) {
				case 'w':
				case 'ц':
					this.player.movement.up = true;
					break;
				case 's':
				case 'ы':
					this.player.movement.down = true;
					break;
				case 'a':
				case 'ф':
					this.player.movement.left = true;
					break;
				case 'd':
				case 'в':
					this.player.movement.right = true;
					break;
			}
		});
		window.addEventListener('keyup', e => {
			switch(e.key.toLowerCase()) {
				case 'w':
				case 'ц':
					this.player.movement.up = false;
					break;
				case 's':
				case 'ы':
					this.player.movement.down = false;
					break;
				case 'a':
				case 'ф':
					this.player.movement.left = false;
					break;
				case 'd':
				case 'в':
					this.player.movement.right = false;
					break;
			}
		});

		window.addEventListener('mousemove', e => {
			this.mouse.x = e.offsetX;
			this.mouse.y = e.offsetY;
		});

		cnv.addEventListener('mousedown', e => {
			this.player.throwStone(this.stones, this.mouse);
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
			this.stones.forEach((stone, index) => stone.draw(index, this.vueCanvas));
			this.player.draw(this.vueCanvas);
			this.$socket.client.emit('set user position', this.player);
			if(this.stones.length > 0)
				this.$socket.client.emit('set stones position', this.stones);

			requestAnimationFrame(this.animate);
		}
	}
}
</script>