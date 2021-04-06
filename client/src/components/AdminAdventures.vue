<template>
	<div class="adventure-container">
		<h2>Приключения:</h2>
		<input class="adventuresSearch" type="text" placeholder="Поиск" v-model="searching">
		<div class="saved-adventures">
			<ul>
				<li
					v-for="adventure in adventuresList"
					@click="selectAdventure(adventure._id)"					
					:class="{ selected: selectedAdventure._id === adventure._id }"
					:style="{ display: adventure.text.toLowerCase().indexOf(searching.toLowerCase()) >= 0 ? 'block' : 'none' }">
					{{ adventure.text }}
				</li>
			</ul>
		</div>
		<div class="adventures">
			<textarea name="adventureText" id="adventureText" v-model="selectedAdventure.text"></textarea>
			<div class="adventure-blocks-container">
				<div class="adventure-block">
					<label for="health">Самочувствие:</label>
					<input type="number" max="100" id="health" v-model="selectedAdventure.health">
				</div>
				<div class="adventure-block">
					<label for="starve">Еда:</label>
					<input type="number" max="100" id="starve" v-model="selectedAdventure.starve">
				</div>
				<div class="adventure-block">
					<label for="stamina">Энергия:</label>
					<input type="number" max="100" id="stamina" v-model="selectedAdventure.stamina">
				</div>
				<div class="adventure-block">
					<label for="money">Деньги:</label>
					<input type="number" id="money" v-model="selectedAdventure.money">
				</div>
				<div class="adventure-block">
					<label for="rating">Рейтинг:</label>
					<input type="number" id="rating" v-model="selectedAdventure.rating">
				</div>
			</div>
			<PrimaryButton title="Сохранить" v-on:click="createAdventure"></PrimaryButton>
			<PrimaryButton
				title="Удалить"
				v-on:click="deleteAdventure(selectedAdventure._id)"
				:disabled="!selectedAdventure._id"></PrimaryButton>
		</div>
	</div>
</template>
<style lang="scss">
	.adventure-container {
		@media (max-width: 376px) {
			h2 {
				font-size: 16px;
			}

			input,
			label {
				font-size: 12px;
			}

			textarea,
			ul {
				font-size: 8px;
			}
		}
	}

	.adventures {
		textarea {
			width: 100%;
			min-height: 300px;
			resize: none;
		}

		.adventure-blocks-container {
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;

			@media (max-width: 376px) {
				flex-flow: column wrap;
			}

			.adventure-block {
				width: 33%;
				margin-top: 1em;
				display: flex;
				flex-direction: column;

				@media (max-width: 376px) {
					width: 100%;
				}

				input {
					padding: .25em 1em;
				}
			}
		}
	}

	.saved-adventures {
		padding: 1em 0;

		ul {
			max-height: 200px;
			overflow: auto;
			padding: 1em;
			margin: 0;
			background-color: #fff;

			li {
				list-style: none;
				margin: 1em 0;
				padding: 1em;
				border-bottom: 1px solid #71270A;
				transition: .2s;
				cursor: pointer;

				&:hover,
				&.selected {
					background-color: #71270A;
					color: #fff;
				}
			}
		}
	}

	.adventuresSearch {
		width: 90%;
		padding: .5em 1em;
	}
</style>
<script>
const PrimaryButton = () => import('./PrimaryButton.vue');
export default {
	name: 'AdminAdventures',
	data() {
		return {
			adventuresList: [],
			selectedAdventure: {
				text: '',
				starve: 0,
				health: 0,
				stamina: 0,
				money: 0,
				rating: 0,
			},
			searching: ''
		}
	},
	async created() {
		this.adventuresList = await this.$store.dispatch('showAdventuresList');
	},
	methods: {
		async createAdventure() {
			this.selectedAdventure = await this.$store.dispatch('createAdventure', this.selectedAdventure);
			if(!this.adventuresList.find((adventure) => adventure._id === this.selectedAdventure._id))
				this.adventuresList.push(this.selectedAdventure);
			this.selectedAdventure = {
				_id: null,
				text: '',
				starve: 0,
				health: 0,
				stamina: 0,
				money: 0,
				rating: 0,
			}
		},
		selectAdventure(id) {
			if(this.selectedAdventure._id === id) {
				this.selectedAdventure = {
					_id: null,
					text: '',
					starve: 0,
					health: 0,
					stamina: 0,
					money: 0,
					rating: 0,
				}
			}
			else
				this.selectedAdventure = this.adventuresList.filter((adventure) => adventure._id === id)[0];
		},
		async deleteAdventure(id) {
			await this.$store.dispatch('deleteAdventure', this.selectedAdventure);
			
			this.adventuresList = this.adventuresList.filter((adventure) => adventure._id !== this.selectedAdventure._id);
			this.selectedAdventure = {
				_id: null,
				text: '',
				starve: 0,
				health: 0,
				stamina: 0,
				money: 0,
				rating: 0,
			}
		}
	},
	components: {
		PrimaryButton
	}
}
</script>