<template>
	<div class="footer">
		<div class="copyright">
			&copy; Громов Е. И., 2021 {{ new Date().getFullYear() === 2021 ? '' : `- ${new Date().getFullYear()}` }}
		</div>
		<div class="info">
			По вопросам, предложениям, жалобам писать на почту unknsoul@mail.ru
		</div>
		<div class="socials">
			<div class="social">VK - <a href="https://vk.com/kol6asn1k">Громов Егор</a></div>
			<div class="social">Email - unknsoul@mail.ru</div>
		</div>
	</div>
</template>
<style lang="scss">
	.footer {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-between;
		align-items: center;
		padding: 1em;
		margin-top: 1em;
		border-top: 2px solid darken(#803F06, 15%);

		.info {
			font-size: .75rem;
			border-bottom: 1px solid #000;
		}

		.socials {
			display: flex;
			flex-direction: column;

			.social:not(:last-child) {
				margin-bottom: 1em;
			}
		}
	}
</style>
<script>
export default {
	name: 'Footer'
}
</script>