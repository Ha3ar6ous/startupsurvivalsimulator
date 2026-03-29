import { useState } from 'react';
import type { SimulationParams } from '../types';
import { presetScenarios } from '../presets/scenarios';
import { Icons, presetIconMap } from './icons';
import { Tooltip } from './Tooltip';

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
  help: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
}

const fieldGroups: { title: string; icon: keyof typeof Icons; color: string; fields: FieldConfig[] }[] = [
  {
    title: 'Money & Income',
    icon: 'IndianRupee',
    color: 'var(--nb-yellow-light)',
    fields: [
      {
        key: 'initialCapital',
        label: 'Starting Money',
        help: 'Total money the startup begins with — like initial savings or seed investment.',
        min: 0, max: 50000000, step: 50000, unit: '₹', color: 'var(--nb-yellow)',
      },
      {
        key: 'monthlyRevenueBase',
        label: 'Monthly Income',
        help: 'How much money comes in each month from customers/sales.',
        min: 0, max: 5000000, step: 5000, unit: '₹', color: 'var(--nb-yellow)',
      },
      {
        key: 'revenueGrowthRate',
        label: 'Growth Rate',
        help: 'How fast monthly income grows. 5% means income goes up 5% each month (compounding).',
        min: -20, max: 50, step: 0.5, unit: '%', color: 'var(--nb-green)',
      },
      {
        key: 'revenueRandomness',
        label: 'Income Randomness',
        help: 'How unpredictable your income is. Low = steady income like salaries. High = variable like sales.',
        min: 0, max: 100, step: 1, unit: '%', color: 'var(--nb-orange)',
      },
    ],
  },
  {
    title: 'Expenses',
    icon: 'TrendingDown',
    color: 'var(--nb-red-light)',
    fields: [
      {
        key: 'fixedMonthlyCosts',
        label: 'Monthly Expenses',
        help: 'Fixed costs every month — rent, salaries, electricity, internet, etc.',
        min: 0, max: 5000000, step: 5000, unit: '₹', color: 'var(--nb-red)',
      },
      {
        key: 'costSpikeProbability',
        label: 'Surprise Cost Chance',
        help: 'Chance (%) of an unexpected expense in any month — like equipment failure or legal costs.',
        min: 0, max: 100, step: 1, unit: '%', color: 'var(--nb-red)',
      },
      {
        key: 'costSpikeMin',
        label: 'Surprise Min',
        help: 'Minimum amount of a surprise expense when it happens.',
        min: 0, max: 2000000, step: 5000, unit: '₹', color: 'var(--nb-red)',
      },
      {
        key: 'costSpikeMax',
        label: 'Surprise Max',
        help: 'Maximum amount of a surprise expense when it happens.',
        min: 0, max: 5000000, step: 10000, unit: '₹', color: 'var(--nb-red)',
      },
    ],
  },
  {
    title: 'Funding (Investor Money)',
    icon: 'Wallet',
    color: 'var(--nb-blue-light)',
    fields: [
      {
        key: 'fundingProbability',
        label: 'Funding Chance',
        help: 'Probability (%) that an investor gives money in any month. 0% = no investors (bootstrapped).',
        min: 0, max: 100, step: 1, unit: '%/mo', color: 'var(--nb-blue)',
      },
      {
        key: 'fundingMin',
        label: 'Funding Min',
        help: 'Smallest possible funding amount when an investor does invest.',
        min: 0, max: 50000000, step: 50000, unit: '₹', color: 'var(--nb-blue)',
      },
      {
        key: 'fundingMax',
        label: 'Funding Max',
        help: 'Largest possible funding amount when an investor does invest.',
        min: 0, max: 100000000, step: 100000, unit: '₹', color: 'var(--nb-blue)',
      },
    ],
  },
  {
    title: 'Simulation Settings',
    icon: 'Settings',
    color: 'var(--nb-purple-light)',
    fields: [
      {
        key: 'marketVolatility',
        label: 'Market Ups & Downs',
        help: 'How much the overall market (economy) affects your business. Higher = more unpredictable environment.',
        min: 0, max: 50, step: 1, unit: '%', color: 'var(--nb-purple)',
      },
      {
        key: 'simulationDuration',
        label: 'Time Period',
        help: 'How many months to simulate. 36 months = 3 years.',
        min: 6, max: 120, step: 1, unit: 'months', color: 'var(--nb-purple)',
      },
      {
        key: 'numSimulations',
        label: 'Number of Runs',
        help: 'How many random scenarios to simulate. More runs = more accurate probability. 500+ recommended.',
        min: 10, max: 5000, step: 10, unit: 'runs', color: 'var(--nb-purple)',
      },
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
    if (unit === '₹') {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
      if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
      if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
      return `₹${value}`;
    }
    return `${value}${unit === 'months' ? ' mo' : unit === 'runs' ? '' : unit}`;
  };

  return (
    <div style={styles.panel}>
      {/* Presets */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <Icons.Sparkles size={14} strokeWidth={2.5} />
          Quick Presets (Indian Startups)
        </h3>
        <div style={styles.presetGrid}>
          {presetScenarios.map((preset) => {
            const PresetIcon = presetIconMap[preset.emoji];
            return (
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
                {PresetIcon && <PresetIcon size={14} strokeWidth={2.5} />}
                <span style={{ fontSize: '0.72rem' }}>{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Groups */}
      {fieldGroups.map((group) => {
        const GroupIcon = Icons[group.icon];
        return (
          <div key={group.title} style={styles.section}>
            <h3 style={{ ...styles.sectionTitle, background: group.color }}>
              <GroupIcon size={14} strokeWidth={2.5} />
              {group.title}
            </h3>
            <div style={styles.fieldsGrid}>
              {group.fields.map((field) => (
                <div key={field.key} style={styles.fieldWrapper}>
                  <div style={styles.fieldHeader}>
                    <div style={styles.labelRow}>
                      <label className="nb-label" style={{ margin: 0 }}>{field.label}</label>
                      <Tooltip text={field.help}>
                        <Icons.Info size={13} strokeWidth={2} style={{ color: '#999' }} />
                      </Tooltip>
                    </div>
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
        );
      })}

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
              <Icons.Timer size={18} strokeWidth={2.5} style={{ animation: 'pulse 1s ease infinite' }} />
              SIMULATING...
            </>
          ) : (
            <>
              <Icons.Rocket size={18} strokeWidth={2.5} />
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
    fontSize: '0.82rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
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
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  fieldValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
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
};
