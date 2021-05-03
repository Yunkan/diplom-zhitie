<template>
	<div class="connectFour-container">
		<div class="users">
			<div class="user" v-for="user in users">{{ user.username }}</div>
		</div>

		<div class="connectFour-table">
			<div class="column" v-for="(column, columnIndex) in game.table">
                <div class="row"
                    v-for="(row, rowIndex) in game.table[columnIndex]"
                    :style="{ 'background-color': row }"
                    @click="setBrick(columnIndex, rowIndex)">

                </div>
            </div>
		</div>
	</div>
</template>
<style lang="scss">
	.connectFour-container {
		padding: 1em;
		margin-top: 1em;
		.users {
			display: flex;
			justify-content: space-between;

			.user {
				margin: 1em;
			}
		}

		.connectFour-table {
			display: flex;
			justify-content: center;
			margin: 0 auto;
			display: grid;
			grid-template-columns: repeat(8, 50px);

			@media (max-width: 376px) {
				grid-template-columns: repeat(8, 25px);
			}

			.column {
				display: grid;
				grid-template-rows: repeat(8, 50px);

				@media (max-width: 376px) {
					grid-template-rows: repeat(8, 25px);
				}

				.row {
					border: 1px solid #000;
					cursor: pointer;

					&:hover {
						border: 2px solid #000;
					}
				}
			}
		}
	}
</style>
<script>
import { bus } from '../../main.js';
export default {
	name: 'ConnectFour',
	props: ['initialUsers'],
	data() {
		return {
			users: this.initialUsers,
			brickColor: this.initialUsers[0]._id === this.$store.getters.getUser._id ? 'red' : 'blue',
 			game: {
				turn: this.initialUsers[0]._id,
				table: [
					['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
	                ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
	                ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
	                ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
	                ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
	                ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
	                ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
	                ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white']
			    ]
			}
		}
	},
	created() {
		this.$socket.client.on('technical defeat', data => {
			let stats = [];
			let title = '';
			if(data.user._id === this.$store.getters.getUser._id) {
				stats = [
					{ name: 'stamina', value: -10 },
					{ name: 'starve', value: -10 },
					{ name: 'rating', value: -10 }
				];
				title = 'Поражение!';
			} else {
				stats = [
					{ name: 'stamina', value: -10 },
					{ name: 'starve', value: -10 },
					{ name: 'rating', value: 10 },
					{ name: 'money', value: 20 }
				];
				title = 'Противник бежал!!';
			}
			bus.$emit('game end', { stats, title });
		});

		this.$socket.client.on('connectFour refresh', data => {
			this.game = data.game;

			let win = null;
			for(let i = 0; i < this.game.table.length; i++) {
				for(let j = 0; j < this.game.table[i].length; j++) {
					if(this.game.table[i][j] !== 'white' &&
						this.game.table[i + 3] &&
						this.game.table[i][j] === this.game.table[i + 1][j] &&
						this.game.table[i][j] === this.game.table[i + 2][j] &&
						this.game.table[i][j] === this.game.table[i + 3][j]) {
							win = this.game.table[i][j];
							break;
					} else if(this.game.table[i][j] !== 'white' &&
						this.game.table[i][j + 3] &&
						this.game.table[i][j] === this.game.table[i][j + 1] &&
						this.game.table[i][j] === this.game.table[i][j + 2] &&
						this.game.table[i][j] === this.game.table[i][j + 3]) {
							win = this.game.table[i][j];
							break;
					} else if(this.game.table[i][j] !== 'white' &&
						this.game.table[i + 3] &&
						this.game.table[i + 3][j + 3] &&
						this.game.table[i][j] === this.game.table[i + 1][j + 1] &&
						this.game.table[i][j] === this.game.table[i + 2][j + 2] &&
						this.game.table[i][j] === this.game.table[i + 3][j + 3]) {
							win = this.game.table[i][j];
							break;
					} else if(this.game.table[i][j] !== 'white' &&
						this.game.table[i + 3] &&
						this.game.table[i + 3][j - 3] &&
						this.game.table[i][j] === this.game.table[i + 1][j - 1] &&
						this.game.table[i][j] === this.game.table[i + 2][j - 2] &&
						this.game.table[i][j] === this.game.table[i + 3][j - 3]) {
							win = this.game.table[i][j];
							break;
					}
				}
				if(win)
					break;
			}
			if(win) {
				this.$socket.client.emit('connectFour end', { user: this.$store.getters.getUser });
				let stats = [];
				let title = '';
				if(win === this.brickColor) {
					stats = [
						{ name: 'stamina', value: -10 },
						{ name: 'starve', value: -10 },
						{ name: 'rating', value: 10 },
						{ name: 'money', value: 20 }
					];
					title = 'Победа!';
				} else {
					stats = [
						{ name: 'stamina', value: -10 },
						{ name: 'starve', value: -10 },
						{ name: 'rating', value: -10 },
						{ name: 'money', value: 10 }
					];
					title = 'Поражение!';
				}
				bus.$emit('game end', { stats, title });
			}
		});
	},
	methods: {
		setBrick(i, j) {
			if(this.$store.getters.getUser._id === this.game.turn) {
				if(this.game.table[i][j] === 'white') {
					if(!this.game.table[i][j + 1] || (this.game.table[i][j + 1] !== 'white')) {
						this.$set(this.game.table[i], j, this.brickColor);
		 				this.$socket.client.emit('connectFour setBrick', { user: this.$store.getters.getUser, game: this.game });
					}
	 			}
			}
    	}
	}
}
</script>