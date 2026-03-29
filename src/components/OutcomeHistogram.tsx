import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import type { SimulationResults } from '../types';

interface HistogramProps {
  results: SimulationResults;
  params: { simulationDuration: number };
}

export default function OutcomeHistogram({ results, params }: HistogramProps) {
  const histogramData = useMemo(() => {
    const lifespans = results.runs.map(
      (r) => r.bankruptcyMonth ?? params.simulationDuration
    );

    const maxLife = params.simulationDuration;
    const bucketCount = Math.min(20, maxLife);
    const bucketSize = Math.ceil(maxLife / bucketCount);
    const buckets: { range: string; count: number; month: number }[] = [];

    for (let i = 0; i < bucketCount; i++) {
      const start = i * bucketSize + 1;
      const end = Math.min((i + 1) * bucketSize, maxLife);
      buckets.push({
        range: start === end ? `${start}` : `${start}-${end}`,
        count: 0,
        month: start,
      });
    }

    lifespans.forEach((l) => {
      const bucketIndex = Math.min(Math.floor((l - 1) / bucketSize), bucketCount - 1);
      if (bucketIndex >= 0 && bucketIndex < buckets.length) {
        buckets[bucketIndex].count++;
      }
    });

    return buckets;
  }, [results, params.simulationDuration]);

  const maxCount = Math.max(...histogramData.map((d) => d.count));
  const avgLifespan = results.averageLifespan;

  return (
    <div style={styles.container} className="nb-card animate-slide-up">
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span>📊</span> Lifespan Distribution
        </h3>
        <span style={styles.badge}>
          {results.runs.length} runs
        </span>
      </div>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={histogramData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              dataKey="range"
              stroke="#1a1a1a"
              strokeWidth={2}
              tick={{ fontSize: 10, fontFamily: 'Space Mono' }}
              label={{ value: 'Months', position: 'bottom', offset: 5, fontSize: 12, fontWeight: 700 }}
            />
            <YAxis
              stroke="#1a1a1a"
              strokeWidth={2}
              tick={{ fontSize: 11, fontFamily: 'Space Mono' }}
              label={{ value: 'Runs', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12, fontWeight: 700 }}
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
              formatter={(value: number) => [`${value} runs`, 'Count']}
              labelFormatter={(label: string) => `Months ${label}`}
            />
            <ReferenceLine
              x={histogramData.find(
                (d) =>
                  d.month <= avgLifespan &&
                  d.month + (histogramData[1]?.month - histogramData[0]?.month || 1) > avgLifespan
              )?.range}
              stroke="#A855F7"
              strokeWidth={2}
              strokeDasharray="6 3"
              label={{
                value: `AVG: ${avgLifespan}mo`,
                position: 'top',
                fill: '#A855F7',
                fontSize: 11,
                fontWeight: 700,
              }}
            />
            <Bar dataKey="count" radius={0}>
              {histogramData.map((entry, index) => {
                const intensity = entry.count / maxCount;
                const isLastBucket = index === histogramData.length - 1;
                return (
                  <Cell
                    key={index}
                    fill={isLastBucket ? '#22C55E' : `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`}
                    stroke="#1a1a1a"
                    strokeWidth={2}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: '#EF4444' }} />
          <span>Bankrupted (by month)</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: '#22C55E' }} />
          <span>Survived full duration</span>
        </div>
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
  legend: {
    display: 'flex',
    gap: 20,
    marginTop: 12,
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.78rem',
    fontWeight: 600,
  },
  legendColor: {
    width: 16,
    height: 16,
    border: '2px solid var(--nb-black)',
  },
};
