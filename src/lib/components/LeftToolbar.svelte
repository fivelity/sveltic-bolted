<script lang="ts">
	import { slide } from 'svelte/transition'
	import { Plus, Edit, Layout, AlertTriangle, Settings, X } from 'lucide-svelte'
	import { dashboardStore, selectedWidget } from '$lib/stores/dashboardStore'
	import WidgetLibrary from './panels/WidgetLibrary.svelte'
	import WidgetEditor from './panels/WidgetEditor.svelte'
	import LayoutsPanel from './panels/LayoutsPanel.svelte'
	import AlertsPanel from './panels/AlertsPanel.svelte'
	import SettingsPanel from './panels/SettingsPanel.svelte'

	$: dashboard = $dashboardStore
	$: selected = $selectedWidget

	function togglePanel(mode: 'widgets' | 'editor' | 'layouts' | 'alerts' | 'settings') {
		if (dashboard.isLeftPanelOpen && dashboard.leftPanelMode === mode) {
			dashboardStore.closeLeftPanel()
		} else {
			dashboardStore.toggleLeftPanel(mode)
		}
	}

	const panelConfig = {
		widgets: { icon: Plus, title: 'Widget Library', component: WidgetLibrary },
		editor: { icon: Edit, title: 'Widget Editor', component: WidgetEditor },
		layouts: { icon: Layout, title: 'Layouts', component: LayoutsPanel },
		alerts: { icon: AlertTriangle, title: 'Alerts', component: AlertsPanel },
		settings: { icon: Settings, title: 'Settings', component: SettingsPanel }
	}
</script>

<div class="toolbar-container">
	<div class="toolbar glass">
		{#each Object.entries(panelConfig) as [mode, config]}
			<button
				class="toolbar-btn {dashboard.leftPanelMode === mode && dashboard.isLeftPanelOpen ? 'active' : ''}"
				on:click={() => togglePanel(mode)}
				title={config.title}
			>
				<svelte:component this={config.icon} size={20} />
			</button>
		{/each}
	</div>

	{#if dashboard.isLeftPanelOpen}
		<div class="panel glass-intense" transition:slide={{ duration: 200 }}>
			<div class="panel-header">
				<h3>{panelConfig[dashboard.leftPanelMode].title}</h3>
				<button class="close-btn" on:click={() => dashboardStore.closeLeftPanel()}>
					<X size={16} />
				</button>
			</div>
			
			<div class="panel-content">
				<svelte:component this={panelConfig[dashboard.leftPanelMode].component} />
			</div>
		</div>
	{/if}
</div>

<style>
	.toolbar-container {
		display: flex;
		height: 100%;
		position: relative;
		z-index: 50;
	}

	.toolbar {
		display: flex;
		flex-direction: column;
		padding: 16px 8px;
		gap: 8px;
		width: 60px;
		border-right: 1px solid var(--border-color);
		background: var(--glass-bg);
	}

	.toolbar-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toolbar-btn:hover {
		background: var(--bg-widget);
		color: var(--text-primary);
		border-color: var(--accent-primary);
		transform: translateY(-1px);
	}

	.toolbar-btn.active {
		background: var(--accent-primary);
		color: white;
		border-color: var(--accent-primary);
		box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
	}

	.panel {
		width: 320px;
		height: 100%;
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		background: var(--bg-widget);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--border-color);
	}

	.panel-header h3 {
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.close-btn:hover {
		background: var(--bg-widget);
		color: var(--text-primary);
		border-color: var(--error);
	}

	.panel-content {
		flex: 1;
		overflow-y: auto;
		padding: 0;
	}

	@media (max-width: 768px) {
		.panel {
			width: 280px;
		}
		
		.toolbar {
			width: 50px;
			padding: 12px 4px;
		}
		
		.toolbar-btn {
			width: 40px;
			height: 40px;
		}
	}
</style>