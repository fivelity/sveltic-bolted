<script lang="ts">
	import { onMount } from 'svelte'
	import type { Widget } from '$lib/types'
	import type { HardwareMetric } from '$lib/stores/dataStore'

	export let widget: Widget
	export let metric: HardwareMetric | undefined

	$: config = widget.config
	$: value = metric?.currentValue ?? 0
	$: percentage = metric ? ((value - config.min) / (config.max - config.min)) * 100 : 0
	$: angle = (percentage / 100) * 270 - 135 // 270 degree gauge

	let mounted = false

	onMount(() => {
		mounted = true
	})
</script>

<div class="gauge-widget">
	{#if mounted && metric}
		<div class="gauge-container">
			<svg width="120" height="120" class="gauge-svg">
				<!-- Background arc -->
				<path
					d="M 20 90 A 40 40 0 1 1 100 90"
					fill="none"
					stroke="var(--bg-secondary)"
					stroke-width="8"
					stroke-linecap="round"
				/>
				<!-- Value arc -->
				<path
					d="M 20 90 A 40 40 0 1 1 100 90"
					fill="none"
					stroke={config.color || 'var(--accent-primary)'}
					stroke-width="8"
					stroke-linecap="round"
					stroke-dasharray="{(percentage / 100) * 251.2} 251.2"
					style="transition: stroke-dasharray 0.5s ease"
				/>
				<!-- Center dot -->
				<circle cx="60" cy="60" r="4" fill={config.color || 'var(--accent-primary)'} />
			</svg>
			
			<div class="gauge-value">
				<div class="value">{value.toFixed(1)}</div>
				<div class="unit">{config.unit || metric.unit}</div>
			</div>
		</div>

		<div class="gauge-info">
			<div class="metric-name">{metric.name}</div>
			<div class="range">
				{config.min} - {config.max} {config.unit || metric.unit}
			</div>
		</div>
	{:else}
		<div class="loading">Loading...</div>
	{/if}
</div>

<style>
	.gauge-widget {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 12px;
	}

	.gauge-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.gauge-svg {
		transform: rotate(-135deg);
	}

	.gauge-value {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.value {
		font-size: 2.25rem; /* text-4xl */
		font-weight: 700;
		color: #22d3ee; /* text-cyan-400 */
		line-height: 1;
		font-family: 'Tomorrow', monospace;
	}

	.unit {
		font-size: 0.75rem; /* text-xs */
		color: rgba(255, 255, 255, 0.6);
		margin-top: 2px;
	}

	.gauge-info {
		text-align: center;
	}

	.metric-name {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.8);
		margin-bottom: 4px;
	}

	.range {
		font-size: 0.75rem; /* text-xs */
		color: rgba(255, 255, 255, 0.6);
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