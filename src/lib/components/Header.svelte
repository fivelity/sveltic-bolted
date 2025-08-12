<script lang="ts">
	import { onMount } from 'svelte'
	import { Search, Grid, Layers, Settings, Palette, MoreHorizontal, Command } from 'lucide-svelte'
	import { dashboardStore } from '$lib/stores/dashboardStore'
	import { themeStore } from '$lib/stores/themeStore'
	import CommandPalette from './CommandPalette.svelte'
	import Modal from './Modal.svelte'
	import ThemeSelector from './ThemeSelector.svelte'
	import AboutModal from './modals/AboutModal.svelte'
	import HelpModal from './modals/HelpModal.svelte'

	let title = 'SenseCanvas'
	let subtitle = 'Hardware Monitoring Dashboard'
	let isEditingTitle = false
	let isEditingSubtitle = false
	let showCommandPalette = false
	let showThemeSelector = false
	let showMoreMenu = false
	let showAboutModal = false
	let showHelpModal = false

	$: dashboard = $dashboardStore
	$: theme = $themeStore

	// Keyboard shortcuts
	onMount(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.ctrlKey && e.shiftKey && e.key === 'P') {
				e.preventDefault()
				showCommandPalette = true
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		
		// Load persisted title/subtitle
		const savedTitle = localStorage.getItem('sensecanvas-title')
		const savedSubtitle = localStorage.getItem('sensecanvas-subtitle')
		if (savedTitle) title = savedTitle
		if (savedSubtitle) subtitle = savedSubtitle

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	})

	function saveTitle() {
		localStorage.setItem('sensecanvas-title', title)
		isEditingTitle = false
	}

	function saveSubtitle() {
		localStorage.setItem('sensecanvas-subtitle', subtitle)
		isEditingSubtitle = false
	}

	function handleTitleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault()
			saveTitle()
		} else if (e.key === 'Escape') {
			isEditingTitle = false
		}
	}

	function handleSubtitleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault()
			saveSubtitle()
		} else if (e.key === 'Escape') {
			isEditingSubtitle = false
		}
	}

	// Close dropdowns when clicking outside
	function handleClickOutside() {
		showThemeSelector = false
		showMoreMenu = false
	}
</script>

<svelte:window on:click={handleClickOutside} />

<header class="header glass">
	<div class="header-left">
		<div class="title-section">
			{#if isEditingTitle}
				<input
					bind:value={title}
					on:blur={saveTitle}
					on:keydown={handleTitleKeyDown}
					class="title-input"
					maxlength="50"
					autofocus
				/>
			{:else}
				<h1 on:click={() => isEditingTitle = true} class="title">
					{title}
				</h1>
			{/if}
			
			{#if isEditingSubtitle}
				<input
					bind:value={subtitle}
					on:blur={saveSubtitle}
					on:keydown={handleSubtitleKeyDown}
					class="subtitle-input"
					maxlength="100"
					autofocus
				/>
			{:else}
				<p on:click={() => isEditingSubtitle = true} class="subtitle">
					{subtitle}
				</p>
			{/if}
		</div>
	</div>

	<div class="header-center">
		<div class="search-bar" on:click={() => showCommandPalette = true}>
			<Command size={16} />
			<span>Search or run command...</span>
			<div class="hotkey">
				<span>Ctrl</span>
				<span>Shift</span>
				<span>P</span>
			</div>
		</div>
	</div>

	<div class="header-right">
		<button
			class="control-btn {dashboard.snapToGrid ? 'active' : ''}"
			on:click={() => dashboardStore.toggleSnap()}
			title="Toggle Snap to Grid"
		>
			<Grid size={18} />
		</button>

		<button
			class="control-btn {dashboard.showGrid ? 'active' : ''}"
			on:click={() => dashboardStore.toggleGrid()}
			title="Toggle Grid Visibility"
		>
			<Layers size={18} />
		</button>

		<div class="theme-dropdown">
			<button
				class="control-btn"
				on:click={() => showThemeSelector = !showThemeSelector}
				title="Change Theme"
			>
				<Palette size={18} />
			</button>
			
			{#if showThemeSelector}
				<div on:click|stopPropagation>
					<ThemeSelector bind:show={showThemeSelector} />
				</div>
			{/if}
		</div>

		<div class="more-dropdown">
			<button
				class="control-btn"
				on:click={() => showMoreMenu = !showMoreMenu}
				title="More Options"
			>
				<MoreHorizontal size={18} />
			</button>
			
			{#if showMoreMenu}
				<div class="dropdown-menu glass" on:click|stopPropagation={() => showMoreMenu = false}>
					<button on:click={() => showAboutModal = true}>
						About SenseCanvas
					</button>
					<button on:click={() => showHelpModal = true}>
						Help & Shortcuts
					</button>
				</div>
			{/if}
		</div>
	</div>
</header>

{#if showCommandPalette}
	<CommandPalette bind:show={showCommandPalette} />
{/if}

{#if showAboutModal}
	<Modal bind:show={showAboutModal}>
		<AboutModal />
	</Modal>
{/if}

{#if showHelpModal}
	<Modal bind:show={showHelpModal}>
		<HelpModal />
	</Modal>
{/if}

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 24px;
		height: 70px;
		border-bottom: 1px solid var(--border-color);
		backdrop-filter: blur(12px);
		position: relative;
		z-index: 100;
	}

	.header-left {
		flex: 1;
		min-width: 0;
	}

	.title-section {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.title {
		font-size: 1.25rem; /* text-xl */
		font-weight: 600; /* font-semibold */
		color: var(--text-primary);
		cursor: pointer;
		margin: 0;
		transition: opacity 0.2s ease;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 300px;
	}

	.title:hover {
		opacity: 0.8;
	}

	.subtitle {
		font-size: 12px;
		color: var(--text-secondary);
		cursor: pointer;
		margin: 0;
		transition: opacity 0.2s ease;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 300px;
	}

	.subtitle:hover {
		opacity: 0.8;
	}

	.title-input,
	.subtitle-input {
		background: var(--bg-secondary);
		border: 1px solid var(--accent-primary);
		border-radius: 6px;
		padding: 4px 8px;
		color: var(--text-primary);
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
	}

	.title-input {
		font-size: 20px;
		font-weight: 700;
	}

	.subtitle-input {
		font-size: 12px;
	}

	.header-center {
		flex: 1;
		display: flex;
		justify-content: center;
		max-width: 400px;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 16px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 20px;
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
		max-width: 350px;
	}

	.search-bar:hover {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.08);
	}

	.search-bar:focus-within {
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 1px var(--accent-primary);
	}

	.search-bar span {
		color: rgba(255, 255, 255, 0.4);
		font-size: 14px;
		flex: 1;
	}

	.hotkey {
		display: flex;
		gap: 2px;
	}

	.hotkey span {
		padding: 2px 6px;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		font-size: 10px;
		color: var(--text-secondary);
		font-family: monospace;
		min-width: auto;
		flex: none;
	}

	.header-right {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 8px;
	}

	.control-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.control-btn:hover {
		background: var(--bg-widget);
		color: var(--text-primary);
		border-color: var(--accent-primary);
	}

	.control-btn.active {
		background: var(--accent-primary);
		color: white;
		border-color: var(--accent-primary);
	}

	.theme-dropdown,
	.more-dropdown {
		position: relative;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		min-width: 180px;
		border-radius: 8px;
		border: 1px solid var(--border-color);
		overflow: hidden;
		z-index: 1000;
	}

	.dropdown-menu button {
		width: 100%;
		padding: 12px 16px;
		background: transparent;
		border: none;
		color: var(--text-primary);
		text-align: left;
		cursor: pointer;
		transition: background 0.2s ease;
		font-family: inherit;
		font-size: 14px;
	}

	.dropdown-menu button:hover {
		background: var(--bg-widget);
	}

	@media (max-width: 768px) {
		.header {
			padding: 8px 12px;
			height: 60px;
		}

		.header-center {
			max-width: 200px;
		}

		.search-bar {
			padding: 6px 12px;
			border-radius: 16px;
		}

		.hotkey {
			display: none;
		}

		.title {
			font-size: 16px;
			max-width: 150px;
		}

		.subtitle {
			font-size: 11px;
			max-width: 150px;
		}
	}
</style>