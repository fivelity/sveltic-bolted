<script lang="ts">
	import { Keyboard, HelpCircle, BookOpen } from 'lucide-svelte'

	let activeTab: 'usage' | 'faq' | 'shortcuts' = 'usage'

	const shortcuts = [
		{ key: 'Ctrl + Shift + P', description: 'Open command palette' },
		{ key: 'Click + Drag', description: 'Move widgets around dashboard' },
		{ key: 'Right Click', description: 'Open widget context menu' },
		{ key: 'Escape', description: 'Close modals and dialogs' },
		{ key: 'Enter', description: 'Confirm edits and actions' },
		{ key: '↑↓ Arrow Keys', description: 'Navigate command palette' }
	]

	const faqs = [
		{
			question: 'How do I add widgets to my dashboard?',
			answer: 'Click the + icon in the left toolbar to open the widget library, then select the type of widget you want to add. You can also use the command palette (Ctrl+Shift+P) and search for "Add".'
		},
		{
			question: 'Can I customize widget colors and appearance?',
			answer: 'Yes! Select any widget and click the edit icon in the left toolbar. You can change colors, sizes, data sources, and various display options with live preview updates.'
		},
		{
			question: 'How do I save my dashboard layout?',
			answer: 'Open the layouts panel from the left toolbar and click "Save Current Layout". You can create multiple layouts and switch between them anytime.'
		},
		{
			question: 'What data sources are available?',
			answer: 'SenseCanvas simulates various hardware metrics including CPU temperature/usage, GPU temperature/usage, memory usage, disk usage, and network speeds with realistic fluctuations.'
		},
		{
			question: 'How do I set up alerts?',
			answer: 'Open the alerts panel and create rules based on metric thresholds. You can set up browser notifications, sounds, or email alerts when conditions are met.'
		},
		{
			question: 'Can I backup my dashboard configuration?',
			answer: 'Yes! Go to Settings → Backup & Restore to export your complete configuration including layouts, themes, and alert rules to a JSON file.'
		}
	]
</script>

<div class="help-modal">
	<div class="modal-header">
		<h2>Help & Support</h2>
		<p>Everything you need to know about using SenseCanvas</p>
	</div>

	<div class="tab-navigation">
		<button
			class="tab-btn {activeTab === 'usage' ? 'active' : ''}"
			on:click={() => activeTab = 'usage'}
		>
			<BookOpen size={16} />
			How to Use
		</button>
		<button
			class="tab-btn {activeTab === 'faq' ? 'active' : ''}"
			on:click={() => activeTab = 'faq'}
		>
			<HelpCircle size={16} />
			FAQ
		</button>
		<button
			class="tab-btn {activeTab === 'shortcuts' ? 'active' : ''}"
			on:click={() => activeTab = 'shortcuts'}
		>
			<Keyboard size={16} />
			Shortcuts
		</button>
	</div>

	<div class="tab-content">
		{#if activeTab === 'usage'}
			<div class="usage-guide">
				<div class="guide-section">
					<h3>Getting Started</h3>
					<ol>
						<li><strong>Add Widgets:</strong> Click the + icon in the left toolbar to browse available widget types</li>
						<li><strong>Customize:</strong> Select any widget and use the editor panel to modify appearance and data sources</li>
						<li><strong>Arrange:</strong> Drag widgets around the dashboard. Use snap-to-grid for precise alignment</li>
						<li><strong>Save Layouts:</strong> Create multiple dashboard configurations in the layouts panel</li>
					</ol>
				</div>

				<div class="guide-section">
					<h3>Widget Types</h3>
					<ul>
						<li><strong>Gauge:</strong> Circular progress indicator perfect for temperature and usage percentages</li>
						<li><strong>Line Chart:</strong> Time-series visualization showing metric trends over time</li>
						<li><strong>Bar Chart:</strong> Horizontal or vertical bars for comparative data display</li>
						<li><strong>Text Display:</strong> Large numeric displays with customizable styling</li>
					</ul>
				</div>

				<div class="guide-section">
					<h3>Advanced Features</h3>
					<ul>
						<li><strong>Command Palette:</strong> Press Ctrl+Shift+P for quick access to all functions</li>
						<li><strong>Theme System:</strong> Four carefully crafted themes with instant switching</li>
						<li><strong>Alert Rules:</strong> Set up conditional notifications for critical thresholds</li>
						<li><strong>Data Export:</strong> Backup and restore your complete configuration</li>
					</ul>
				</div>
			</div>

		{:else if activeTab === 'faq'}
			<div class="faq-list">
				{#each faqs as faq}
					<div class="faq-item">
						<h4>{faq.question}</h4>
						<p>{faq.answer}</p>
					</div>
				{/each}
			</div>

		{:else if activeTab === 'shortcuts'}
			<div class="shortcuts-list">
				{#each shortcuts as shortcut}
					<div class="shortcut-item">
						<div class="shortcut-key">{shortcut.key}</div>
						<div class="shortcut-description">{shortcut.description}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.help-modal {
		color: var(--text-primary);
		max-width: 700px;
	}

	.modal-header {
		margin-bottom: 24px;
		text-align: center;
	}

	.modal-header h2 {
		margin: 0 0 8px 0;
		font-size: 24px;
		font-weight: 700;
		color: var(--text-primary);
	}

	.modal-header p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 14px;
	}

	.tab-navigation {
		display: flex;
		gap: 4px;
		margin-bottom: 24px;
		background: var(--bg-secondary);
		padding: 4px;
		border-radius: 8px;
	}

	.tab-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		flex: 1;
		padding: 8px 16px;
		background: transparent;
		border: none;
		border-radius: 6px;
		color: var(--text-secondary);
		font-family: inherit;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab-btn:hover {
		background: var(--bg-widget);
		color: var(--text-primary);
	}

	.tab-btn.active {
		background: var(--accent-primary);
		color: white;
	}

	.tab-content {
		min-height: 300px;
	}

	.usage-guide {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.guide-section h3 {
		margin: 0 0 12px 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--text-primary);
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 6px;
	}

	.guide-section ol,
	.guide-section ul {
		margin: 0;
		padding-left: 20px;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.guide-section li {
		margin-bottom: 8px;
	}

	.guide-section strong {
		color: var(--text-primary);
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.faq-item {
		padding: 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.faq-item h4 {
		margin: 0 0 8px 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.faq-item p {
		margin: 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.shortcuts-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.shortcut-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
	}

	.shortcut-key {
		font-family: monospace;
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-primary);
		background: var(--bg-widget);
		padding: 6px 10px;
		border-radius: 6px;
		border: 1px solid var(--border-color);
		min-width: 140px;
		text-align: center;
	}

	.shortcut-description {
		flex: 1;
		color: var(--text-secondary);
		font-size: 14px;
		line-height: 1.4;
	}

	@media (max-width: 768px) {
		.shortcut-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}
		
		.shortcut-key {
			min-width: auto;
			width: 100%;
		}
	}
</style>