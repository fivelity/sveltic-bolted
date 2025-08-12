<script lang="ts">
	import { onMount } from 'svelte'
	import type { Widget } from '$lib/types'
	import type { HardwareMetric } from '$lib/stores/dataStore'

	export let widget: Widget
	export let metric: HardwareMetric | undefined

	$: config = widget.config
	$: value = metric?.currentValue ?? 0
	$: percentage = metric ? ((value - metric.min) / (metric.max - metric.min)) * 100 : 0

	let mounted = false

	onMount(() => {
		mounted = true
	})
</script>

<div class="bar-chart-widget">
	{#if mounted && metric}
		<div class="chart-header">
			<div class="metric-name">{metric.name}</div>
			<div class="current-value">
				{value.toFixed(1)} {config.unit || metric.unit}
			</div>
		</div>

		<div class="bar-container">
			{#if config.orientation === 'horizontal'}
				<div class="bar-track horizontal">
					<div 
						class="bar-fill"
						style="
							width: {percentage}%;
							background: {config.color || 'var(--accent-primary)'};
						"
					></div>
				</div>
			{:else}
				<div class="bar-track vertical">
					<div 
						class="bar-fill"
						style="
							height: {percentage}%;
							background: {config.color || 'var(--accent-primary)'};
						"
					></div>
				</div>
			{/if}
		</div>

		<div class="chart-footer">
			<div class="range-info">
				<span>{metric.min} {metric.unit}</span>
				<span class="percentage">{percentage.toFixed(0)}%</span>
				<span>{metric.max} {metric.unit}</span>
			</div>
		</div>
	{:else}
		<div class="loading">Loading...</div>
	{/if}
</div>

<style>
	.bar-chart-widget {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 12px;
	}

	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.metric-name {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.8);
	}

	.current-value {
		font-size: 1.125rem; /* text-lg */
		font-weight: 700;
		color: #22d3ee; /* text-cyan-400 */
	}

	.bar-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.bar-track {
		background: var(--bg-secondary);
		border-radius: 8px;
		overflow: hidden;
		position: relative;
	}

	.bar-track.horizontal {
		width: 100%;
		height: 24px;
	}

	.bar-track.vertical {
		width: 24px;
		height: 100%;
	}

	.bar-fill {
		background: var(--accent-primary);
		border-radius: inherit;
		transition: all 0.5s ease;
		position: relative;
	}

	.bar-track.horizontal .bar-fill {
		height: 100%;
		min-width: 2px;
	}

	.bar-track.vertical .bar-fill {
		width: 100%;
		min-height: 2px;
		position: absolute;
		bottom: 0;
	}

	.chart-footer {
		text-align: center;
	}

	.range-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		color: var(--text-muted);
	}

	.percentage {
		font-weight: 600;
		color: var(--text-primary);
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: var(--text-muted);
		font-size: 14px;
	}
</style>