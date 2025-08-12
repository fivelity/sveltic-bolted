<script lang="ts">
	import type { GridSettings } from '$lib/types'

	export let show: boolean
	export let gridSettings: GridSettings

	$: ({ cellSize } = gridSettings)
</script>

{#if show}
	<svg class="grid-overlay" width="100%" height="100%">
		<defs>
			<pattern
				id="grid-pattern"
				width={cellSize}
				height={cellSize}
				patternUnits="userSpaceOnUse"
			>
				<rect
					width={cellSize - 1}
					height={cellSize - 1}
					fill="none"
					stroke="var(--grid-color)"
					stroke-width="1"
					stroke-dasharray="2,2"
					opacity="0.4"
				/>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid-pattern)" />
	</svg>
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
		transition: opacity 0.3s ease;
	}
</style>