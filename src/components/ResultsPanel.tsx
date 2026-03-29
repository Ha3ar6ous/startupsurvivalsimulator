import type { SimulationResults, SimulationParams } from '../types';
import { exportToJSON, exportToCSV } from '../utils/export';

interface ResultsPanelProps {
  results: SimulationResults | null;
  params: SimulationParams;
}

export default function ResultsPanel({ results, params }: ResultsPanelProps) {
  if (!results) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyInner}>
          <span style={styles.emptyIcon}>🎲</span>
          <h3 style={styles.emptyTitle}>No Simulation Data Yet</h3>
          <p style={styles.emptyText}>
            Configure your parameters and hit <strong>Run Simulation</strong> to see results.
          </p>
        </div>
      </div>
    );
  }

  const survivalColor = results.survivalRate >= 70
    ? 'var(--nb-green)'
    : results.survivalRate >= 40
    ? 'var(--nb-orange)'
    : 'var(--nb-red)';

  return (
    <div style={styles.container} className="animate-slide-up">
      {/* Key Metrics Row */}
      <div style={styles.metricsRow}>
        <MetricCard
          label="Survival Rate"
          value={`${results.survivalRate}%`}
          emoji="✅"
          bg={survivalColor}
          large
        />
        <MetricCard
          label="Bankruptcy Rate"
          value={`${results.bankruptcyRate}%`}
          emoji="💀"
          bg="var(--nb-red)"
          large
        />
        <MetricCard
          label="Avg Lifespan"
          value={`${results.averageLifespan} mo`}
          emoji="📅"
          bg="var(--nb-blue-light)"
        />
        <MetricCard
          label="Median Lifespan"
          value={`${results.medianLifespan} mo`}
          emoji="📊"
          bg="var(--nb-purple-light)"
        />
      </div>

      {/* Detailed Stats */}
      <div style={styles.detailsRow}>
        <div style={styles.detailCard} className="nb-card">
          <h4 style={styles.detailTitle}>📈 Capital Statistics</h4>
          <table style={styles.table}>
            <tbody>
              <StatRow label="Avg Final Capital" value={formatCurrency(results.averageFinalCapital)} />
              <StatRow label="Median Final Capital" value={formatCurrency(results.medianFinalCapital)} />
              <StatRow label="Total Simulations" value={results.runs.length.toLocaleString()} />
              <StatRow label="Survived" value={results.runs.filter(r => r.survived).length.toLocaleString()} />
              <StatRow label="Bankrupted" value={results.runs.filter(r => !r.survived).length.toLocaleString()} />
            </tbody>
          </table>
        </div>
        <div style={styles.detailCard} className="nb-card">
          <h4 style={styles.detailTitle}>📉 Risk Distribution</h4>
          <table style={styles.table}>
            <tbody>
              <StatRow label="Std Dev (Lifespan)" value={`${results.stdDevLifespan} mo`} />
              <StatRow label="10th Percentile" value={`${results.percentile10Lifespan} mo`} />
              <StatRow label="90th Percentile" value={`${results.percentile90Lifespan} mo`} />
              <StatRow label="Duration" value={`${params.simulationDuration} mo`} />
              <StatRow label="Avg / Max" value={`${Math.round((results.averageLifespan / params.simulationDuration) * 100)}%`} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div style={styles.exportRow}>
        <button
          className="nb-btn nb-btn-sm nb-btn-blue"
          onClick={() => exportToJSON(results, params)}
        >
          <span>📄</span> Export JSON
        </button>
        <button
          className="nb-btn nb-btn-sm nb-btn-success"
          onClick={() => exportToCSV(results)}
        >
          <span>📊</span> Export CSV
        </button>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  emoji,
  bg,
  large,
}: {
  label: string;
  value: string;
  emoji: string;
  bg: string;
  large?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.metricCard,
        background: bg,
        ...(large ? { gridColumn: 'span 1' } : {}),
      }}
    >
      <span style={styles.metricEmoji}>{emoji}</span>
      <span style={{
        ...styles.metricValue,
        fontSize: large ? '2rem' : '1.5rem',
      }}>
        {value}
      </span>
      <span style={styles.metricLabel}>{label}</span>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <tr style={styles.tableRow}>
      <td style={styles.tableLabel}>{label}</td>
      <td style={styles.tableValue}>{value}</td>
    </tr>
  );
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    background: 'var(--nb-surface)',
    border: 'var(--nb-border)',
    borderStyle: 'dashed',
  },
  emptyInner: {
    textAlign: 'center' as const,
    padding: 40,
  },
  emptyIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    fontSize: '0.95rem',
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
  },
  metricCard: {
    border: 'var(--nb-border)',
    boxShadow: 'var(--nb-shadow)',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
    textAlign: 'center' as const,
  },
  metricEmoji: {
    fontSize: '1.5rem',
  },
  metricValue: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.1,
    color: 'var(--nb-black)',
  },
  metricLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: 'var(--nb-black)',
    opacity: 0.8,
  },
  detailsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  detailCard: {
    padding: 16,
  },
  detailTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: 'var(--nb-border)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableRow: {
    borderBottom: '1px solid #e5e5e5',
  },
  tableLabel: {
    padding: '6px 0',
    fontSize: '0.82rem',
    color: '#555',
  },
  tableValue: {
    padding: '6px 0',
    textAlign: 'right' as const,
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  exportRow: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
  },
};
