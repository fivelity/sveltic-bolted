import { writable, derived } from 'svelte/store'
import type { Widget, WidgetType, GridSettings, Layout } from '$lib/types'
import { dataStore } from './dataStore'

interface DashboardState {
	widgets: Widget[]
	selectedWidgetId: string | null
	gridSettings: GridSettings
	layouts: Layout[]
	currentLayoutId: string | null
	widgetTemplates: WidgetTemplate[]
	showGrid: boolean
	snapToGrid: boolean
	isLeftPanelOpen: boolean
	leftPanelMode: 'widgets' | 'editor' | 'layouts' | 'alerts' | 'settings'
	nextWidgetId: number
}

const initialState: DashboardState = {
	widgets: [],
	selectedWidgetId: null,
	gridSettings: {
		cellSize: 40,
		gap: 0,
		cols: 0,
		rows: 0
	},
	layouts: [],
	currentLayoutId: null,
	widgetTemplates: [],
	showGrid: true,
	snapToGrid: true,
	isLeftPanelOpen: false,
	leftPanelMode: 'widgets',
	nextWidgetId: 1
}

function createDashboardStore() {
	const { subscribe, set, update } = writable<DashboardState>(initialState)


	return {
		subscribe,
		
		// Initialization
		init: () => {
			if (typeof window !== 'undefined') {
				const saved = localStorage.getItem('sensecanvas-dashboard')
				if (saved) {
					try {
						const data = JSON.parse(saved)
						update(state => ({ 
							...state, 
							...data,
							// Ensure we have valid grid settings
							gridSettings: {
								...state.gridSettings,
								...data.gridSettings
							},
							// Ensure nextWidgetId is set correctly
							nextWidgetId: data.nextWidgetId || 1
						}))
						
						// Update nextWidgetId based on existing widgets to prevent duplicate keys
						if (data.widgets && data.widgets.length > 0) {
							const maxId = Math.max(
								...data.widgets
									.map((w: Widget) => w.id)
									.filter((id: string) => id.startsWith('widget-'))
									.map((id: string) => parseInt(id.replace('widget-', ''), 10))
									.filter((num: number) => !isNaN(num))
							)
							if (maxId >= 0) {
								update(state => ({
									...state,
									nextWidgetId: maxId + 1
								}))
							}
						}
					} catch (e) {
						console.error('Failed to load dashboard data:', e)
					}
				}
			}
		},

		// Persist to localStorage
		persist: () => {
			if (typeof window !== 'undefined') {
				update(state => {
					localStorage.setItem('sensecanvas-dashboard', JSON.stringify({
						widgets: state.widgets,
						layouts: state.layouts,
						currentLayoutId: state.currentLayoutId,
						showGrid: state.showGrid,
						snapToGrid: state.snapToGrid,
						gridSettings: state.gridSettings,
						nextWidgetId: state.nextWidgetId
					}))
					return state
				})
			}
		},

		// Widget management
		addWidget: (type: WidgetType, x = 0, y = 0, width?: number, height?: number) => {
			const defaultSizes = getDefaultWidgetSize(type)
			const finalWidth = width || defaultSizes.width
			const finalHeight = height || defaultSizes.height

			update(state => ({
				...state,
				widgets: [...state.widgets, {
					id: `widget-${state.nextWidgetId}`,
					type,
					x,
					y,
					width: finalWidth,
					height: finalHeight,
					title: `${type} Widget`,
					config: getDefaultConfig(type),
					dataSource: 'cpu-temp'
				}],
				nextWidgetId: state.nextWidgetId + 1
			}))
			
			dashboardStore.persist()
		},

		updateWidget: (id: string, updates: Partial<Widget>) => {
			update(state => ({
				...state,
				widgets: state.widgets.map(w => 
					w.id === id ? { ...w, ...updates } : w
				)
			}))
			
			dashboardStore.persist()
		},

		removeWidget: (id: string) => {
			update(state => ({
				...state,
				widgets: state.widgets.filter(w => w.id !== id),
				selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId
			}))
			
			dashboardStore.persist()
		},

		duplicateWidget: (id: string) => {
			update(state => {
				const widget = state.widgets.find(w => w.id === id)
				if (!widget) return state

				const newWidget: Widget = {
					...widget,
					id: `widget-${state.nextWidgetId}`,
					x: widget.x + 20,
					y: widget.y + 20,
					title: `${widget.title} Copy`
				}

				return {
					...state,
					widgets: [...state.widgets, newWidget],
					nextWidgetId: state.nextWidgetId + 1
				}
			})
			
			dashboardStore.persist()
		},

		// Selection
		selectWidget: (id: string | null) => {
			update(state => ({
				...state,
				selectedWidgetId: id,
				leftPanelMode: id ? 'editor' : state.leftPanelMode
			}))
		},

		// Grid settings
		setGridSize: (size: number) => {
			// Ensure size is valid
			const validSizes = [20, 40, 80, 160]
			const validSize = validSizes.includes(size) ? size : 40
			
			update(state => ({
				...state,
				gridSettings: { ...state.gridSettings, cellSize: validSize }
			}))
			
			dashboardStore.persist()
		},

		updateGridSettings: (settings: Partial<GridSettings>) => {
			update(state => ({
				...state,
				gridSettings: { ...state.gridSettings, ...settings }
			}))
			
			dashboardStore.persist()
		},

		toggleGrid: () => {
			update(state => ({
				...state,
				showGrid: !state.showGrid
			}))
			
			dashboardStore.persist()
		},

		toggleSnap: () => {
			update(state => ({
				...state,
				snapToGrid: !state.snapToGrid
			}))
			
			dashboardStore.persist()
		},

		// Left panel
		toggleLeftPanel: (mode?: 'widgets' | 'editor' | 'layouts' | 'alerts' | 'settings') => {
			update(state => {
				const newMode = mode || state.leftPanelMode
				return {
					...state,
					isLeftPanelOpen: mode ? true : !state.isLeftPanelOpen,
					leftPanelMode: newMode
				}
			})
		},

		closeLeftPanel: () => {
			update(state => ({
				...state,
				isLeftPanelOpen: false
			}))
		},

		// Layout management
		saveLayout: (name: string) => {
			update(state => {
				const layout: Layout = {
					id: `layout-${Date.now()}`,
					name,
					widgets: state.widgets,
					gridSettings: state.gridSettings,
					createdAt: new Date().toISOString()
				}
				
				return {
					...state,
					layouts: [...state.layouts, layout],
					currentLayoutId: layout.id
				}
			})
			
			dashboardStore.persist()
		},

		loadLayout: (id: string) => {
			update(state => {
				const layout = state.layouts.find(l => l.id === id)
				if (!layout) return state

				return {
					...state,
					widgets: layout.widgets,
					gridSettings: layout.gridSettings,
					currentLayoutId: id
				}
			})
			
			dashboardStore.persist()
		},

		deleteLayout: (id: string) => {
			update(state => ({
				...state,
				layouts: state.layouts.filter(l => l.id !== id),
				currentLayoutId: state.currentLayoutId === id ? null : state.currentLayoutId
			}))
			
			dashboardStore.persist()
		},

		// Widget templates
		saveWidgetAsTemplate: (widgetId: string, name: string) => {
			update(state => {
				const widget = state.widgets.find(w => w.id === widgetId)
				if (!widget) return state

				const template: WidgetTemplate = {
					id: `template-${Date.now()}`,
					name,
					type: widget.type,
					config: { ...widget.config },
					defaultSize: { width: widget.width, height: widget.height },
					createdAt: new Date().toISOString()
				}

				return {
					...state,
					widgetTemplates: [...state.widgetTemplates, template]
				}
			})
			
			dashboardStore.persist()
		},

		exportWidget: (widgetId: string) => {
			let currentState: DashboardState
			const unsubscribe = subscribe(state => {
				currentState = state
			})
			unsubscribe()
			
			const widget = currentState!.widgets.find(w => w.id === widgetId)
			if (!widget) return

			const exportData = {
				type: widget.type,
				title: widget.title,
				config: widget.config,
				dataSource: widget.dataSource,
				size: { width: widget.width, height: widget.height },
				exportedAt: new Date().toISOString(),
				version: '1.0'
			}

			const blob = new Blob([JSON.stringify(exportData, null, 2)], {
				type: 'application/json'
			})
			const url = URL.createObjectURL(blob)
			
			const a = document.createElement('a')
			a.href = url
			a.download = `${widget.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_widget.json`
			a.click()
			
			URL.revokeObjectURL(url)
		},

		// Data polling controls
		startDataPolling: () => {
			dataStore.startPolling()
		},

		stopDataPolling: () => {
			dataStore.stopPolling()
		}
	}
}

function getDefaultWidgetSize(type: WidgetType) {
	switch (type) {
		case 'gauge':
			return { width: 320, height: 320 } // 8x8 grid cells (40px each)
		case 'line-chart':
			return { width: 480, height: 320 } // 12x8 grid cells
		case 'bar-chart':
			return { width: 320, height: 240 } // 8x6 grid cells
		case 'text-display':
			return { width: 240, height: 160 } // 6x4 grid cells
		default:
			return { width: 320, height: 240 }
	}
}

function getDefaultConfig(type: WidgetType) {
	switch (type) {
		case 'gauge':
			return {
				min: 0,
				max: 100,
				unit: '°C',
				color: '#6366f1',
				showValue: true,
				animation: true
			}
		case 'line-chart':
			return {
				timeRange: '1h',
				yAxisMin: 0,
				yAxisMax: 100,
				color: '#10b981',
				showPoints: true,
				smooth: true
			}
		case 'bar-chart':
			return {
				orientation: 'vertical',
				color: '#f59e0b',
				showLabels: true,
				animation: true
			}
		case 'text-display':
			return {
				fontSize: 24,
				fontWeight: 'bold',
				color: '#ffffff',
				alignment: 'center',
				unit: ''
			}
		default:
			return {}
	}
}

export const dashboardStore = createDashboardStore()

// Derived stores
export const selectedWidget = derived(
	dashboardStore,
	$dashboard => $dashboard.widgets.find(w => w.id === $dashboard.selectedWidgetId) || null
)