<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Edit, Copy, Trash2, MoreVertical, FolderPlus, Download } from 'lucide-svelte'
	import { dashboardStore } from '$lib/stores/dashboardStore'
	import { dataStore } from '$lib/stores/dataStore'
	import GaugeWidget from './widgets/GaugeWidget.svelte'
	import LineChartWidget from './widgets/LineChartWidget.svelte'
	import BarChartWidget from './widgets/BarChartWidget.svelte'
	import TextDisplayWidget from './widgets/TextDisplayWidget.svelte'
	import type { Widget as WidgetType } from '$lib/types'

	export let widget: WidgetType
	export let selected = false
	export let dragging = false

	const dispatch = createEventDispatcher()

	$: data = $dataStore
	$: metric = data.metrics[widget.dataSource]

	let showContextMenu = false
	let showSaveDialog = false
	let contextMenuX = 0
	let contextMenuY = 0
	let templateName = ''
	let isHovering = false

	const widgetComponents = {
		'gauge': GaugeWidget,
		'line-chart': LineChartWidget,
		'bar-chart': BarChartWidget,
		'text-display': TextDisplayWidget
	}

	function handleMouseDown(event: MouseEvent) {
		dispatch('mousedown', event)
	}

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault()
		contextMenuX = event.clientX
		contextMenuY = event.clientY
		showContextMenu = true
	}

	function handleMouseEnter() {
		isHovering = true
	}

	function handleMouseLeave() {
		isHovering = false
	}

	function editWidget() {
		dashboardStore.selectWidget(widget.id)
		dashboardStore.toggleLeftPanel('editor')
		showContextMenu = false
	}

	function duplicateWidget() {
		dashboardStore.duplicateWidget(widget.id)
		showContextMenu = false
	}

	function addToLibrary() {
		templateName = `${widget.title} Template`
		showSaveDialog = true
		showContextMenu = false
	}

	function saveTemplate() {
		if (templateName.trim()) {
			dashboardStore.saveWidgetAsTemplate(widget.id, templateName.trim())
			showSaveDialog = false
			templateName = ''
		}
	}

	function exportWidget() {
		dashboardStore.exportWidget(widget.id)
		showContextMenu = false
	}

	function removeWidget() {
		if (confirm(`Remove "${widget.title}" widget?`)) {
			dashboardStore.removeWidget(widget.id)
		}
		showContextMenu = false
	}

	function closeContextMenu() {
		showContextMenu = false
		showSaveDialog = false
	}
</script>

<svelte:window on:click={closeContextMenu} on:contextmenu={closeContextMenu} />

<div
	class="widget glass-intense {selected ? 'selected' : ''} {dragging ? 'dragging' : ''}"
	style="
		left: {widget.x}px;
		top: {widget.y}px;
		width: {widget.width}px;
		height: {widget.height}px;
	"
	on:mousedown={handleMouseDown}
	on:contextmenu={handleContextMenu}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	role="button"
	tabindex="0"
>
	<div class="widget-header">
		<h4 class="widget-title">{widget.title}</h4>
		<button 
			class="widget-menu-btn {isHovering ? 'visible' : ''}" 
			on:click={() => showContextMenu = !showContextMenu}
		>
			<MoreVertical size={14} />
		</button>
	</div>

	<div class="widget-content">
		<svelte:component
			this={widgetComponents[widget.type]}
			{widget}
			{metric}
		/>
	</div>
</div>

{#if showContextMenu}
	<div
		class="context-menu glass"
		style="left: {contextMenuX}px; top: {contextMenuY}px;"
		on:click={closeContextMenu}
	>
		<button on:click={editWidget}>
			<Edit size={14} />
			Edit Widget
		</button>
		<button on:click={duplicateWidget}>
			<Copy size={14} />
			Duplicate
		</button>
		<button on:click={addToLibrary}>
			<FolderPlus size={14} />
			Add to Library
		</button>
		<button on:click={exportWidget}>
			<Download size={14} />
			Export as JSON
		</button>
		<div class="menu-divider"></div>
		<button on:click={removeWidget} class="danger">
			<Trash2 size={14} />
			Remove
		</button>
	</div>
{/if}

{#if showSaveDialog}
	<div class="save-dialog-backdrop" on:click={closeContextMenu}>
		<div class="save-dialog glass-intense" on:click|stopPropagation>
			<h4>Save to Library</h4>
			<input
				type="text"
				class="input"
				placeholder="Template name"
				bind:value={templateName}
				on:keydown={(e) => e.key === 'Enter' && saveTemplate()}
				autofocus
			/>
			<div class="dialog-actions">
				<button class="btn btn-secondary" on:click={closeContextMenu}>Cancel</button>
				<button class="btn btn-primary" on:click={saveTemplate} disabled={!templateName.trim()}>
					Save Template
				</button>
			</div>
		</div>
	</div>
{/if}
<style>
	.widget {
		position: absolute;
		display: flex;
		flex-direction: column;
		cursor: move;
		user-select: none;
		transition: box-shadow 0.2s ease, transform 0.1s ease;
		min-width: 200px;
		min-height: 150px;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
	}

	.widget:hover {
		box-shadow: 
			0 25px 50px rgba(0, 0, 0, 0.25);
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-2px);
	}

	.widget.selected {
		box-shadow: 
			0 8px 32px var(--shadow-dark),
			inset 0 1px 0 var(--shadow-light),
			0 0 0 2px var(--accent-primary);
	}

	.widget.dragging {
		z-index: 1000;
		transform: scale(1.02);
		box-shadow: 
			0 16px 48px var(--shadow-dark),
			inset 0 1px 0 var(--shadow-light),
			0 0 0 2px var(--accent-primary);
	}

	.widget-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px 8px;
		border-bottom: 1px solid var(--border-color);
	}

	.widget-title {
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.8);
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.widget-menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: transparent;
		border: none;
		border-radius: 4px;
		color: var(--text-secondary);
		cursor: pointer;
		opacity: 0;
		transition: all 0.2s ease;
	}

	.widget-menu-btn.visible,
	.widget.selected .widget-menu-btn {
		opacity: 1;
	}

	.widget-menu-btn:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
	}

	.widget-content {
		flex: 1;
		padding: 16px;
		overflow: hidden;
	}

	.context-menu {
		position: fixed;
		z-index: 10000;
		min-width: 150px;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 8px 32px var(--shadow-dark);
	}

	.context-menu button {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 8px 12px;
		background: transparent;
		border: none;
		color: var(--text-primary);
		font-family: inherit;
		font-size: 13px;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.context-menu button:hover {
		background: var(--bg-secondary);
	}

	.context-menu button.danger {
		color: var(--error);
	}

	.context-menu button.danger:hover {
		background: rgba(239, 68, 68, 0.1);
	}

	.menu-divider {
		height: 1px;
		background: var(--border-color);
		margin: 4px 0;
	}

	.save-dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--bg-modal);
		backdrop-filter: blur(8px);
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.save-dialog {
		background: var(--bg-widget);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 24px;
		width: 400px;
		max-width: 90vw;
	}

	.save-dialog h4 {
		margin: 0 0 16px 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.dialog-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
		margin-top: 16px;
	}
</style>