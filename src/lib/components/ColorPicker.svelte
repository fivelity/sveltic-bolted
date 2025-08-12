<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let currentColor = '#6366f1'

	const dispatch = createEventDispatcher()

	const presetColors = [
		'#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
		'#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308',
		'#84cc16', '#22c55e', '#10b981', '#06b6d4', '#0ea5e9',
		'#3b82f6', '#6366f1', '#8b5cf6', '#1f2937', '#374151'
	]

	function selectColor(color: string) {
		currentColor = color
		dispatch('colorChange', color)
	}

	function handleCustomInput(event: Event) {
		const target = event.target as HTMLInputElement
		currentColor = target.value
		dispatch('colorChange', target.value)
	}

	function close() {
		dispatch('close')
	}
</script>

<div class="color-picker glass" on:click|stopPropagation>
	<div class="picker-header">
		<h5>Choose Color</h5>
		<button class="close-btn" on:click={close}>×</button>
	</div>
	
	<div class="color-presets">
		{#each presetColors as color}
			<button
				class="color-preset {color === currentColor ? 'selected' : ''}"
				style="background: {color}"
				on:click={() => selectColor(color)}
				title={color}
			></button>
		{/each}
	</div>
	
	<div class="custom-color">
		<label for="custom-color-input">Custom Color</label>
		<div class="custom-input">
			<input
				id="custom-color-input"
				type="color"
				value={currentColor}
				on:input={handleCustomInput}
				class="color-input-native"
			/>
			<input
				type="text"
				value={currentColor}
				on:input={handleCustomInput}
				class="input color-text"
				placeholder="#6366f1"
			/>
		</div>
	</div>
</div>

<style>
	.color-picker {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		width: 240px;
		padding: 16px;
		background: var(--bg-widget);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		box-shadow: 0 8px 32px var(--shadow-dark);
		z-index: 1000;
	}

	.picker-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.picker-header h5 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		background: transparent;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 16px;
		line-height: 1;
	}

	.close-btn:hover {
		color: var(--text-primary);
	}

	.color-presets {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
		margin-bottom: 16px;
	}

	.color-preset {
		width: 32px;
		height: 32px;
		border: 2px solid transparent;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.color-preset:hover {
		transform: scale(1.1);
		border-color: var(--accent-primary);
	}

	.color-preset.selected {
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 2px var(--accent-primary);
		transform: scale(1.1);
	}

	.custom-color {
		border-top: 1px solid var(--border-color);
		padding-top: 12px;
	}

	.custom-color label {
		display: block;
		font-size: 12px;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 6px;
	}

	.custom-input {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.color-input-native {
		width: 32px;
		height: 32px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}

	.color-text {
		flex: 1;
		font-family: monospace;
		font-size: 12px;
	}
</style>