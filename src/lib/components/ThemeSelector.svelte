<script lang="ts">
	import { themeStore } from '$lib/stores/themeStore'

	export let show = false

	$: theme = $themeStore

	function selectTheme(themeId: any) {
		themeStore.setTheme(themeId)
		show = false
	}

	function close() {
		show = false
	}
</script>

{#if show}
	<div class="theme-selector glass" on:click|stopPropagation>
		<div class="selector-header">
			<h5>Choose Theme</h5>
		</div>
		
		<div class="theme-grid">
			{#each theme.themes as themeOption}
				<button
					class="theme-card {theme.currentTheme === themeOption.id ? 'selected' : ''}"
					on:click={() => selectTheme(themeOption.id)}
				>
					<div
						class="theme-preview"
						style="
							background: {themeOption.preview.bg};
							color: {themeOption.preview.text};
						"
					>
						<div
							class="preview-accent"
							style="background: {themeOption.preview.accent};"
						></div>
						<div class="preview-text">Aa</div>
					</div>
					
					<div class="theme-info">
						<div class="theme-name">{themeOption.name}</div>
						<div class="theme-description">{themeOption.description}</div>
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.theme-selector {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		width: 320px;
		padding: 16px;
		background: var(--bg-widget);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		box-shadow: 0 8px 32px var(--shadow-dark);
		z-index: 1000;
	}

	.selector-header {
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--border-color);
	}

	.selector-header h5 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.theme-grid {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.theme-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: transparent;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		width: 100%;
	}

	.theme-card:hover {
		border-color: var(--accent-primary);
		background: var(--bg-secondary);
	}

	.theme-card.selected {
		border-color: var(--accent-primary);
		background: var(--bg-secondary);
		box-shadow: 0 0 0 1px var(--accent-primary);
	}

	.theme-preview {
		width: 48px;
		height: 36px;
		border-radius: 6px;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.preview-accent {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 8px;
	}

	.preview-text {
		font-size: 12px;
		font-weight: 600;
		margin-top: 4px;
	}

	.theme-info {
		flex: 1;
		min-width: 0;
	}

	.theme-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 2px;
	}

	.theme-description {
		font-size: 12px;
		color: var(--text-secondary);
		line-height: 1.3;
	}
</style>