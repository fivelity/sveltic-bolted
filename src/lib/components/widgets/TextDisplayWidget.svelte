<script lang="ts">
	import { onMount } from 'svelte'
	import type { Widget } from '$lib/types'
	import type { HardwareMetric } from '$lib/stores/dataStore'

	export let widget: Widget
	export let metric: HardwareMetric | undefined

	$: config = widget.config
	$: value = metric?.currentValue ?? 0

	let mounted = false

	onMount(() => {
		mounted = true
	})
</script>

<div class="text-display-widget">
	{#if mounted && metric}
		<div class="metric-label">{metric.name}</div>
		
		<div 
			class="metric-value"
			style="
				font-size: {config.fontSize || 24}px;
				font-weight: {config.fontWeight || 'bold'};
				color: {config.color || 'var(--text-primary)'};
				text-align: {config.alignment || 'center'};
			"
		>
			{value.toFixed(1)}<span class="unit">{config.unit || metric.unit}</span>
		</div>

		{#if metric.history.length > 1}
			{@const prevValue = metric.history[metric.history.length - 2]?.value ?? value}
			{@const change = value - prevValue}
			{@const changePercent = prevValue !== 0 ? (change / prevValue) * 100 : 0}
			
			<div class="change-indicator">
				<span class="change {change >= 0 ? 'positive' : 'negative'}">
					{change >= 0 ? '+' : ''}{change.toFixed(1)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%)
				</span>
			</div>
		{/if}
	{:else}
		<div class="loading">Loading...</div>
	{/if}
</div>

<style>
	.text-display-widget {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 8px;
		text-align: center;
	}

	.metric-label {
		font-size: 14px;
		font-weight: 500;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.metric-value {
		line-height: 1;
		transition: all 0.3s ease;
	}

	.unit {
		font-size: 0.6em;
		color: var(--text-secondary);
		margin-left: 4px;
	}

	.change-indicator {
		font-size: 12px;
		margin-top: 4px;
	}

	.change {
		padding: 2px 8px;
		border-radius: 12px;
		font-weight: 500;
	}

	.change.positive {
		background: rgba(16, 185, 129, 0.1);
		color: var(--success);
	}

	.change.negative {
		background: rgba(239, 68, 68, 0.1);
		color: var(--error);
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