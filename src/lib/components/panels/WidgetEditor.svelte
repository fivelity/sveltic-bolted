<script lang="ts">
	import { onMount } from 'svelte'
	import { Save, Palette } from 'lucide-svelte'
	import { dashboardStore, selectedWidget } from '$lib/stores/dashboardStore'
	import { dataSources } from '$lib/stores/dataStore'
	import ColorPicker from '../ColorPicker.svelte'

	$: widget = $selectedWidget
	$: sources = dataSources
	$: isNewWidget = false

	let showColorPicker = false
	let tempConfig = {}

	// Reactive updates to widget
	$: if (widget && JSON.stringify(tempConfig) !== JSON.stringify(widget.config)) {
		tempConfig = { ...widget.config }
	}

	// Live two-way data binding - update widget immediately on any change
	function updateWidget(updates: any) {
		if (!widget) return
		
		dashboardStore.updateWidget(widget.id, updates)
	}

	function updateConfig(configUpdates: any) {
		if (!widget) return
		
		const newConfig = { ...widget.config, ...configUpdates }
		tempConfig = newConfig
		dashboardStore.updateWidget(widget.id, { config: newConfig })
	}

	function handleColorChange(color: string) {
		updateConfig({ color })
		showColorPicker = false
	}

	// Handle different widget type configurations
	$: configFields = getConfigFields(widget?.type)

	function getConfigFields(type: string) {
		switch (type) {
			case 'gauge':
				return [
					{ key: 'min', label: 'Minimum Value', type: 'number', step: 1 },
					{ key: 'max', label: 'Maximum Value', type: 'number', step: 1 },
					{ key: 'unit', label: 'Unit', type: 'text' },
					{ key: 'showValue', label: 'Show Value', type: 'checkbox' },
					{ key: 'animation', label: 'Animation', type: 'checkbox' }
				]
			case 'line-chart':
				return [
					{ key: 'timeRange', label: 'Time Range', type: 'select', options: ['1m', '5m', '15m', '1h', '6h', '24h'] },
					{ key: 'yAxisMin', label: 'Y-Axis Min', type: 'number', step: 1 },
					{ key: 'yAxisMax', label: 'Y-Axis Max', type: 'number', step: 1 },
					{ key: 'showPoints', label: 'Show Points', type: 'checkbox' },
					{ key: 'smooth', label: 'Smooth Lines', type: 'checkbox' }
				]
			case 'bar-chart':
				return [
					{ key: 'orientation', label: 'Orientation', type: 'select', options: ['vertical', 'horizontal'] },
					{ key: 'showLabels', label: 'Show Labels', type: 'checkbox' },
					{ key: 'animation', label: 'Animation', type: 'checkbox' }
				]
			case 'text-display':
				return [
					{ key: 'fontSize', label: 'Font Size', type: 'number', step: 1, min: 12, max: 72 },
					{ key: 'fontWeight', label: 'Font Weight', type: 'select', options: ['normal', 'bold', '600', '700', '800'] },
					{ key: 'alignment', label: 'Text Alignment', type: 'select', options: ['left', 'center', 'right'] },
					{ key: 'unit', label: 'Custom Unit', type: 'text' }
				]
			default:
				return []
		}
	}
</script>

<div class="widget-editor">
	{#if widget}
		<div class="editor-section">
			<h4>Widget Settings</h4>
			
			<div class="form-group">
				<label for="widget-title">Title</label>
				<input
					id="widget-title"
					type="text"
					class="input"
					value={widget.title}
					on:input={(e) => updateWidget({ title: e.target.value })}
					placeholder="Widget title"
				/>
			</div>

			<div class="form-group">
				<label for="data-source">Data Source</label>
				<select
					id="data-source"
					class="input"
					value={widget.dataSource}
					on:change={(e) => updateWidget({ dataSource: e.target.value })}
				>
					{#each sources as source}
						<option value={source.id}>
							{source.name} ({source.unit})
						</option>
					{/each}
				</select>
			</div>

			<div class="size-controls">
				<div class="form-row">
					<div class="form-group">
						<label for="widget-width">Width</label>
						<input
							id="widget-width"
							type="number"
							class="input"
							value={widget.width}
							on:input={(e) => updateWidget({ width: parseInt(e.target.value) })}
							min="128"
							step="32"
						/>
					</div>
					<div class="form-group">
						<label for="widget-height">Height</label>
						<input
							id="widget-height"
							type="number"
							class="input"
							value={widget.height}
							on:input={(e) => updateWidget({ height: parseInt(e.target.value) })}
							min="128"
							step="32"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="editor-section">
			<h4>Visual Settings</h4>
			
			<div class="form-group">
				<label>Color</label>
				<div class="color-control">
					<button
						class="color-preview"
						style="background: {widget.config.color || '#6366f1'}"
						on:click={() => showColorPicker = !showColorPicker}
					></button>
					<input
						type="text"
						class="input color-input"
						value={widget.config.color || '#6366f1'}
						on:input={(e) => updateConfig({ color: e.target.value })}
						placeholder="#6366f1"
					/>
				</div>
				
				{#if showColorPicker}
					<ColorPicker
						currentColor={widget.config.color || '#6366f1'}
						on:colorChange={(e) => handleColorChange(e.detail)}
						on:close={() => showColorPicker = false}
					/>
				{/if}
			</div>

			{#each configFields as field}
				<div class="form-group">
					<label for="config-{field.key}">{field.label}</label>
					
					{#if field.type === 'number'}
						<input
							id="config-{field.key}"
							type="number"
							class="input"
							value={widget.config[field.key] ?? ''}
							on:input={(e) => updateConfig({ [field.key]: parseFloat(e.target.value) })}
							step={field.step || 0.1}
							min={field.min}
							max={field.max}
						/>
					{:else if field.type === 'text'}
						<input
							id="config-{field.key}"
							type="text"
							class="input"
							value={widget.config[field.key] ?? ''}
							on:input={(e) => updateConfig({ [field.key]: e.target.value })}
						/>
					{:else if field.type === 'select'}
						<select
							id="config-{field.key}"
							class="input"
							value={widget.config[field.key] ?? field.options[0]}
							on:change={(e) => updateConfig({ [field.key]: e.target.value })}
						>
							{#each field.options as option}
								<option value={option}>{option}</option>
							{/each}
						</select>
					{:else if field.type === 'checkbox'}
						<label class="checkbox-label">
							<input
								type="checkbox"
								checked={widget.config[field.key] ?? true}
								on:change={(e) => updateConfig({ [field.key]: e.target.checked })}
							/>
							<span class="checkmark"></span>
							Enable
						</label>
					{/if}
				</div>
			{/each}
		</div>

		<div class="editor-actions">
			<button class="btn btn-primary font-tomorrow" on:click={() => dashboardStore.closeLeftPanel()}>
				<Save size={16} />
				{isNewWidget ? 'Add Widget' : 'Update Widget'}
			</button>
		</div>
	{:else}
		<div class="no-selection">
			<p>Select a widget to edit its properties.</p>
			<p class="hint">Click on any widget in the dashboard to start editing.</p>
		</div>
	{/if}
</div>

<style>
	.widget-editor {
		padding: 20px;
		height: 100%;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.editor-section h4 {
		margin: 0 0 16px 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--border-color);
		padding-bottom: 8px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 16px;
	}

	.form-row {
		display: flex;
		gap: 12px;
	}

	.form-row .form-group {
		flex: 1;
		margin-bottom: 0;
	}

	label {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.color-control {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.color-preview {
		width: 32px;
		height: 32px;
		border-radius: 6px;
		border: 2px solid var(--border-color);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.color-preview:hover {
		border-color: var(--accent-primary);
		transform: scale(1.05);
	}

	.color-input {
		flex: 1;
		font-family: monospace;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-size: 14px;
		color: var(--text-primary);
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

	.editor-actions {
		margin-top: auto;
		padding-top: 16px;
		border-top: 1px solid var(--border-color);
	}

	.no-selection {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
		gap: 8px;
		padding: 40px 20px;
	}

	.no-selection p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 14px;
	}

	.hint {
		color: var(--text-muted);
		font-size: 13px;
	}
</style>