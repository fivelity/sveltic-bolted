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

// Enhanced data sources with more realistic hardware metrics
export const dataSources = [
	{ id: 'cpu-temp', name: 'CPU Temperature', unit: '°C' },
	{ id: 'cpu-load', name: 'CPU Load', unit: '%' },
	{ id: 'cpu-freq', name: 'CPU Frequency', unit: 'GHz' },
	{ id: 'gpu-temp', name: 'GPU Temperature', unit: '°C' },
	{ id: 'gpu-load', name: 'GPU Load', unit: '%' },
	{ id: 'gpu-memory', name: 'GPU Memory', unit: 'GB' },
	{ id: 'ram-usage', name: 'RAM Usage', unit: '%' },
	{ id: 'ram-speed', name: 'RAM Speed', unit: 'MHz' },
	{ id: 'disk-usage', name: 'Disk Usage', unit: '%' },
	{ id: 'disk-temp', name: 'Disk Temperature', unit: '°C' },
	{ id: 'network-up', name: 'Network Upload', unit: 'MB/s' },
	{ id: 'network-down', name: 'Network Download', unit: 'MB/s' },
	{ id: 'fan-speed', name: 'Fan Speed', unit: 'RPM' },
	{ id: 'power-draw', name: 'Power Draw', unit: 'W' }
]

const initialMetrics: Record<string, HardwareMetric> = {}

// Initialize metrics with realistic ranges and starting values
dataSources.forEach(source => {
	let min = 0, max = 100, startValue = 50
	
	switch (source.id) {
		case 'cpu-temp':
		case 'gpu-temp':
		case 'disk-temp':
			min = 30; max = 85; startValue = 45 + Math.random() * 20
			break
		case 'cpu-freq':
			min = 1.5; max = 4.8; startValue = 2.5 + Math.random() * 1.5
			break
		case 'gpu-memory':
			min = 0; max = 12; startValue = 2 + Math.random() * 6
			break
		case 'ram-speed':
			min = 2133; max = 4800; startValue = 3200 + Math.random() * 800
			break
		case 'network-up':
		case 'network-down':
			min = 0; max = 100; startValue = Math.random() * 50
			break
		case 'fan-speed':
			min = 500; max = 3000; startValue = 1200 + Math.random() * 800
			break
		case 'power-draw':
			min = 50; max = 350; startValue = 150 + Math.random() * 100
			break
		default:
			startValue = 20 + Math.random() * 60
	}
	
	initialMetrics[source.id] = {
		id: source.id,
		name: source.name,
		currentValue: startValue,
		unit: source.unit,
		min,
		max,
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
						
						// Create more realistic data patterns
						let variation = 0
						const time = Date.now() / 1000
						
						switch (id) {
							case 'cpu-temp':
							case 'gpu-temp':
								// Temperature with some thermal cycling
								variation = Math.sin(time / 30) * 3 + (Math.random() - 0.5) * 2
								break
							case 'cpu-load':
							case 'gpu-load':
								// Load with bursts and idle periods
								variation = Math.sin(time / 10) * 15 + (Math.random() - 0.5) * 10
								break
							case 'cpu-freq':
								// Frequency scaling
								variation = Math.sin(time / 20) * 0.5 + (Math.random() - 0.5) * 0.2
								break
							case 'network-up':
							case 'network-down':
								// Network with occasional spikes
								variation = Math.random() > 0.9 ? Math.random() * 30 : (Math.random() - 0.5) * 5
								break
							case 'fan-speed':
								// Fan speed correlates with temperature
								const tempMetric = newMetrics['cpu-temp'] || newMetrics['gpu-temp']
								if (tempMetric) {
									variation = (tempMetric.currentValue - 50) * 20 + (Math.random() - 0.5) * 100
								} else {
									variation = (Math.random() - 0.5) * 200
								}
								break
							default:
								variation = (Math.random() - 0.5) * 5
						}
						
						let newValue = metric.currentValue + variation
						
						// Keep within realistic bounds
						newValue = Math.max(metric.min, Math.min(metric.max, newValue))
						
						// Add to history (keep last 120 points = 2 minutes at 1s intervals)
						const newHistory = [...metric.history, {
							timestamp: Date.now(),
							value: newValue
						}].slice(-120)
						
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