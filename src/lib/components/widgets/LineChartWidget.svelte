<script lang="ts">
	import { onMount } from 'svelte'
	import type { Widget } from '$lib/types'
	import type { HardwareMetric } from '$lib/stores/dataStore'

	export let widget: Widget
	export let metric: HardwareMetric | undefined

	$: config = widget.config
	$: history = metric?.history ?? []
	$: currentValue = metric?.currentValue ?? 0

	let mounted = false
	let chartContainer: HTMLElement

	onMount(() => {
		mounted = true
	})

	function getPoints() {
		if (!history.length || !chartContainer) return ''
		
		const rect = chartContainer.getBoundingClientRect()
		const width = rect.width || 300
		const height = rect.height || 150
		const padding = 20

		const maxTime = history[history.length - 1]?.timestamp ?? Date.now()
		const minTime = maxTime - (60 * 1000) // Last minute
		
		const yMin = config.yAxisMin ?? metric?.min ?? 0
		const yMax = config.yAxisMax ?? metric?.max ?? 100

		return history
			.filter(point => point.timestamp >= minTime)
			.map((point, index, filtered) => {
				const x = padding + ((point.timestamp - minTime) / (maxTime - minTime)) * (width - 2 * padding)
				const y = height - padding - ((point.value - yMin) / (yMax - yMin)) * (height - 2 * padding)
				return `${x},${y}`
			})
			.join(' ')
	}
</script>

<div class="line-chart-widget">
	{#if mounted && metric}
		<div class="chart-header">
			<div class="metric-info">
				<div class="metric-name">{metric.name}</div>
				<div class="current-value">
					{currentValue.toFixed(1)} {config.unit || metric.unit}
				</div>
			</div>
		</div>

		<div bind:this={chartContainer} class="chart-container">
			<svg width="100%" height="100%" class="chart-svg">
				<!-- Grid lines -->
				{#each [0, 25, 50, 75, 100] as percent}
					<line
						x1="20"
						y1="{150 - 20 - (percent / 100) * 110}"
						x2="280"
						y2="{150 - 20 - (percent / 100) * 110}"
						stroke="var(--border-color)"
						stroke-width="1"
						opacity="0.3"
					/>
				{/each}

				<!-- Chart line -->
				{#if history.length > 1}
					<polyline
						points={getPoints()}
						fill="none"
						stroke={config.color || 'var(--accent-primary)'}
						stroke-width="2"
						stroke-linejoin="round"
						stroke-linecap="round"
					/>
					
					<!-- Fill area under curve -->
					{#if getPoints()}
						<polygon
							points="20,130 {getPoints()} 280,130"
							fill="{config.color || 'var(--accent-primary)'}20"
						/>
					{/if}
				{/if}

				<!-- Current value indicator -->
				{#if history.length > 0}
					{@const lastPoint = history[history.length - 1]}
					{@const yMin = config.yAxisMin ?? metric?.min ?? 0}
					{@const yMax = config.yAxisMax ?? metric?.max ?? 100}
					{@const y = 150 - 20 - ((lastPoint.value - yMin) / (yMax - yMin)) * 110}
					<circle
						cx="280"
						cy={y}
						r="3"
						fill={config.color || 'var(--accent-primary)'}
					/>
				{/if}
			</svg>
		</div>

		<div class="chart-footer">
			<div class="time-range">Last {config.timeRange || '1h'}</div>
			<div class="y-axis-range">
				{config.yAxisMin ?? metric.min} - {config.yAxisMax ?? metric.max} {config.unit || metric.unit}
			</div>
		</div>
	{:else}
		<div class="loading">Loading chart data...</div>
	{/if}
</div>

<style>
	.line-chart-widget {
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 8px;
	}

	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.metric-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.metric-name {
		@apply text-sm font-semibold text-white/80 font-tomorrow;
	}

	.current-value {
		@apply text-lg font-bold text-cyan-400 font-tomorrow;
	}

	.chart-container {
		flex: 1;
		min-height: 120px;
		position: relative;
	}

	.chart-svg {
		width: 100%;
		height: 100%;
	}

	.chart-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		color: var(--text-muted);
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