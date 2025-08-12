<script lang="ts">
	import { onMount } from 'svelte'
	import { onDestroy } from 'svelte'
	import { Settings, Database, Zap } from 'lucide-svelte'
	import { dataStore } from '$lib/stores/dataStore'
	import { themeStore } from '$lib/stores/themeStore'

	$: data = $dataStore
	$: theme = $themeStore

	let settings = {
		pollingRate: 1000,
		enableNotifications: true,
		enableSounds: false,
		defaultTheme: 'dark-space' as any,
		autoSave: true,
		showAnimations: true,
		compactMode: false,
		debugMode: false
	}

	let saveTimeoutId: number | undefined

	onMount(() => {
		// Load settings from localStorage
		const saved = localStorage.getItem('sensecanvas-settings')
		if (saved) {
			try {
				settings = { ...settings, ...JSON.parse(saved) }
			} catch (e) {
				console.error('Failed to load settings:', e)
			}
		}
	})

	function saveSettings() {
		localStorage.setItem('sensecanvas-settings', JSON.stringify(settings))
		
		// Apply settings
		if (settings.pollingRate !== data.pollingRate) {
			dataStore.setPollingRate(settings.pollingRate)
		}
		
		if (settings.defaultTheme !== theme.currentTheme) {
			themeStore.setTheme(settings.defaultTheme)
		}
	}

	function resetSettings() {
		if (confirm('Reset all settings to default values?')) {
			settings = {
				pollingRate: 1000,
				enableNotifications: true,
				enableSounds: false,
				defaultTheme: 'dark-space',
				autoSave: true,
				showAnimations: true,
				compactMode: false,
				debugMode: false
			}
			saveSettings()
		}
	}

	function exportData() {
		const exportData = {
			settings,
			dashboard: JSON.parse(localStorage.getItem('sensecanvas-dashboard') || '{}'),
			alerts: JSON.parse(localStorage.getItem('sensecanvas-alerts') || '[]'),
			theme: localStorage.getItem('sensecanvas-theme'),
			title: localStorage.getItem('sensecanvas-title'),
			subtitle: localStorage.getItem('sensecanvas-subtitle')
		}

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: 'application/json'
		})
		const url = URL.createObjectURL(blob)
		
		const a = document.createElement('a')
		a.href = url
		a.download = `sensecanvas-backup-${new Date().toISOString().split('T')[0]}.json`
		a.click()
		
		URL.revokeObjectURL(url)
	}

	function importData() {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = '.json'
		
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0]
			if (!file) return

			const reader = new FileReader()
			reader.onload = (e) => {
				try {
					const importData = JSON.parse(e.target?.result as string)
					
					if (confirm('Import data? This will overwrite your current configuration.')) {
						// Import all data
						if (importData.settings) {
							settings = importData.settings
							localStorage.setItem('sensecanvas-settings', JSON.stringify(settings))
						}
						if (importData.dashboard) {
							localStorage.setItem('sensecanvas-dashboard', JSON.stringify(importData.dashboard))
						}
						if (importData.alerts) {
							localStorage.setItem('sensecanvas-alerts', JSON.stringify(importData.alerts))
						}
						if (importData.theme) {
							localStorage.setItem('sensecanvas-theme', importData.theme)
						}
						if (importData.title) {
							localStorage.setItem('sensecanvas-title', importData.title)
						}
						if (importData.subtitle) {
							localStorage.setItem('sensecanvas-subtitle', importData.subtitle)
						}
						
						location.reload()
					}
				} catch (error) {
					alert('Invalid backup file format.')
				}
			}
			reader.readAsText(file)
		}
		
		input.click()
	}

	onDestroy(() => {
		if (saveTimeoutId) {
			clearTimeout(saveTimeoutId)
		}
	})

	// Auto-save settings when changed (debounced)
	$: if (settings && typeof window !== 'undefined') {
		if (saveTimeoutId) {
			clearTimeout(saveTimeoutId)
		}
		saveTimeoutId = setTimeout(saveSettings, 500)
	}
</script>

<div class="settings-panel">
	<div class="panel-section">
		<div class="section-header">
			<Database size={16} />
			<h4>Data & Performance</h4>
		</div>
		
		<div class="setting-group">
			<label for="polling-rate">Sensor Polling Rate</label>
			<div class="setting-control">
				<input
					id="polling-rate"
					type="range"
					min="100"
					max="5000"
					step="100"
					bind:value={settings.pollingRate}
					class="range-input"
				/>
				<span class="range-value">{settings.pollingRate}ms</span>
			</div>
			<p class="setting-hint">How often to update sensor data. Lower values use more CPU.</p>
		</div>

		<div class="setting-group">
			<div class="checkbox-setting">
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={settings.autoSave}
					/>
					<span class="checkmark"></span>
					Auto-save dashboard changes
				</label>
			</div>
		</div>

		<div class="setting-group">
			<div class="checkbox-setting">
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={settings.debugMode}
					/>
					<span class="checkmark"></span>
					Enable debug mode
				</label>
			</div>
			<p class="setting-hint">Shows additional debugging information in the browser console.</p>
		</div>
	</div>

	<div class="panel-section">
		<div class="section-header">
			<Zap size={16} />
			<h4>Notifications & UI</h4>
		</div>
		
		<div class="setting-group">
			<div class="checkbox-setting">
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={settings.enableNotifications}
					/>
					<span class="checkmark"></span>
					Enable browser notifications
				</label>
			</div>
		</div>

		<div class="setting-group">
			<div class="checkbox-setting">
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={settings.enableSounds}
					/>
					<span class="checkmark"></span>
					Enable alert sounds
				</label>
			</div>
		</div>

		<div class="setting-group">
			<div class="checkbox-setting">
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={settings.showAnimations}
					/>
					<span class="checkmark"></span>
					Enable animations
				</label>
			</div>
		</div>

		<div class="setting-group">
			<div class="checkbox-setting">
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={settings.compactMode}
					/>
					<span class="checkmark"></span>
					Compact mode
				</label>
			</div>
			<p class="setting-hint">Reduces padding and spacing for more widgets on screen.</p>
		</div>
		
		<div class="setting-group">
			<label for="default-theme">Default Theme</label>
			<select 
				id="default-theme" 
				class="input"
				bind:value={settings.defaultTheme}
			>
				{#each theme.themes as themeOption}
					<option value={themeOption.id}>
						{themeOption.name}
					</option>
				{/each}
			</select>
			<p class="setting-hint">Theme to use when the application starts.</p>
		</div>
	</div>

	<div class="panel-section">
		<div class="section-header">
			<Settings size={16} />
			<h4>Backup & Restore</h4>
		</div>
		
		<div class="setting-group">
			<div class="backup-controls">
				<button class="btn btn-secondary" on:click={exportData}>
					Export Configuration
				</button>
				<button class="btn btn-secondary" on:click={importData}>
					Import Configuration
				</button>
			</div>
			<p class="setting-hint">
				Export includes dashboards, layouts, alerts, and settings.
			</p>
		</div>

		<div class="setting-group">
			<button class="btn btn-danger" on:click={resetSettings}>
				Reset All Settings
			</button>
			<p class="setting-hint warning">
				This will reset all settings to their default values.
			</p>
		</div>
	</div>
</div>

<style>
	.settings-panel {
		padding: 20px;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
		color: var(--text-primary);
	}

	.section-header h4 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 8px;
		flex: 1;
	}

	.setting-group {
		margin-bottom: 20px;
	}

	.setting-group label {
		display: block;
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
		margin-bottom: 8px;
	}

	.setting-control {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 4px;
	}

	.range-input {
		flex: 1;
		height: 6px;
		background: var(--bg-secondary);
		border-radius: 3px;
		outline: none;
		-webkit-appearance: none;
	}

	.range-input::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--accent-primary);
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.range-input::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--accent-primary);
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.range-value {
		font-size: 12px;
		font-weight: 600;
		color: var(--accent-primary);
		font-family: monospace;
		min-width: 50px;
		text-align: right;
	}

	.checkbox-setting {
		margin-bottom: 4px;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 14px;
		color: var(--text-primary);
		font-weight: normal;
		margin-bottom: 0;
	}

	.checkbox-label input[type="checkbox"] {
		appearance: none;
		width: 18px;
		height: 18px;
		border: 2px solid var(--border-color);
		border-radius: 4px;
		position: relative;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.checkbox-label input[type="checkbox"]:checked {
		background: var(--accent-primary);
		border-color: var(--accent-primary);
	}

	.checkbox-label input[type="checkbox"]:checked::after {
		content: '✓';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	.setting-hint {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.4;
		margin: 4px 0 0 0;
	}

	.setting-hint.warning {
		color: var(--warning);
	}

	.backup-controls {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 8px;
	}

	.btn-danger {
		background: var(--error);
		color: white;
		border: 1px solid var(--error);
	}

	.btn-danger:hover {
		background: #dc2626;
		border-color: #dc2626;
	}
</style>