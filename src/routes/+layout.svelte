<script lang="ts">
	import '../app.css'
	import { onMount } from 'svelte'

	let mounted = false

	onMount(() => {
		mounted = true
		
		// Load theme from localStorage
		const savedTheme = localStorage.getItem('sensecanvas-theme') || 'dark-space'
		document.body.setAttribute('data-theme', savedTheme)
	})
</script>

<main class="app-container">
	{#if mounted}
		<slot />
	{/if}
</main>

<style>
	.app-container {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: var(--bg-primary);
	}
</style>