<script lang="ts">
	import { onMount, tick } from 'svelte'
	import { dashboardStore } from '$lib/stores/dashboardStore'
	import { dataStore } from '$lib/stores/dataStore'
	import Widget from './Widget.svelte'
	import GridOverlay from './GridOverlay.svelte'
	import type { DragState } from '$lib/types'

	$: dashboard = $dashboardStore
	$: data = $dataStore
	
	let canvasElement: HTMLElement
	let dragState: DragState = {
		isDragging: false,
		draggedWidget: null,
		startX: 0,
		startY: 0,
		offsetX: 0,
		offsetY: 0
	}

	onMount(() => {
		updateGridSettings()
		window.addEventListener('resize', updateGridSettings)
		return () => window.removeEventListener('resize', updateGridSettings)
	})

	function updateGridSettings() {
		if (!canvasElement) return

		const rect = canvasElement.getBoundingClientRect()
		const { cellSize, gap } = dashboard.gridSettings

		
		// Calculate only whole grid cells that fit perfectly
		const cols = Math.floor(rect.width / cellSize)
		const rows = Math.floor(rect.height / cellSize)

		dashboardStore.updateGridSettings({ cols, rows })
	}

	function handleMouseDown(event: MouseEvent, widget: any) {
		event.preventDefault()
		event.stopPropagation()
		
		const rect = canvasElement.getBoundingClientRect()
		dragState = {
			isDragging: true,
			draggedWidget: widget,
			startX: event.clientX - rect.left,
			startY: event.clientY - rect.top,
			offsetX: event.clientX - rect.left - widget.x,
			offsetY: event.clientY - rect.top - widget.y
		}

		dashboardStore.selectWidget(widget.id)
	}

	function handleMouseMove(event: MouseEvent) {
		if (!dragState.isDragging || !dragState.draggedWidget) return

		const rect = canvasElement.getBoundingClientRect()
		let newX = event.clientX - rect.left - dragState.offsetX
		let newY = event.clientY - rect.top - dragState.offsetY

		if (dashboard.snapToGrid) {
			const { cellSize } = dashboard.gridSettings
			
			// Snap to grid lines
			newX = Math.round(newX / cellSize) * cellSize
			newY = Math.round(newY / cellSize) * cellSize
		}

		// Keep within bounds
		newX = Math.max(0, Math.min(rect.width - dragState.draggedWidget.width, newX))
		newY = Math.max(0, Math.min(rect.height - dragState.draggedWidget.height, newY))

		dashboardStore.updateWidget(dragState.draggedWidget.id, { x: newX, y: newY })
	}

	function handleMouseUp() {
		if (dragState.isDragging) {
			dragState = {
				isDragging: false,
				draggedWidget: null,
				startX: 0,
				startY: 0,
				offsetX: 0,
				offsetY: 0
			}
		}
	}

	function handleCanvasClick(event: MouseEvent) {
		// Only deselect if clicking on empty canvas
		if (event.target === canvasElement) {
			dashboardStore.selectWidget(null)
		}
	}
</script>

<div 
	bind:this={canvasElement}
	class="dashboard-canvas"
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:click={handleCanvasClick}
	role="application"
	tabindex="0"
>
	<GridOverlay 
		show={dashboard.showGrid}
		gridSettings={dashboard.gridSettings}
	/>

	{#each dashboard.widgets as widget (widget.id)}
		<Widget 
			{widget}
			selected={dashboard.selectedWidgetId === widget.id}
			dragging={dragState.draggedWidget?.id === widget.id}
			on:mousedown={(e) => handleMouseDown(e.detail, widget)}
		/>
	{/each}
</div>

<style>
	.dashboard-canvas {
		flex: 1;
		position: relative;
		overflow: hidden;
		background: transparent;
		cursor: default;
		user-select: none;
	}

	.dashboard-canvas:focus {
		outline: none;
	}
</style>