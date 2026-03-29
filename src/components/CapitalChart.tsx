import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { SimulationResults } from '../types';

interface CapitalChartProps {
  results: SimulationResults;
  maxRuns?: number;
}

const COLORS = [
  '#3B82F6', '#EF4444', '#22C55E', '#F97316', '#A855F7',
  '#EC4899', '#06B6D4', '#84CC16', '#F59E0B', '#8B5CF6',
  '#10B981', '#E11D48', '#0EA5E9', '#D946EF', '#14B8A6',
  '#F472B6', '#6366F1', '#34D399', '#FB923C', '#818CF8',
];

export default function CapitalChart({ results, maxRuns = 50 }: CapitalChartProps) {
  const { data, runKeys } = useMemo(() => {
    const paths = results.capitalPaths;
    if (!paths.length) return { data: [], runKeys: [] };
    
    const allKeys = Object.keys(paths[0]).filter((k) => k !== 'month');
    const limitedKeys = allKeys.slice(0, maxRuns);
    
    return { data: paths, runKeys: limitedKeys };
  }, [results.capitalPaths, maxRuns]);

  if (!data.length) return null;

  return (
    <div style={styles.container} className="nb-card animate-slide-up">
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span>📈</span> Capital Over Time
        </h3>
        <span style={styles.badge}>
          {runKeys.length} sample runs
        </span>
      </div>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <XAxis
              dataKey="month"
              stroke="#1a1a1a"
              strokeWidth={2}
              tick={{ fontSize: 11, fontFamily: 'Space Mono' }}
              label={{ value: 'Month', position: 'bottom', offset: 0, fontSize: 12, fontWeight: 700 }}
            />
            <YAxis
              stroke="#1a1a1a"
              strokeWidth={2}
              tick={{ fontSize: 11, fontFamily: 'Space Mono' }}
              tickFormatter={(v: number) => {
                if (Math.abs(v) >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(0)}K`;
                return `$${v}`;
              }}
            />
            <Tooltip
              contentStyle={{
                background: '#1a1a1a',
                border: '2px solid #FFD60A',
                color: '#fafaf9',
                fontFamily: 'Space Mono',
                fontSize: 12,
              }}
              labelStyle={{ color: '#FFD60A', fontWeight: 700 }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelFormatter={(label: number) => `Month ${label}`}
            />
            <ReferenceLine
              y={0}
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="8 4"
              label={{
                value: '💀 BANKRUPTCY',
                position: 'right',
                fill: '#EF4444',
                fontSize: 11,
                fontWeight: 700,
              }}
            />
            {runKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={1.5}
                dot={false}
                opacity={0.5}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 20,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: 'var(--nb-black)',
    color: 'var(--nb-yellow)',
    padding: '4px 10px',
    border: '2px solid var(--nb-black)',
  },
  chartWrapper: {
    border: 'var(--nb-border)',
    background: '#fafaf9',
    padding: '10px 0',
  },
};
