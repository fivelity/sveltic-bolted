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
	let showAddToLibraryDialog = false
	let showRemoveConfirmation = false
	let contextMenuX = 0
	let contextMenuY = 0
	let templateName = ''
	let isHovering = false
	let contextMenuElement: HTMLElement

	const widgetComponents = {
		'gauge': GaugeWidget,
		'line-chart': LineChartWidget,
		'bar-chart': BarChartWidget,
		'text-display': TextDisplayWidget
	}

	function handleMouseDown(event: MouseEvent) {
		dispatch('mousedown', event)
	}

	function handleMouseEnter() {
		isHovering = true
	}

	function handleMouseLeave() {
		isHovering = false
	}

	function toggleContextMenu(event: MouseEvent) {
		event.stopPropagation()
		if (showContextMenu) {
			closeContextMenu()
		} else {
			const rect = event.currentTarget.getBoundingClientRect()
			contextMenuX = rect.right + 8
			contextMenuY = rect.top
			showContextMenu = true
		}
	}

	function editWidget() {
		dashboardStore.selectWidget(widget.id)
		dashboardStore.toggleLeftPanel('editor')
		closeContextMenu()
	}

	function duplicateWidget() {
		dashboardStore.duplicateWidget(widget.id)
		closeContextMenu()
	}

	function addToLibrary() {
		templateName = `${widget.title} Template`
		showAddToLibraryDialog = true
		closeContextMenu()
	}

	function confirmAddToLibrary() {
		if (templateName.trim()) {
			dashboardStore.saveWidgetAsTemplate(widget.id, templateName.trim())
			showAddToLibraryDialog = false
			templateName = ''
		}
	}

	function exportWidget() {
		dashboardStore.exportWidget(widget.id)
		closeContextMenu()
	}

	function showRemoveDialog() {
		showRemoveConfirmation = true
		closeContextMenu()
	}

	function confirmRemoveWidget() {
		dashboardStore.removeWidget(widget.id)
		showRemoveConfirmation = false
	}

	function closeContextMenu() {
		showContextMenu = false
	}

	function closeAllDialogs() {
		showContextMenu = false
		showAddToLibraryDialog = false
		showRemoveConfirmation = false
	}
</script>

<svelte:window on:click={closeAllDialogs} />

<div
	class="widget glass-intense {selected ? 'selected' : ''} {dragging ? 'dragging' : ''}"
	style="
		left: {widget.x}px;
		top: {widget.y}px;
		width: {widget.width}px;
		height: {widget.height}px;
	"
	on:mousedown={handleMouseDown}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	role="button"
	tabindex="0"
>
	<div class="widget-header">
		<h4 class="widget-title">{widget.title}</h4>
		<button 
			class="widget-menu-btn {isHovering || showContextMenu ? 'visible' : ''}" 
			on:click={toggleContextMenu}
			title="Widget Options"
		>
			<MoreVertical size={16} />
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
		bind:this={contextMenuElement}
		class="context-menu glass"
		style="left: {contextMenuX}px; top: {contextMenuY}px;"
		on:click|stopPropagation
	>
		<button on:click={editWidget}>
			<Edit size={16} />
			Edit Widget
		</button>
		<button on:click={duplicateWidget}>
			<Copy size={16} />
			Duplicate
		</button>
		<button on:click={addToLibrary}>
			<FolderPlus size={16} />
			Add to Library
		</button>
		<button on:click={exportWidget}>
			<Download size={16} />
			Export as JSON
		</button>
		<div class="menu-divider"></div>
		<button on:click={showRemoveDialog} class="danger">
			<Trash2 size={16} />
			Remove
		</button>
	</div>
{/if}

{#if showAddToLibraryDialog}
	<div class="dialog-backdrop" on:click={closeAllDialogs}>
		<div class="dialog glass-intense" on:click|stopPropagation>
			<h4>Add Widget to Library</h4>
			<p>Save this widget configuration as a reusable template.</p>
			<input
				type="text"
				class="input"
				placeholder="Template name"
				bind:value={templateName}
				on:keydown={(e) => e.key === 'Enter' && confirmAddToLibrary()}
				autofocus
			/>
			<div class="dialog-actions">
				<button class="btn btn-secondary" on:click={() => showAddToLibraryDialog = false}>
					Cancel
				</button>
				<button class="btn btn-primary" on:click={confirmAddToLibrary} disabled={!templateName.trim()}>
					Save Template
				</button>
			</div>
		</div>
	</div>
{/if}

{#if showRemoveConfirmation}
	<div class="dialog-backdrop" on:click={closeAllDialogs}>
		<div class="dialog glass-intense" on:click|stopPropagation>
			<h4>Remove Widget</h4>
			<p>Are you sure you want to remove "<strong>{widget.title}</strong>"? This action cannot be undone.</p>
			<div class="dialog-actions">
				<button class="btn btn-secondary" on:click={() => showRemoveConfirmation = false}>
					Cancel
				</button>
				<button class="btn btn-danger" on:click={confirmRemoveWidget}>
					Remove Widget
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
		width: 28px;
		height: 28px;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: var(--text-secondary);
		cursor: pointer;
		opacity: 0;
		transition: all 0.2s ease;
		position: relative;
	}

	.widget-menu-btn.visible,
	.widget.selected .widget-menu-btn {
		opacity: 1;
	}

	.widget-menu-btn:hover {
		background: var(--bg-secondary);
		color: var(--text-primary);
		transform: scale(1.05);
	}

	.widget-content {
		flex: 1;
		padding: 16px;
		overflow: hidden;
	}

	.context-menu {
		position: fixed;
		z-index: 10000;
		min-width: 180px;
		border: 1px solid var(--border-color);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 8px 32px var(--shadow-dark);
		backdrop-filter: blur(16px);
		animation: contextMenuSlideIn 0.15s ease-out;
	}

	@keyframes contextMenuSlideIn {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(-4px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.context-menu button {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
		padding: 10px 16px;
		background: transparent;
		border: none;
		color: var(--text-primary);
		font-family: inherit;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s ease;
		text-align: left;
	}

	.context-menu button:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.context-menu button.danger {
		color: var(--error);
	}

	.context-menu button.danger:hover {
		background: rgba(239, 68, 68, 0.15);
	}

	.menu-divider {
		height: 1px;
		background: var(--border-color);
		margin: 4px 0;
	}

	.dialog-backdrop {
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

	.dialog {
		background: var(--bg-widget);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		padding: 24px;
		width: 420px;
		max-width: 85vw;
		animation: dialogSlideIn 0.2s ease-out;
	}

	@keyframes dialogSlideIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.dialog h4 {
		margin: 0 0 16px 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.dialog p {
		margin: 0 0 16px 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.dialog-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-top: 20px;
	}

	.btn-danger {
		background: var(--error);
		color: white;
		border: 1px solid var(--error);
	}

	.btn-danger:hover {
		background: #dc2626;
		border-color: #dc2626;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
	}
</style>