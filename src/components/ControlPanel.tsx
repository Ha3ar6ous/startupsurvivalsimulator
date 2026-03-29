import { useState } from 'react';
import type { SimulationParams } from '../types';
import { presetScenarios } from '../presets/scenarios';

interface ControlPanelProps {
  params: SimulationParams;
  onParamsChange: (params: SimulationParams) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
  progress: number;
}

interface FieldConfig {
  key: keyof SimulationParams;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
}

const fieldGroups: { title: string; emoji: string; color: string; fields: FieldConfig[] }[] = [
  {
    title: 'Capital & Revenue',
    emoji: '💰',
    color: 'var(--nb-yellow-light)',
    fields: [
      { key: 'initialCapital', label: 'Initial Capital', min: 0, max: 10000000, step: 5000, unit: '$', color: 'var(--nb-yellow)' },
      { key: 'monthlyRevenueBase', label: 'Monthly Revenue', min: 0, max: 1000000, step: 500, unit: '$', color: 'var(--nb-yellow)' },
      { key: 'revenueGrowthRate', label: 'Growth Rate', min: -20, max: 50, step: 0.5, unit: '%', color: 'var(--nb-green)' },
      { key: 'revenueRandomness', label: 'Revenue Variance', min: 0, max: 100, step: 1, unit: '%', color: 'var(--nb-orange)' },
    ],
  },
  {
    title: 'Costs',
    emoji: '📉',
    color: 'var(--nb-red-light)',
    fields: [
      { key: 'fixedMonthlyCosts', label: 'Fixed Monthly Costs', min: 0, max: 1000000, step: 500, unit: '$', color: 'var(--nb-red)' },
      { key: 'costSpikeProbability', label: 'Cost Spike Chance', min: 0, max: 100, step: 1, unit: '%', color: 'var(--nb-red)' },
      { key: 'costSpikeMin', label: 'Spike Min', min: 0, max: 500000, step: 500, unit: '$', color: 'var(--nb-red)' },
      { key: 'costSpikeMax', label: 'Spike Max', min: 0, max: 1000000, step: 1000, unit: '$', color: 'var(--nb-red)' },
    ],
  },
  {
    title: 'Funding',
    emoji: '🏦',
    color: 'var(--nb-blue-light)',
    fields: [
      { key: 'fundingProbability', label: 'Funding Chance', min: 0, max: 100, step: 1, unit: '%/mo', color: 'var(--nb-blue)' },
      { key: 'fundingMin', label: 'Funding Min', min: 0, max: 5000000, step: 5000, unit: '$', color: 'var(--nb-blue)' },
      { key: 'fundingMax', label: 'Funding Max', min: 0, max: 10000000, step: 10000, unit: '$', color: 'var(--nb-blue)' },
    ],
  },
  {
    title: 'Market & Simulation',
    emoji: '🌐',
    color: 'var(--nb-purple-light)',
    fields: [
      { key: 'marketVolatility', label: 'Market Volatility', min: 0, max: 50, step: 1, unit: '%', color: 'var(--nb-purple)' },
      { key: 'simulationDuration', label: 'Duration', min: 6, max: 120, step: 1, unit: 'mo', color: 'var(--nb-purple)' },
      { key: 'numSimulations', label: 'Simulations', min: 10, max: 5000, step: 10, unit: 'runs', color: 'var(--nb-purple)' },
    ],
  },
];

export default function ControlPanel({
  params,
  onParamsChange,
  onRunSimulation,
  isRunning,
  progress,
}: ControlPanelProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const updateParam = (key: keyof SimulationParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
    setActivePreset(null);
  };

  const applyPreset = (preset: typeof presetScenarios[0]) => {
    onParamsChange({ ...params, ...preset.params } as SimulationParams);
    setActivePreset(preset.name);
  };

  const formatValue = (value: number, unit: string): string => {
    if (unit === '$') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value}`;
    }
    return `${value}${unit}`;
  };

  return (
    <div style={styles.panel}>
      {/* Presets */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>🎭</span> Presets
        </h3>
        <div style={styles.presetGrid}>
          {presetScenarios.map((preset) => (
            <button
              key={preset.name}
              className="nb-btn nb-btn-sm"
              style={{
                ...styles.presetBtn,
                background: activePreset === preset.name ? 'var(--nb-yellow)' : 'var(--nb-surface)',
                width: '100%',
                justifyContent: 'flex-start',
              }}
              onClick={() => applyPreset(preset)}
              title={preset.description}
            >
              <span>{preset.emoji}</span>
              <span style={{ fontSize: '0.72rem' }}>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Groups */}
      {fieldGroups.map((group) => (
        <div key={group.title} style={styles.section}>
          <h3 style={{ ...styles.sectionTitle, background: group.color }}>
            <span>{group.emoji}</span> {group.title}
          </h3>
          <div style={styles.fieldsGrid}>
            {group.fields.map((field) => (
              <div key={field.key} style={styles.fieldWrapper}>
                <div style={styles.fieldHeader}>
                  <label className="nb-label" style={{ margin: 0 }}>{field.label}</label>
                  <span style={styles.fieldValue}>
                    {formatValue(params[field.key], field.unit)}
                  </span>
                </div>
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={params[field.key]}
                  onChange={(e) => updateParam(field.key, parseFloat(e.target.value))}
                  style={{
                    ...styles.slider,
                    accentColor: field.color,
                  }}
                />
                <input
                  type="number"
                  className="nb-input"
                  value={params[field.key]}
                  onChange={(e) => updateParam(field.key, parseFloat(e.target.value) || 0)}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  style={styles.numberInput}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Run Button */}
      <div style={styles.runSection}>
        {isRunning && (
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${progress}%`,
                }}
              />
            </div>
            <span style={styles.progressText}>{Math.round(progress)}%</span>
          </div>
        )}
        <button
          className="nb-btn nb-btn-primary"
          onClick={onRunSimulation}
          disabled={isRunning}
          style={styles.runBtn}
        >
          {isRunning ? (
            <>
              <span style={styles.spinner}>⏳</span>
              SIMULATING...
            </>
          ) : (
            <>
              <span>🚀</span>
              RUN {params.numSimulations.toLocaleString()} SIMULATIONS
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    height: '100%',
  },
  section: {
    background: 'var(--nb-surface)',
    border: 'var(--nb-border)',
    boxShadow: 'var(--nb-shadow)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    padding: '10px 16px',
    borderBottom: 'var(--nb-border)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: 0,
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    padding: 12,
  },
  presetBtn: {
    fontSize: '0.7rem',
    textTransform: 'none' as const,
  },
  fieldsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    padding: 16,
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  fieldHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    fontWeight: 700,
    background: 'var(--nb-black)',
    color: 'var(--nb-yellow)',
    padding: '2px 8px',
    border: '2px solid var(--nb-black)',
  },
  slider: {
    width: '100%',
    height: 6,
    cursor: 'pointer',
  },
  numberInput: {
    fontSize: '0.78rem',
    padding: '4px 8px',
    fontFamily: 'var(--font-mono)',
  },
  runSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    position: 'sticky' as const,
    bottom: 0,
    background: 'var(--nb-bg)',
    paddingTop: 8,
    paddingBottom: 8,
  },
  runBtn: {
    width: '100%',
    justifyContent: 'center',
    fontSize: '1rem',
    padding: '16px 24px',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 16,
    border: 'var(--nb-border)',
    background: 'var(--nb-surface)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: `repeating-linear-gradient(
      45deg,
      var(--nb-yellow),
      var(--nb-yellow) 10px,
      var(--nb-orange) 10px,
      var(--nb-orange) 20px
    )`,
    backgroundSize: '40px 40px',
    animation: 'progressStripe 0.5s linear infinite',
    transition: 'width 0.2s ease',
  },
  progressText: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '0.85rem',
    minWidth: 40,
  },
  spinner: {
    animation: 'pulse 1s ease infinite',
    display: 'inline-block',
  },
};
