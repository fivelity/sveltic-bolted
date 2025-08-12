import { writable, derived } from 'svelte/store'
import type { Widget, WidgetType, GridSettings, Layout } from '$lib/types'

interface DashboardState {
	widgets: Widget[]
	selectedWidgetId: string | null
	gridSettings: GridSettings
	layouts: Layout[]
	currentLayoutId: string | null
	showGrid: boolean
	snapToGrid: boolean
	isLeftPanelOpen: boolean
	leftPanelMode: 'widgets' | 'editor' | 'layouts' | 'alerts' | 'settings'
}

const initialState: DashboardState = {
	widgets: [],
	selectedWidgetId: null,
	gridSettings: {
		cellSize: 40,
		gap: 8,
		cols: 0,
		rows: 0
	},
	layouts: [],
	currentLayoutId: null,
	showGrid: true,
	snapToGrid: true,
	isLeftPanelOpen: false,
	leftPanelMode: 'widgets'
}

function createDashboardStore() {
	const { subscribe, set, update } = writable<DashboardState>(initialState)

	let widgetIdCounter = 1

	return {
		subscribe,
		
		// Initialization
		init: () => {
			if (typeof window !== 'undefined') {
				// Calculate initial grid settings
				dashboardStore.updateGridSettings({
					cellSize: 40,
					gap: 8,
					cols: Math.floor(window.innerWidth / 48),
					rows: Math.floor(window.innerHeight / 48)
				})

				const saved = localStorage.getItem('sensecanvas-dashboard')
				if (saved) {
					try {
						const data = JSON.parse(saved)
						update(state => ({ ...state, ...data }))
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
						gridSettings: state.gridSettings
					}))
					return state
				})
			}
		},

		// Widget management
		addWidget: (type: WidgetType, x = 0, y = 0, width = 200, height = 150) => {
			const newWidget: Widget = {
				id: `widget-${widgetIdCounter++}`,
				type,
				x,
				y,
				width,
				height,
				title: `${type} Widget`,
				config: getDefaultConfig(type),
				dataSource: 'cpu-temp'
			}
			
			update(state => ({
				...state,
				widgets: [...state.widgets, newWidget]
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
					id: `widget-${widgetIdCounter++}`,
					x: widget.x + 20,
					y: widget.y + 20,
					title: `${widget.title} Copy`
				}

				return {
					...state,
					widgets: [...state.widgets, newWidget]
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
		}
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