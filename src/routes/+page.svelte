<script lang="ts">
	import { onMount } from 'svelte'
	import Header from '$lib/components/Header.svelte'
	import LeftToolbar from '$lib/components/LeftToolbar.svelte'
	import DashboardCanvas from '$lib/components/DashboardCanvas.svelte'
	import { dashboardStore } from '$lib/stores/dashboardStore'
	import { dataStore } from '$lib/stores/dataStore'
	import { themeStore } from '$lib/stores/themeStore'

	let mounted = false

	onMount(() => {
		// Initialize all stores
		dashboardStore.init()
		themeStore.init()
		
		// Start data polling
		dataStore.startPolling()
		
		mounted = true
		
		// Cleanup on unmount
		return () => {
			dataStore.stopPolling()
		}
	})
</script>

{#if mounted}
	<div class="app-layout">
		<Header />
		
		<div class="main-content">
			<LeftToolbar />
			<DashboardCanvas />
		</div>
	</div>
{:else}
	<div class="loading-screen">
		<div class="loading-content">
			<div class="loading-spinner"></div>
			<h2>SenseCanvas</h2>
			<p>Loading dashboard...</p>
		</div>
	</div>
{/if}

<style>
	.app-layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: var(--bg-primary);
		overflow: hidden;
	}

	.main-content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.loading-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background: var(--bg-primary);
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		text-align: center;
	}

	.loading-content h2 {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		color: var(--text-primary);
	}

	.loading-content p {
		margin: 0;
		font-size: 14px;
		color: var(--text-secondary);
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--bg-secondary);
		border-top: 3px solid var(--accent-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>