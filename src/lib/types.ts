export type WidgetType = 'gauge' | 'line-chart' | 'bar-chart' | 'text-display'

export interface Widget {
	id: string
	type: WidgetType
	x: number
	y: number
	width: number
	height: number
	title: string
	config: Record<string, any>
	dataSource: string
}

export interface GridSettings {
	cellSize: number
	gap: number
	cols: number
	rows: number
}

export interface WidgetTemplate {
	id: string
	name: string
	type: WidgetType
	config: Record<string, any>
	defaultSize: { width: number; height: number }
	createdAt: string
}

export interface Layout {
	id: string
	name: string
	widgets: Widget[]
	gridSettings: GridSettings
	createdAt: string
}

export interface AlertRule {
	id: string
	name: string
	dataSource: string
	condition: 'greater' | 'less' | 'equal'
	threshold: number
	action: 'notification' | 'sound' | 'email'
	enabled: boolean
	lastTriggered?: string
}

export interface DragState {
	isDragging: boolean
	draggedWidget: Widget | null
	startX: number
	startY: number
	offsetX: number
	offsetY: number
}