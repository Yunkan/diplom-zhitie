<template>
	<div class="md-container">
		<h1>Добро пожаловать!</h1>
		<div class="tavern-menu">
			<span class="select-btn" :class="{ selected: selected == 'keeper' }" @click="selectHandler('keeper')">Трактирщик</span>
			<span class="select-btn" :class="{ selected: selected == 'work' }" @click="selectHandler('work')">Вкалывать</span>
			<span class="select-btn" :class="{ selected: selected == 'chat' }" @click="selectHandler('chat')">Болтовня</span>
			<span class="select-btn" :class="{ selected: selected == 'games' }" @click="selectHandler('games')">Игрища</span>
		</div>
		<div class="keeper" :class="{ show: selected == 'keeper' }">
			<Keeper></Keeper>
		</div>

		<div class="chat" :class="{ show: selected == 'chat' }">
			<Chat></Chat>
		</div>

		<div class="work" :class="{ show: selected == 'work' }">
			<Work></Work>
		</div>
		<div class="games" :class="{ show: selected == 'games' }">
			<Games></Games>
		</div>
	</div>
</template>
<style lang="scss">
	.tavern-menu {
		display: flex;
		flex-flow: row wrap;
	}

	h1 {
		@media (max-width: 376px) {
			font-size: 18px;
		}
	}
	.select-btn {
		padding: 1em;
		margin: 1em;
		color: #803F06;
		position: relative;
		cursor: pointer;
		transition: .2s;

		@media (max-width: 768px) {
			font-size: 10px;
		}

		@media (max-width: 376px) {
			display: flex;
			flex-direction: column;
			text-align: center;
		}

		&:before {
			content: "";
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translate(-50%, 0);
			width: 0%;
			height: 2px;
			background: #FCDC06;
			transition: .2s;
		}

		&:hover,
		&.selected {
			color: #FCDC06;
		}

		&:hover:before,
		&.selected:before {
			width: 100%;	
		}
	}

	.keeper,
	.work,
	.chat,
	.games {
		width: 100%;
		height: 0;
		padding: 0;
		overflow: hidden;
		transition: .2s;

		&.show {
			margin-top: 1em;
			height: auto;
		}
	}
</style>
<script>
import VueCookies from 'vue-cookies';
const Chat = () => import('@/components/Chat');
const Keeper = () => import('@/components/Keeper');
const Work = () => import('@/components/Work');
const Games = () => import('@/components/Games');

export default {
	data() {
		return {
			selected: VueCookies.get('location') || 'keeper'
		}
	},
	methods: {
		selectHandler(select) {
			this.selected = select;
			VueCookies.set('location', select);
		}
	},
	components: {
		Chat, Keeper, Work, Games
	}
}
</script>