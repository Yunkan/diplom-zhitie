<template>
	<button class="primary-button" @click="$emit('click')">{{ title }}</button>
</template>
<style lang="scss">
	.primary-button {
		margin: 1em;
		padding: 1em;
		background-color: #803F06;
		color: #FCDC06;
		border: none;
		font-size: 16px; 
		outline: none;
		cursor: pointer;
		transition: .2s;

		@media (max-width: 768px) {
			font-size: 12px;
		}

		@media (max-width: 376px) {
			font-size: 10px;
		}

		&:hover {
			background-color: darken(#803F06, 15%);
		}

		&:disabled {
			background-color: #564323;
		}
	}
</style>
<script>
export default {
	name: 'PrimaryButton',
	props: ['title', 'click']
}
</script>