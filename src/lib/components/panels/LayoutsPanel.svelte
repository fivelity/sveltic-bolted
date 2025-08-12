<script lang="ts">
	import { Save, Download, Trash2, Plus } from 'lucide-svelte'
	import { dashboardStore } from '$lib/stores/dashboardStore'

	$: dashboard = $dashboardStore

	let newLayoutName = ''
	let showSaveDialog = false

	function saveCurrentLayout() {
		if (!newLayoutName.trim()) return
		
		dashboardStore.saveLayout(newLayoutName.trim())
		newLayoutName = ''
		showSaveDialog = false
	}

	function loadLayout(id: string) {
		if (confirm('Load this layout? Current widgets will be replaced.')) {
			dashboardStore.loadLayout(id)
		}
	}

	function deleteLayout(id: string, name: string) {
		if (confirm(`Delete layout "${name}"? This cannot be undone.`)) {
			dashboardStore.deleteLayout(id)
		}
	}
</script>

<div class="layouts-panel">
	<div class="panel-section">
		<div class="save-section">
			{#if !showSaveDialog}
				<button class="btn btn-primary w-full" on:click={() => showSaveDialog = true}>
					<Save size={16} />
					Save Current Layout
				</button>
			{:else}
				<div class="save-dialog">
					<input
						type="text"
						class="input"
						placeholder="Layout name"
						bind:value={newLayoutName}
						on:keydown={(e) => e.key === 'Enter' && saveCurrentLayout()}
						autofocus
					/>
					<div class="dialog-actions">
						<button class="btn btn-secondary" on:click={() => showSaveDialog = false}>
							Cancel
						</button>
						<button 
							class="btn btn-primary"
							disabled={!newLayoutName.trim()}
							on:click={saveCurrentLayout}
						>
							Save
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="panel-section">
		<h4>Saved Layouts</h4>
		
		{#if dashboard.layouts.length === 0}
			<div class="empty-state">
				<div class="empty-icon">
					<Plus size={32} />
				</div>
				<p>No saved layouts yet</p>
				<p class="hint">Save your current widget arrangement to quickly switch between different dashboard configurations.</p>
			</div>
		{:else}
			<div class="layouts-grid">
				{#each dashboard.layouts as layout}
					<div class="layout-card glass hover-lift">
						<div class="layout-preview">
							<div class="preview-widgets">
								{#each layout.widgets.slice(0, 6) as widget}
									<div 
										class="preview-widget"
										style="background: {widget.config.color || 'var(--accent-primary)'}40"
									></div>
								{/each}
							</div>
						</div>
						
						<div class="layout-info">
							<div class="layout-name">{layout.name}</div>
							<div class="layout-meta">
								{layout.widgets.length} widget{layout.widgets.length !== 1 ? 's' : ''}
								{#if layout.id === dashboard.currentLayoutId}
									<span class="current-badge">Current</span>
								{/if}
							</div>
							<div class="layout-date">
								{new Date(layout.createdAt).toLocaleDateString()}
							</div>
						</div>
						
						<div class="layout-actions">
							<button 
								class="action-btn load"
								on:click={() => loadLayout(layout.id)}
								title="Load Layout"
								disabled={layout.id === dashboard.currentLayoutId}
							>
								<Download size={14} />
							</button>
							<button 
								class="action-btn delete"
								on:click={() => deleteLayout(layout.id, layout.name)}
								title="Delete Layout"
							>
								<Trash2 size={14} />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.layouts-panel {
		padding: 20px;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.panel-section h4 {
		margin: 0 0 16px 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 8px;
	}

	.save-section {
		padding: 16px;
		background: var(--bg-secondary);
		border-radius: 8px;
		border: 1px solid var(--border-color);
	}

	.save-dialog {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.dialog-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 40px 20px;
		color: var(--text-secondary);
	}

	.empty-icon {
		width: 60px;
		height: 60px;
		background: var(--bg-secondary);
		border: 2px dashed var(--border-color);
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16px;
		color: var(--text-muted);
	}

	.empty-state p {
		margin: 0 0 8px 0;
		font-size: 14px;
	}

	.hint {
		font-size: 12px;
		color: var(--text-muted);
		line-height: 1.4;
	}

	.layouts-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.layout-card {
		display: flex;
		align-items: center;
		padding: 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		gap: 16px;
		transition: all 0.2s ease;
	}

	.layout-card:hover {
		border-color: var(--accent-primary);
		background: var(--bg-widget);
	}

	.layout-preview {
		width: 60px;
		height: 45px;
		background: var(--bg-widget);
		border-radius: 6px;
		border: 1px solid var(--border-color);
		padding: 6px;
		flex-shrink: 0;
	}

	.preview-widgets {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 2px;
		height: 100%;
	}

	.preview-widget {
		border-radius: 2px;
		opacity: 0.8;
	}

	.layout-info {
		flex: 1;
		min-width: 0;
	}

	.layout-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 4px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.layout-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--text-secondary);
		margin-bottom: 2px;
	}

	.current-badge {
		background: var(--accent-primary);
		color: white;
		padding: 2px 6px;
		border-radius: 10px;
		font-size: 10px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.layout-date {
		font-size: 11px;
		color: var(--text-muted);
	}

	.layout-actions {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn:hover {
		background: var(--bg-widget);
	}

	.action-btn.load {
		color: var(--success);
	}

	.action-btn.load:hover {
		border-color: var(--success);
		background: rgba(16, 185, 129, 0.1);
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn.delete {
		color: var(--error);
	}

	.action-btn.delete:hover {
		border-color: var(--error);
		background: rgba(239, 68, 68, 0.1);
	}
</style>