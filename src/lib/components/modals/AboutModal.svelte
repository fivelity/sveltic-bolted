<script lang="ts">
	import { Monitor, Zap, Layers, Palette } from 'lucide-svelte'
</script>

<div class="about-modal">
	<div class="modal-header">
		<div class="app-icon">
			<Monitor size={32} />
		</div>
		<div class="app-info">
			<h2>SenseCanvas</h2>
			<p class="version">Version 1.0.0</p>
		</div>
	</div>

	<div class="modal-body">
		<p class="description">
			SenseCanvas is a premium PC hardware monitoring dashboard with advanced customization capabilities.
			Built with modern web technologies for superior performance and user experience.
		</p>

		<div class="features-grid">
			<div class="feature-item">
				<div class="feature-icon">
					<Zap size={20} />
				</div>
				<div class="feature-info">
					<h4>Real-time Monitoring</h4>
					<p>Live hardware metrics with customizable polling rates</p>
				</div>
			</div>

			<div class="feature-item">
				<div class="feature-icon">
					<Layers size={20} />
				</div>
				<div class="feature-info">
					<h4>Advanced Widgets</h4>
					<p>Gauges, charts, and displays with rich customization</p>
				</div>
			</div>

			<div class="feature-item">
				<div class="feature-icon">
					<Palette size={20} />
				</div>
				<div class="feature-info">
					<h4>Glassmorphism Design</h4>
					<p>Beautiful themes with smooth animations and effects</p>
				</div>
			</div>

			<div class="feature-item">
				<div class="feature-icon">
					<Monitor size={20} />
				</div>
				<div class="feature-info">
					<h4>Professional Grade</h4>
					<p>Production-ready with complete data persistence</p>
				</div>
			</div>
		</div>

		<div class="tech-stack">
			<h4>Built With</h4>
			<div class="tech-badges">
				<span class="tech-badge">Svelte 5</span>
				<span class="tech-badge">SvelteKit</span>
				<span class="tech-badge">TypeScript</span>
				<span class="tech-badge">CSS Custom Properties</span>
			</div>
		</div>

		<div class="credits">
			<p>
				<strong>Developer:</strong> AI Assistant powered by Claude Sonnet 4<br>
				<strong>Design:</strong> Modern glassmorphism with Inter font<br>
				<strong>Performance:</strong> 60fps animations with requestAnimationFrame
			</p>
		</div>
	</div>
</div>

<style>
	.about-modal {
		color: var(--text-primary);
	}

	.modal-header {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border-color);
	}

	.app-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background: var(--accent-primary);
		color: white;
		border-radius: 12px;
	}

	.app-info h2 {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		color: var(--text-primary);
	}

	.version {
		margin: 4px 0 0 0;
		font-size: 14px;
		color: var(--text-secondary);
	}

	.modal-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.description {
		font-size: 16px;
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}

	.feature-item {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.feature-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: var(--accent-primary);
		color: white;
		border-radius: 6px;
		flex-shrink: 0;
	}

	.feature-info h4 {
		margin: 0 0 4px 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.feature-info p {
		margin: 0;
		font-size: 13px;
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.tech-stack h4 {
		margin: 0 0 12px 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.tech-badges {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.tech-badge {
		padding: 4px 12px;
		background: var(--accent-primary);
		color: white;
		font-size: 12px;
		font-weight: 500;
		border-radius: 16px;
	}

	.credits {
		padding: 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.credits p {
		margin: 0;
		font-size: 13px;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.credits strong {
		color: var(--text-primary);
	}
</style>