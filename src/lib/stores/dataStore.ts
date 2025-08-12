import { writable, derived, get } from 'svelte/store'

export interface DataPoint {
	timestamp: number
	value: number
}

export interface HardwareMetric {
	id: string
	name: string
	currentValue: number
	unit: string
	min: number
	max: number
	history: DataPoint[]
}

interface DataState {
	isPolling: boolean
	pollingRate: number
	metrics: Record<string, HardwareMetric>
}

// Data sources configuration
export const dataSources = [
	{ id: 'cpu-temp', name: 'CPU Temperature', unit: '°C' },
	{ id: 'cpu-load', name: 'CPU Load', unit: '%' },
	{ id: 'gpu-temp', name: 'GPU Temperature', unit: '°C' },
	{ id: 'gpu-load', name: 'GPU Load', unit: '%' },
	{ id: 'ram-usage', name: 'RAM Usage', unit: '%' },
	{ id: 'disk-usage', name: 'Disk Usage', unit: '%' },
	{ id: 'network-up', name: 'Network Upload', unit: 'MB/s' },
	{ id: 'network-down', name: 'Network Download', unit: 'MB/s' }
]

const initialMetrics: Record<string, HardwareMetric> = {}

// Initialize metrics based on data sources
dataSources.forEach(source => {
	initialMetrics[source.id] = {
		id: source.id,
		name: source.name,
		currentValue: Math.random() * 100,
		unit: source.unit,
		min: 0,
		max: source.unit === '°C' ? 100 : (source.unit === 'MB/s' ? 50 : 100),
		history: []
	}
})

const initialState: DataState = {
	isPolling: false,
	pollingRate: 1000,
	metrics: initialMetrics
}

function createDataStore() {
	const { subscribe, set, update } = writable<DataState>(initialState)
	const store = { subscribe }
	
	let pollingInterval: number | null = null

	return {
		subscribe,
		
		startPolling: () => {
			update(state => ({ ...state, isPolling: true }))
			
			if (pollingInterval) {
				clearInterval(pollingInterval)
			}
			
			const currentState = get(store)
			pollingInterval = window.setInterval(() => {
				update(state => {
					const newMetrics = { ...state.metrics }
					
					Object.keys(newMetrics).forEach(id => {
						const metric = newMetrics[id]
						const variation = (Math.random() - 0.5) * 10
						let newValue = metric.currentValue + variation
						
						// Keep within bounds
						newValue = Math.max(metric.min, Math.min(metric.max, newValue))
						
						// Add to history (keep last 60 points)
						const newHistory = [...metric.history, {
							timestamp: Date.now(),
							value: newValue
						}].slice(-60)
						
						newMetrics[id] = {
							...metric,
							currentValue: newValue,
							history: newHistory
						}
					})
					
					return { ...state, metrics: newMetrics }
				})
			}, currentState.pollingRate)
		},

		stopPolling: () => {
			if (pollingInterval) {
				clearInterval(pollingInterval)
				pollingInterval = null
			}
			update(state => ({ ...state, isPolling: false }))
		},

		setPollingRate: (rate: number) => {
			update(state => ({ ...state, pollingRate: rate }))
			
			const currentState = get(store)
			if (currentState.isPolling) {
				dataStore.stopPolling()
				dataStore.startPolling()
			}
		},

		getMetric: (id: string) => {
			const currentState = get(store)
			return currentState.metrics[id]
		}
	}
}

export const dataStore = createDataStore()