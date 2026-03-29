import type { SimulationResults, SimulationParams } from '../types';
import { exportToJSON, exportToCSV } from '../utils/export';
import { Icons } from './icons';

interface ResultsPanelProps {
  results: SimulationResults | null;
  params: SimulationParams;
}

export default function ResultsPanel({ results, params }: ResultsPanelProps) {
  if (!results) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyInner}>
          <Icons.Dices size={48} strokeWidth={1.5} style={{ color: '#ccc' }} />
          <h3 style={styles.emptyTitle}>No Simulation Data Yet</h3>
          <p style={styles.emptyText}>
            Configure your parameters on the left and hit <strong>Run Simulation</strong> to see results.
          </p>
          <p style={styles.emptyHint}>
            <Icons.Lightbulb size={14} strokeWidth={2} />
            Tip: Try a preset first to get started quickly!
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
          sublabel="Chance of surviving"
          value={`${results.survivalRate}%`}
          icon={<Icons.Shield size={22} strokeWidth={2} />}
          bg={survivalColor}
          large
        />
        <MetricCard
          label="Bankruptcy Rate"
          sublabel="Chance of failing"
          value={`${results.bankruptcyRate}%`}
          icon={<Icons.Skull size={22} strokeWidth={2} />}
          bg="var(--nb-red)"
          large
        />
        <MetricCard
          label="Avg Lifespan"
          sublabel="Average months survived"
          value={`${results.averageLifespan} mo`}
          icon={<Icons.Clock size={20} strokeWidth={2} />}
          bg="var(--nb-blue-light)"
        />
        <MetricCard
          label="Median Lifespan"
          sublabel="Middle value of all runs"
          value={`${results.medianLifespan} mo`}
          icon={<Icons.BarChart2 size={20} strokeWidth={2} />}
          bg="var(--nb-purple-light)"
        />
      </div>

      {/* Detailed Stats */}
      <div style={styles.detailsRow}>
        <div style={styles.detailCard} className="nb-card">
          <h4 style={styles.detailTitle}>
            <Icons.TrendingUp size={16} strokeWidth={2.5} />
            Capital Statistics
          </h4>
          <table style={styles.table}>
            <tbody>
              <StatRow label="Avg Final Capital" value={formatCurrency(results.averageFinalCapital)} help="Average money left at the end of all runs" />
              <StatRow label="Median Final Capital" value={formatCurrency(results.medianFinalCapital)} help="Middle value — more reliable than average" />
              <StatRow label="Total Simulations" value={results.runs.length.toLocaleString()} help="How many random scenarios were tested" />
              <StatRow label="Survived" value={results.runs.filter(r => r.survived).length.toLocaleString()} help="Runs where startup made it to the end" />
              <StatRow label="Went Bankrupt" value={results.runs.filter(r => !r.survived).length.toLocaleString()} help="Runs where startup ran out of money" />
            </tbody>
          </table>
        </div>
        <div style={styles.detailCard} className="nb-card">
          <h4 style={styles.detailTitle}>
            <Icons.Activity size={16} strokeWidth={2.5} />
            Risk Analysis
          </h4>
          <table style={styles.table}>
            <tbody>
              <StatRow label="Std Deviation" value={`${results.stdDevLifespan} mo`} help="How spread out the results are — higher = more unpredictable" />
              <StatRow label="10th Percentile" value={`${results.percentile10Lifespan} mo`} help="In the worst 10% of cases, the startup lasted this long" />
              <StatRow label="90th Percentile" value={`${results.percentile90Lifespan} mo`} help="In the best 90% of cases, the startup lasted this long" />
              <StatRow label="Sim Duration" value={`${params.simulationDuration} mo`} help="How many months were simulated" />
              <StatRow label="Survival / Duration" value={`${Math.round((results.averageLifespan / params.simulationDuration) * 100)}%`} help="Average lifespan as a percentage of total duration" />
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
          <Icons.FileJson size={14} strokeWidth={2.5} /> Export JSON
        </button>
        <button
          className="nb-btn nb-btn-sm nb-btn-success"
          onClick={() => exportToCSV(results)}
        >
          <Icons.FileSpreadsheet size={14} strokeWidth={2.5} /> Export CSV
        </button>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  sublabel,
  value,
  icon,
  bg,
  large,
}: {
  label: string;
  sublabel: string;
  value: string;
  icon: React.ReactNode;
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
      <div style={styles.metricIcon}>{icon}</div>
      <span style={{
        ...styles.metricValue,
        fontSize: large ? '2rem' : '1.5rem',
      }}>
        {value}
      </span>
      <span style={styles.metricLabel}>{label}</span>
      <span style={styles.metricSublabel}>{sublabel}</span>
    </div>
  );
}

function StatRow({ label, value, help }: { label: string; value: string; help: string }) {
  return (
    <tr style={styles.tableRow} title={help}>
      <td style={styles.tableLabel}>
        {label}
        <Icons.Info size={11} strokeWidth={2} style={{ marginLeft: 4, color: '#bbb', verticalAlign: 'middle' }} />
      </td>
      <td style={styles.tableValue}>{value}</td>
    </tr>
  );
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value.toFixed(0)}`;
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
  emptyTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    fontSize: '0.95rem',
  },
  emptyHint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    fontSize: '0.82rem',
    color: '#999',
    fontStyle: 'italic' as const,
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
    gap: 2,
    textAlign: 'center' as const,
  },
  metricIcon: {
    marginBottom: 4,
    color: 'var(--nb-black)',
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
  },
  metricSublabel: {
    fontSize: '0.65rem',
    color: 'rgba(0,0,0,0.55)',
    fontWeight: 500,
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
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableRow: {
    borderBottom: '1px solid #e5e5e5',
    cursor: 'help',
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
