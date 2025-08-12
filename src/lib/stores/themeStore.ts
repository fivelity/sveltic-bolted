import { writable } from 'svelte/store'

export type Theme = 'dark-space' | 'arctic-light' | 'blue-tech' | 'purple-pro'

interface ThemeState {
	currentTheme: Theme
	themes: Array<{
		id: Theme
		name: string
		description: string
		preview: {
			bg: string
			accent: string
			text: string
		}
	}>
}

const initialState: ThemeState = {
	currentTheme: 'dark-space',
	themes: [
		{
			id: 'dark-space',
			name: 'Dark Space',
			description: 'Deep indigo and purple gradients',
			preview: {
				bg: 'linear-gradient(135deg, #0c0c2e 0%, #1a1a3e 100%)',
				accent: '#6366f1',
				text: '#ffffff'
			}
		},
		{
			id: 'arctic-light',
			name: 'Arctic Light',
			description: 'Clean whites and light blues',
			preview: {
				bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
				accent: '#0ea5e9',
				text: '#1e293b'
			}
		},
		{
			id: 'blue-tech',
			name: 'Blue Tech',
			description: 'Cyan and deep blue technology aesthetic',
			preview: {
				bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
				accent: '#3b82f6',
				text: '#ffffff'
			}
		},
		{
			id: 'purple-pro',
			name: 'Purple Pro',
			description: 'Professional purple and pink gradients',
			preview: {
				bg: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)',
				accent: '#8b5cf6',
				text: '#ffffff'
			}
		}
	]
}

function createThemeStore() {
	const { subscribe, set, update } = writable<ThemeState>(initialState)

	return {
		subscribe,
		
		init: () => {
			if (typeof window !== 'undefined') {
				const savedTheme = localStorage.getItem('sensecanvas-theme') as Theme
				if (savedTheme) {
					update(state => ({
						...state,
						currentTheme: savedTheme
					}))
				}
			}
		},

		setTheme: (theme: Theme) => {
			update(state => ({
				...state,
				currentTheme: theme
			}))
			
			if (typeof window !== 'undefined') {
				document.body.setAttribute('data-theme', theme)
				localStorage.setItem('sensecanvas-theme', theme)
			}
		}
	}
}

export const themeStore = createThemeStore()