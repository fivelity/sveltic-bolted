<script lang="ts">
	import { Gauge, TrendingUp, BarChart3, Type } from 'lucide-svelte'
	import { dashboardStore } from '$lib/stores/dashboardStore'
	import { dataStore } from '$lib/stores/dataStore'
	import type { WidgetType } from '$lib/types'

	$: data = $dataStore

	const widgetTypes: Array<{
		type: WidgetType
		name: string
		description: string
		icon: any
		color: string
	}> = [
		{
			type: 'gauge',
			name: 'Gauge',
			description: 'Circular gauge for single metrics',
			icon: Gauge,
			color: '#6366f1'
		},
		{
			type: 'line-chart',
			name: 'Line Chart',
			description: 'Time-series data visualization',
			icon: TrendingUp,
			color: '#10b981'
		},
		{
			type: 'bar-chart',
			name: 'Bar Chart',
			description: 'Horizontal or vertical bars',
			icon: BarChart3,
			color: '#f59e0b'
		},
		{
			type: 'text-display',
			name: 'Text Display',
			description: 'Large text with current value',
			icon: Type,
			color: '#8b5cf6'
		}
	]

	function addWidget(type: WidgetType) {
		// Add widget at center of canvas or offset position
		const x = Math.random() * 200
		const y = Math.random() * 200
		dashboardStore.addWidget(type, x, y)
		
		// Close panel after adding
		dashboardStore.closeLeftPanel()
	}
</script>

<div class="widget-library">
	<div class="library-description">
		<p>Choose a widget type to add to your dashboard. Click and drag widgets to position them.</p>
		<div class="data-status">
			<span class="status-indicator {data.isPolling ? 'active' : 'inactive'}"></span>
			Data Polling: {data.isPolling ? 'Active' : 'Stopped'}
		</div>
	</div>

	<div class="widget-types">
		{#each widgetTypes as widgetType}
			<button 
				class="widget-type-card glass hover-lift"
				on:click={() => addWidget(widgetType.type)}
			>
				<div class="widget-icon" style="background: {widgetType.color}20; color: {widgetType.color}">
					<svelte:component this={widgetType.icon} size={24} />
				</div>
				
				<div class="widget-info">
					<h4>{widgetType.name}</h4>
					<p>{widgetType.description}</p>
				</div>
			</button>
		{/each}
	</div>

	<div class="library-footer">
		<div class="tip">
			<strong>Tip:</strong> Right-click any widget for edit, duplicate, and remove options.
		</div>
	</div>
</div>

<style>
	.widget-library {
		padding: 20px;
		height: 100%;
		overflow-y: auto;
	}

	.library-description {
		margin-bottom: 24px;
		padding: 16px;
		background: var(--bg-secondary);
		border-radius: 8px;
		border: 1px solid var(--border-color);
	}

	.library-description p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 14px;
		line-height: 1.5;
	}

	.widget-types {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.widget-type-card {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
		width: 100%;
	}

	.widget-type-card:hover {
		border-color: var(--accent-primary);
		background: var(--bg-widget);
	}

	.widget-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 8px;
		flex-shrink: 0;
	}

	.widget-info {
		flex: 1;
		min-width: 0;
	}

	.widget-info h4 {
		margin: 0 0 4px 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.widget-info p {
		margin: 0;
		font-size: 13px;
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.library-footer {
		padding: 16px;
		background: var(--bg-secondary);
		border-radius: 8px;
		border: 1px solid var(--border-color);
	}

	.tip {
		color: var(--text-secondary);
		font-size: 13px;
		line-height: 1.5;
	}

	.tip strong {
		color: var(--text-primary);
	}

	.data-status {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		font-size: 12px;
		color: var(--text-secondary);
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--error);
	}

	.status-indicator.active {
		background: var(--success);
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
</style>