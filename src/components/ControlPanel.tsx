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
        min: 0, max: 50000000, step: 10000, unit: '₹', color: 'var(--nb-yellow)',
      },
      {
        key: 'monthlyRevenueBase',
        label: 'Monthly Income',
        help: 'How much money comes in each month from customers/sales.',
        min: 0, max: 10000000, step: 5000, unit: '₹', color: 'var(--nb-yellow)',
      },
      {
        key: 'revenueGrowthRate',
        label: 'Growth Rate',
        help: 'How fast monthly income grows. 5% means income goes up 5% each month (compounding).',
        min: -20, max: 100, step: 0.1, unit: '%', color: 'var(--nb-green)',
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
    title: 'Monthly Expenses',
    icon: 'TrendingDown',
    color: 'var(--nb-red-light)',
    fields: [
      {
        key: 'fixedMonthlyCosts',
        label: 'Fixed Expenses',
        help: 'Fixed costs every month — rent, salaries, electricity, internet, etc.',
        min: 0, max: 10000000, step: 5000, unit: '₹', color: 'var(--nb-red)',
      },
      {
        key: 'costSpikeProbability',
        label: 'Surprise Cost Chance',
        help: 'Chance (%) of an unexpected expense in any month — like equipment failure or legal costs.',
        min: 0, max: 100, step: 1, unit: '%', color: 'var(--nb-red)',
      },
    ],
  },
  {
    title: 'Surprise Costs Range',
    icon: 'AlertTriangle',
    color: 'var(--nb-orange-light)',
    fields: [
      {
        key: 'costSpikeMin',
        label: 'Surprise Min',
        help: 'Minimum amount of a surprise expense when it happens.',
        min: 0, max: 5000000, step: 5000, unit: '₹', color: 'var(--nb-red)',
      },
      {
        key: 'costSpikeMax',
        label: 'Surprise Max',
        help: 'Maximum amount of a surprise expense when it happens.',
        min: 0, max: 20000000, step: 10000, unit: '₹', color: 'var(--nb-red)',
      },
    ],
  },
  {
    title: 'Investor Funding',
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
        min: 0, max: 100000000, step: 50000, unit: '₹', color: 'var(--nb-blue)',
      },
      {
        key: 'fundingMax',
        label: 'Funding Max',
        help: 'Largest possible funding amount when an investor does invest.',
        min: 0, max: 500000000, step: 100000, unit: '₹', color: 'var(--nb-blue)',
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
        label: 'Market Volatility',
        help: 'How much the overall market (economy) affects your business. Higher = more unpredictable environment.',
        min: 0, max: 100, step: 1, unit: '%', color: 'var(--nb-purple)',
      },
      {
        key: 'simulationDuration',
        label: 'Time Period',
        help: 'How many months to simulate. 36 months = 3 years.',
        min: 1, max: 240, step: 1, unit: 'months', color: 'var(--nb-purple)',
      },
      {
        key: 'numSimulations',
        label: 'Number of Runs',
        help: 'How many random scenarios to simulate. More runs = more accurate probability. 500+ recommended.',
        min: 1, max: 5000, step: 1, unit: 'runs', color: 'var(--nb-purple)',
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
    if (unit === '%') return `${value}%`;
    if (unit === '%/mo') return `${value}%/mo`;
    if (unit === 'months') return `${value} mo`;
    if (unit === 'runs') return `${value.toLocaleString()}`;
    return `${value}`;
  };

  return (
    <div style={styles.panel}>
      {/* Header for Sidebar */}
      <div style={styles.sidebarHeader}>
        <h2 style={styles.sidebarTitle}>
          <Icons.Settings size={18} strokeWidth={2.5} />
          CONFIGURATOR
        </h2>
      </div>

      <div style={styles.scrollArea}>
        {/* Presets Grid */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <Icons.Sparkles size={14} strokeWidth={2.5} />
            QUICK PRESETS
          </h3>
          <div style={styles.presetGrid}>
            {presetScenarios.map((preset) => {
              const PresetIcon = presetIconMap[preset.emoji];
              const isActive = activePreset === preset.name;
              return (
                <button
                  key={preset.name}
                  className="nb-btn nb-btn-sm"
                  style={{
                    ...styles.presetBtn,
                    background: isActive ? 'var(--nb-black)' : 'var(--nb-surface)',
                    color: isActive ? 'var(--nb-yellow)' : 'var(--nb-black)',
                    borderColor: 'var(--nb-black)',
                  }}
                  onClick={() => applyPreset(preset)}
                >
                  <div style={styles.presetBtnContent}>
                    {PresetIcon && <PresetIcon size={16} strokeWidth={2.5} />}
                    <div style={styles.presetTextWrapper}>
                      <div style={styles.presetName}>{preset.name}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameter Groups */}
        {fieldGroups.map((group) => {
          const GroupIcon = Icons[group.icon as keyof typeof Icons] || Icons.CircleDot;
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
                        <label style={styles.label}>{field.label}</label>
                        <Tooltip text={field.help}>
                          <Icons.HelpCircle size={12} strokeWidth={2.5} style={{ color: '#888' }} />
                        </Tooltip>
                      </div>
                      <div style={{ ...styles.fieldValue, background: field.color }}>
                        {formatValue(params[field.key], field.unit)}
                      </div>
                    </div>
                    
                    <div style={styles.inputStack}>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={params[field.key]}
                        onChange={(e) => updateParam(field.key, parseFloat(e.target.value))}
                        style={{
                          ...styles.slider,
                          accentColor: 'var(--nb-black)',
                        }}
                      />
                      <div style={styles.numberInputWrapper}>
                        <input
                          type="number"
                          value={params[field.key]}
                          onChange={(e) => updateParam(field.key, parseFloat(e.target.value) || 0)}
                          style={styles.numberInput}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Run Button */}
      <div style={styles.runSection}>
        {isRunning ? (
          <div style={styles.progressContainer}>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>
            <div style={styles.progressLabel}>
              <Icons.Timer size={14} strokeWidth={2.5} />
              {Math.round(progress)}%
            </div>
          </div>
        ) : (
          <button
            className="nb-btn nb-btn-primary"
            onClick={onRunSimulation}
            style={styles.runBtn}
          >
            <Icons.Rocket size={20} strokeWidth={2.5} />
            <span>RUN SIMULATION</span>
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: 'calc(100vh - 40px)',
    background: 'var(--nb-bg)',
  },
  sidebarHeader: {
    padding: '0 0 16px 0',
    borderBottom: '4px solid var(--nb-black)',
    marginBottom: 16,
  },
  sidebarTitle: {
    fontSize: '1rem',
    fontWeight: 900,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    letterSpacing: '1px',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 20,
    paddingRight: 4,
  },
  section: {
    background: 'var(--nb-white)',
    border: '3px solid var(--nb-black)',
    boxShadow: '4px 4px 0px var(--nb-black)',
  },
  sectionTitle: {
    margin: 0,
    padding: '8px 12px',
    fontSize: '0.75rem',
    fontWeight: 900,
    borderBottom: '3px solid var(--nb-black)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    padding: 12,
  },
  presetBtn: {
    padding: '8px',
    height: 'auto',
    textAlign: 'left' as const,
    transition: 'none',
  },
  presetBtnContent: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  presetTextWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  presetName: {
    fontSize: '0.65rem',
    fontWeight: 800,
    lineHeight: 1.2,
  },
  fieldsGrid: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  fieldHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--nb-black)',
  },
  fieldValue: {
    fontSize: '0.7rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 900,
    padding: '2px 8px',
    border: '2px solid var(--nb-black)',
    boxShadow: '2px 2px 0px var(--nb-black)',
  },
  inputStack: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  slider: {
    width: '100%',
    height: '12px',
    cursor: 'pointer',
    margin: 0,
    WebkitAppearance: 'none' as any,
    background: '#eee',
    border: '2px solid var(--nb-black)',
  },
  numberInputWrapper: {
    width: '100%',
  },
  numberInput: {
    width: '100%',
    padding: '6px 10px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    border: '2px solid var(--nb-black)',
    background: 'var(--nb-white)',
    outline: 'none',
  },
  runSection: {
    marginTop: 20,
    position: 'sticky' as const,
    bottom: 0,
    background: 'var(--nb-bg)',
    paddingTop: 16,
    zIndex: 10,
  },
  runBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '1rem',
    fontWeight: 900,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    background: 'var(--nb-yellow)',
    color: 'var(--nb-black)',
    border: '4px solid var(--nb-black)',
    boxShadow: '6px 6px 0px var(--nb-black)',
    cursor: 'pointer',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  progressTrack: {
    height: '24px',
    border: '4px solid var(--nb-black)',
    background: 'var(--nb-white)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'var(--nb-green)',
    transition: 'width 0.1s linear',
  },
  progressLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: '0.9rem',
    fontWeight: 900,
  },
};
