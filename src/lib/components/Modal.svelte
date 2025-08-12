<script lang="ts">
	export let show = false

	function close() {
		show = false
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			close()
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			close()
		}
	}
</script>

{#if show}
	<div 
		class="modal-backdrop"
		on:click={handleBackdropClick}
		on:keydown={handleKeyDown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div class="modal-content glass-intense">
			<slot />
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--bg-modal);
		backdrop-filter: blur(8px);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.modal-content {
		background: var(--bg-widget);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		padding: 32px;
		max-width: 600px;
		max-height: 80vh;
		overflow-y: auto;
		width: 100%;
		transform: scale(0.9);
		animation: modalSlideIn 0.3s ease forwards;
	}

	@keyframes modalSlideIn {
		to { 
			transform: scale(1);
		}
	}

	@media (max-width: 768px) {
		.modal-content {
			padding: 24px;
			max-width: 90vw;
		}
	}
</style>