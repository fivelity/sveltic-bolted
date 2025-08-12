<script lang="ts">
	import { onMount, tick } from 'svelte'
	import { Search, Plus, Settings, Palette, Grid, Layers } from 'lucide-svelte'
	import { dashboardStore } from '$lib/stores/dashboardStore'
	import { themeStore } from '$lib/stores/themeStore'

	export let show = false

	let searchInput: HTMLInputElement
	let query = ''
	let selectedIndex = 0
	
	$: commands = getCommands(query)
	$: filteredCommands = commands.filter(cmd => 
		cmd.name.toLowerCase().includes(query.toLowerCase()) ||
		cmd.description.toLowerCase().includes(query.toLowerCase())
	)

	onMount(() => {
		if (show && searchInput) {
			tick().then(() => searchInput?.focus())
		}
	})

	function getCommands(query: string) {
		return [
			{
				id: 'add-gauge',
				name: 'Add Gauge Widget',
				description: 'Create a new gauge widget',
				icon: Plus,
				action: () => {
					dashboardStore.addWidget('gauge')
					close()
				}
			},
			{
				id: 'add-chart',
				name: 'Add Line Chart',
				description: 'Create a new line chart widget',
				icon: Plus,
				action: () => {
					dashboardStore.addWidget('line-chart')
					close()
				}
			},
			{
				id: 'add-bar',
				name: 'Add Bar Chart',
				description: 'Create a new bar chart widget',
				icon: Plus,
				action: () => {
					dashboardStore.addWidget('bar-chart')
					close()
				}
			},
			{
				id: 'add-text',
				name: 'Add Text Display',
				description: 'Create a new text display widget',
				icon: Plus,
				action: () => {
					dashboardStore.addWidget('text-display')
					close()
				}
			},
			{
				id: 'toggle-grid',
				name: 'Toggle Grid',
				description: 'Show/hide the dashboard grid',
				icon: Layers,
				action: () => {
					dashboardStore.toggleGrid()
					close()
				}
			},
			{
				id: 'toggle-snap',
				name: 'Toggle Snap to Grid',
				description: 'Enable/disable snap to grid',
				icon: Grid,
				action: () => {
					dashboardStore.toggleSnap()
					close()
				}
			},
			{
				id: 'open-settings',
				name: 'Open Settings',
				description: 'Open the settings panel',
				icon: Settings,
				action: () => {
					dashboardStore.toggleLeftPanel('settings')
					close()
				}
			},
			{
				id: 'theme-dark',
				name: 'Dark Space Theme',
				description: 'Switch to Dark Space theme',
				icon: Palette,
				action: () => {
					themeStore.setTheme('dark-space')
					close()
				}
			},
			{
				id: 'theme-light',
				name: 'Arctic Light Theme',
				description: 'Switch to Arctic Light theme',
				icon: Palette,
				action: () => {
					themeStore.setTheme('arctic-light')
					close()
				}
			},
			{
				id: 'theme-blue',
				name: 'Blue Tech Theme',
				description: 'Switch to Blue Tech theme',
				icon: Palette,
				action: () => {
					themeStore.setTheme('blue-tech')
					close()
				}
			},
			{
				id: 'theme-purple',
				name: 'Purple Pro Theme',
				description: 'Switch to Purple Pro theme',
				icon: Palette,
				action: () => {
					themeStore.setTheme('purple-pro')
					close()
				}
			},
			{
				id: 'start-polling',
				name: 'Start Data Polling',
				description: 'Begin collecting sensor data',
				icon: Search,
				action: () => {
					dashboardStore.startDataPolling()
					close()
				}
			},
			{
				id: 'stop-polling',
				name: 'Stop Data Polling',
				description: 'Pause sensor data collection',
				icon: Search,
				action: () => {
					dashboardStore.stopDataPolling()
					close()
				}
			},
			{
				id: 'save-layout',
				name: 'Save Current Layout',
				description: 'Save the current dashboard arrangement',
				icon: Settings,
				action: () => {
					dashboardStore.toggleLeftPanel('layouts')
					close()
				}
			}
		]
	}

	function handleKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault()
				selectedIndex = Math.min(selectedIndex + 1, filteredCommands.length - 1)
				break
			case 'ArrowUp':
				event.preventDefault()
				selectedIndex = Math.max(selectedIndex - 1, 0)
				break
			case 'Enter':
				event.preventDefault()
				if (filteredCommands[selectedIndex]) {
					filteredCommands[selectedIndex].action()
				}
				break
			case 'Escape':
				event.preventDefault()
				close()
				break
		}
	}

	function executeCommand(command: any) {
		command.action()
	}

	function close() {
		show = false
		query = ''
		selectedIndex = 0
	}

	$: if (show) {
		tick().then(() => searchInput?.focus())
	}
</script>

{#if show}
	<div class="command-palette-backdrop" on:click={close}>
		<div class="command-palette glass-intense" on:click|stopPropagation>
			<div class="search-section">
				<div class="search-input-container">
					<Search size={18} />
					<input
						bind:this={searchInput}
						bind:value={query}
						on:keydown={handleKeyDown}
						placeholder="Type a command or search..."
						class="search-input"
						autocomplete="off"
					/>
				</div>
			</div>

			<div class="commands-section">
				{#if filteredCommands.length > 0}
					{#each filteredCommands as command, index}
						<button
							class="command-item {index === selectedIndex ? 'selected' : ''}"
							on:click={() => executeCommand(command)}
							on:mouseenter={() => selectedIndex = index}
						>
							<div class="command-icon">
								<svelte:component this={command.icon} size={16} />
							</div>
							<div class="command-info">
								<div class="command-name">{command.name}</div>
								<div class="command-description">{command.description}</div>
							</div>
						</button>
					{/each}
				{:else}
					<div class="no-results">
						<p>No commands found for "{query}"</p>
					</div>
				{/if}
			</div>

			<div class="command-footer">
				<div class="shortcuts">
					<span class="shortcut">↑↓ Navigate</span>
					<span class="shortcut">↵ Execute</span>
					<span class="shortcut">Esc Close</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.command-palette-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: var(--bg-modal);
		backdrop-filter: blur(8px);
		z-index: 10000;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 15vh;
	}

	.command-palette {
		width: 100%;
		max-width: 600px;
		max-height: 60vh;
		background: var(--bg-widget);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.search-section {
		padding: 16px;
		border-bottom: 1px solid var(--border-color);
	}

	.search-input-container {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		transition: border-color 0.2s ease;
	}

	.search-input-container:focus-within {
		border-color: var(--accent-primary);
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: var(--text-primary);
		font-size: 16px;
		font-family: inherit;
	}

	.search-input::placeholder {
		color: var(--text-muted);
	}

	.commands-section {
		flex: 1;
		overflow-y: auto;
		max-height: 400px;
	}

	.command-item {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;
		padding: 12px 16px;
		background: transparent;
		border: none;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		border-left: 3px solid transparent;
	}

	.command-item:hover,
	.command-item.selected {
		background: var(--bg-secondary);
		border-left-color: var(--accent-primary);
	}

	.command-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--bg-secondary);
		border-radius: 6px;
		color: var(--accent-primary);
		flex-shrink: 0;
	}

	.command-item.selected .command-icon {
		background: var(--accent-primary);
		color: white;
	}

	.command-info {
		flex: 1;
		min-width: 0;
	}

	.command-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 2px;
	}

	.command-description {
		font-size: 12px;
		color: var(--text-secondary);
		line-height: 1.3;
	}

	.no-results {
		padding: 40px 20px;
		text-align: center;
		color: var(--text-muted);
	}

	.no-results p {
		margin: 0;
		font-size: 14px;
	}

	.command-footer {
		padding: 12px 16px;
		border-top: 1px solid var(--border-color);
		background: var(--bg-secondary);
	}

	.shortcuts {
		display: flex;
		gap: 16px;
		justify-content: center;
	}

	.shortcut {
		font-size: 11px;
		color: var(--text-muted);
		font-family: monospace;
		padding: 2px 6px;
		background: var(--bg-widget);
		border: 1px solid var(--border-color);
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.command-palette {
			max-width: 90vw;
			margin: 0 20px;
		}
	}
</style>