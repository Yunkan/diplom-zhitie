<template>
	<div class="mini-game-container">
		<PrimaryButton title="Дальше" v-on:click="nextSort"></PrimaryButton>
		<h1 class="mini-game-result">{{ sortingResult }}</h1>
		<div class="sorting-table">
			<div class="table-column" v-for="(column, columnIndex) in table">
				<div
					class="table-row"
					v-for="(row, rowIndex) in table[columnIndex]"
					:style="{ 'background-color': row }"
					:class="{ 'seleted': (selectedCell.x === columnIndex && selectedCell.y === rowIndex) }"
					@click="selectCell(columnIndex, rowIndex)"></div>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
	.sorting-table {
		display: grid;
		grid-template-columns: repeat(5, 75px);
		justify-content: center;
		margin-top: 100px;

		@media (max-width: 376px) {
			grid-template-columns: repeat(5, 50px);
		}

		.table-column {
			display: grid;
			grid-auto-rows: 75px;
			grid-gap: 1em;

			@media (max-width: 376px) {
				grid-auto-rows: 50px;
			}
		}

		.table-row {
			border: 1px solid #000;
			transition: .2s;
			cursor: pointer;

			&.seleted {
				transform: scale(1.1);
			}

			&:hover {
				transform: scale(1.1);
			}
		}
	}
</style>
<script>
import { bus } from '../../main.js';
const PrimaryButton = () => import('../PrimaryButton.vue');
export default {
	name: 'Sorting',
	data() {
		return {
			table: [
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
			],
			colors: ['white', 'red', 'green', 'blue'],
			sortingResult: '',
			selectedCell: {
				x: null,
				y: null
			}
		}
	},
	created() {
		this.setTable();
	},
	methods: {
		setTable() {
			this.table = [
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
			];

			for(let i = 0; i < this.table.length; i++) {
				for(let j = 0; j < this.table[i].length; j++) {
					if(this.table[i][j] === '') {
						this.$set(this.table[i], j, this.colors[j]);
					}
				}

				this.table[i] = this.shuffle(this.table[i]);
			}
		},
		async nextSort() {
			const result = {
				column: true,
				row: true
			}

			for(let i = 0; i < this.table.length; i++) {
				for(let j = 0; j < this.table[i].length - 1; j++) {
					if(this.table[j + 1] && this.table[j][i] === this.table[j + 1][i]) {
						result.row &= true;
					} else {
						result.row &= false;
					}
				}

				if(result.row) {
					result.column &= true;
				} else {
					result.column &= false;
				}
			}

			if(result.column) {
				this.sortingResult = '';
				const stats = [
					{ name: 'starve', value: -2 },
					{ name: 'stamina', value: -2 },
					{ name: 'money', value: 3 }
				];
				await this.$store.dispatch('userStat', stats);
				this.setTable();
			} else {
				this.sortingResult = 'Неправильно!';
			}
		},
		selectCell(x, y) {
			if(this.selectedCell.x === null && this.selectedCell.y === null) {
				this.selectedCell = { x, y };
			} else if(this.selectedCell.x === x && this.selectedCell.y === y) {
				this.selectedCell = {
					x: null,
					y: null
				}
			} else {
				const temporaryCell = this.table[x][y];

				this.$set(this.table[x], y, this.table[this.selectedCell.x][this.selectedCell.y]);
				this.$set(this.table[this.selectedCell.x], this.selectedCell.y, temporaryCell);

				this.selectedCell = {
					x: null,
					y: null
				}
			}
		},
		shuffle(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;

			while (0 !== currentIndex) {
				randomIndex = ~~(Math.random() * currentIndex);
				currentIndex -= 1;

				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		}
	},
	components: {
		PrimaryButton
	}
}
</script>