<script lang="ts">
	import type { GridSettings } from '$lib/types'

	export let show: boolean
	export let gridSettings: GridSettings

	$: ({ cellSize, cols, rows } = gridSettings)
</script>

{#if show}
	<div class="grid-overlay">
		{#each Array(rows) as _, row}
			{#each Array(cols) as _, col}
				<div 
					class="grid-cell"
					style="
						left: {col * cellSize}px;
						top: {row * cellSize}px;
						width: {cellSize}px;
						height: {cellSize}px;
					"
				></div>
			{/each}
		{/each}
	</div>
{/if}

<style>
	.grid-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}
	
	.grid-cell {
		position: absolute;
		border: 1px solid var(--grid-color);
		opacity: 0.3;
		box-sizing: border-box;
	}
</style>