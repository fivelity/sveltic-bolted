<script lang="ts">
	import { Plus, Play, Pause, Trash2, Bell } from 'lucide-svelte'
	import { dataSources } from '$lib/stores/dataStore'
	import type { AlertRule } from '$lib/types'

	$: sources = dataSources

	let alerts: AlertRule[] = []
	let showCreateDialog = false
	let newAlert: Partial<AlertRule> = {
		name: '',
		dataSource: 'cpu-temp',
		condition: 'greater',
		threshold: 75,
		action: 'notification',
		enabled: true
	}

	// Load alerts from localStorage
	function loadAlerts() {
		const saved = localStorage.getItem('sensecanvas-alerts')
		if (saved) {
			try {
				alerts = JSON.parse(saved)
			} catch (e) {
				console.error('Failed to load alerts:', e)
			}
		}
	}

	// Save alerts to localStorage
	function saveAlerts() {
		localStorage.setItem('sensecanvas-alerts', JSON.stringify(alerts))
	}

	function createAlert() {
		if (!newAlert.name?.trim()) return

		const alert: AlertRule = {
			id: `alert-${Date.now()}`,
			name: newAlert.name.trim(),
			dataSource: newAlert.dataSource || 'cpu-temp',
			condition: newAlert.condition || 'greater',
			threshold: newAlert.threshold || 75,
			action: newAlert.action || 'notification',
			enabled: true
		}

		alerts = [...alerts, alert]
		saveAlerts()
		
		// Reset form
		newAlert = {
			name: '',
			dataSource: 'cpu-temp',
			condition: 'greater',
			threshold: 75,
			action: 'notification',
			enabled: true
		}
		showCreateDialog = false
	}

	function toggleAlert(id: string) {
		alerts = alerts.map(alert =>
			alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
		)
		saveAlerts()
	}

	function deleteAlert(id: string) {
		const alert = alerts.find(a => a.id === id)
		if (alert && confirm(`Delete alert "${alert.name}"?`)) {
			alerts = alerts.filter(a => a.id !== id)
			saveAlerts()
		}
	}

	// Initialize
	loadAlerts()
</script>

<div class="alerts-panel">
	<div class="panel-section">
		<div class="create-section">
			{#if !showCreateDialog}
				<button class="btn btn-primary w-full" on:click={() => showCreateDialog = true}>
					<Plus size={16} />
					Create Alert Rule
				</button>
			{:else}
				<div class="create-dialog glass">
					<h5>Create Alert Rule</h5>
					
					<div class="form-group">
						<label for="alert-name">Alert Name</label>
						<input
							id="alert-name"
							type="text"
							class="input"
							placeholder="e.g., High CPU Temperature"
							bind:value={newAlert.name}
						/>
					</div>

					<div class="form-group">
						<label for="alert-source">Data Source</label>
						<select id="alert-source" class="input" bind:value={newAlert.dataSource}>
							{#each sources as source}
								<option value={source.id}>
									{source.name} ({source.unit})
								</option>
							{/each}
						</select>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="alert-condition">Condition</label>
							<select id="alert-condition" class="input" bind:value={newAlert.condition}>
								<option value="greater">Greater than</option>
								<option value="less">Less than</option>
								<option value="equal">Equal to</option>
							</select>
						</div>
						<div class="form-group">
							<label for="alert-threshold">Threshold</label>
							<input
								id="alert-threshold"
								type="number"
								class="input"
								bind:value={newAlert.threshold}
								step="0.1"
							/>
						</div>
					</div>

					<div class="form-group">
						<label for="alert-action">Action</label>
						<select id="alert-action" class="input" bind:value={newAlert.action}>
							<option value="notification">Browser Notification</option>
							<option value="sound">Play Sound</option>
							<option value="email">Send Email</option>
						</select>
					</div>

					<div class="dialog-actions">
						<button class="btn btn-secondary" on:click={() => showCreateDialog = false}>
							Cancel
						</button>
						<button 
							class="btn btn-primary"
							disabled={!newAlert.name?.trim()}
							on:click={createAlert}
						>
							Create Alert
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="panel-section">
		<h4>Alert Rules ({alerts.length})</h4>
		
		{#if alerts.length === 0}
			<div class="empty-state">
				<div class="empty-icon">
					<Bell size={32} />
				</div>
				<p>No alert rules configured</p>
				<p class="hint">Create alert rules to get notified when metrics exceed your defined thresholds.</p>
			</div>
		{:else}
			<div class="alerts-list">
				{#each alerts as alert}
					<div class="alert-card glass {alert.enabled ? 'enabled' : 'disabled'}">
						<div class="alert-info">
							<div class="alert-name">{alert.name}</div>
							<div class="alert-condition">
								{sources.find(s => s.id === alert.dataSource)?.name}
								{alert.condition} {alert.threshold}
								{sources.find(s => s.id === alert.dataSource)?.unit}
							</div>
							<div class="alert-action">
								Action: {alert.action.replace('-', ' ')}
								{#if alert.lastTriggered}
									<span class="last-triggered">
										Last: {new Date(alert.lastTriggered).toLocaleTimeString()}
									</span>
								{/if}
							</div>
						</div>
						
						<div class="alert-controls">
							<button
								class="control-btn {alert.enabled ? 'pause' : 'play'}"
								on:click={() => toggleAlert(alert.id)}
								title={alert.enabled ? 'Pause Alert' : 'Enable Alert'}
							>
								{#if alert.enabled}
									<Pause size={14} />
								{:else}
									<Play size={14} />
								{/if}
							</button>
							<button
								class="control-btn delete"
								on:click={() => deleteAlert(alert.id)}
								title="Delete Alert"
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
	.alerts-panel {
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

	.create-section {
		padding: 16px;
		background: var(--bg-secondary);
		border-radius: 8px;
		border: 1px solid var(--border-color);
	}

	.create-dialog {
		padding: 20px;
		border-radius: 12px;
		border: 1px solid var(--border-color);
	}

	.create-dialog h5 {
		margin: 0 0 16px 0;
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 16px;
	}

	.form-row {
		display: flex;
		gap: 12px;
	}

	.form-row .form-group {
		flex: 1;
		margin-bottom: 16px;
	}

	label {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.dialog-actions {
		display: flex;
		gap: 8px;
		justify-content: flex-end;
		margin-top: 20px;
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

	.alerts-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.alert-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		transition: all 0.2s ease;
	}

	.alert-card.enabled {
		border-left: 4px solid var(--success);
	}

	.alert-card.disabled {
		border-left: 4px solid var(--text-muted);
		opacity: 0.7;
	}

	.alert-info {
		flex: 1;
		min-width: 0;
	}

	.alert-name {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 4px;
	}

	.alert-condition {
		font-size: 13px;
		color: var(--text-secondary);
		margin-bottom: 4px;
		font-family: monospace;
	}

	.alert-action {
		font-size: 12px;
		color: var(--text-muted);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.last-triggered {
		font-size: 11px;
		color: var(--warning);
		padding: 1px 4px;
		background: rgba(245, 158, 11, 0.1);
		border-radius: 3px;
	}

	.alert-controls {
		display: flex;
		gap: 4px;
		flex-shrink: 0;
	}

	.control-btn {
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

	.control-btn:hover {
		background: var(--bg-widget);
	}

	.control-btn.play {
		color: var(--success);
	}

	.control-btn.play:hover {
		border-color: var(--success);
		background: rgba(16, 185, 129, 0.1);
	}

	.control-btn.pause {
		color: var(--warning);
	}

	.control-btn.pause:hover {
		border-color: var(--warning);
		background: rgba(245, 158, 11, 0.1);
	}

	.control-btn.delete {
		color: var(--error);
	}

	.control-btn.delete:hover {
		border-color: var(--error);
		background: rgba(239, 68, 68, 0.1);
	}
</style>