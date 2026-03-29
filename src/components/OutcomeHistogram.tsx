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
import { Icons } from './icons';

interface HistogramProps {
  results: SimulationResults;
  params: { simulationDuration: number };
}

export default function OutcomeHistogram({ results, params }: HistogramProps) {
  const { histogramData, insight } = useMemo(() => {
    const lifespans = results.runs.map(
      (r) => r.bankruptcyMonth ?? params.simulationDuration
    );

    // Separate bankrupted and survived
    const bankrupted = lifespans.filter(l => l < params.simulationDuration);
    const survivedCount = lifespans.filter(l => l >= params.simulationDuration).length;

    const maxLife = params.simulationDuration;
    const bucketCount = Math.min(20, maxLife);
    const bucketSize = Math.ceil(maxLife / bucketCount);

    type BucketData = {
      range: string;
      bankrupted: number;
      survived: number;
      month: number;
    };

    const buckets: BucketData[] = [];

    for (let i = 0; i < bucketCount; i++) {
      const start = i * bucketSize + 1;
      const end = Math.min((i + 1) * bucketSize, maxLife);
      buckets.push({
        range: start === end ? `${start}` : `${start}-${end}`,
        bankrupted: 0,
        survived: 0,
        month: start,
      });
    }

    // Fill bankruptcy buckets
    bankrupted.forEach((l) => {
      const bucketIndex = Math.min(Math.floor((l - 1) / bucketSize), bucketCount - 1);
      if (bucketIndex >= 0 && bucketIndex < buckets.length) {
        buckets[bucketIndex].bankrupted++;
      }
    });

    // Put survived count in the last bucket
    if (buckets.length > 0) {
      buckets[buckets.length - 1].survived = survivedCount;
    }

    // Generate insight text
    const survivalRate = results.survivalRate;
    const bankruptedCount = results.runs.length - survivedCount;
    let insightText = '';

    if (survivalRate >= 95) {
      insightText = `Almost all runs (${survivedCount}/${results.runs.length}) survived the full ${params.simulationDuration} months. The green bar at the end represents these survivors. This indicates a very stable configuration with low variance in outcomes.`;
    } else if (survivalRate >= 70) {
      insightText = `${survivedCount} out of ${results.runs.length} runs survived. The red bars show when bankruptcies occurred — notice the spread. ${bankruptedCount} runs ended early, mostly due to random cost spikes or revenue dips.`;
    } else if (survivalRate >= 30) {
      insightText = `Only ${survivedCount} out of ${results.runs.length} runs survived. The red bars reveal a wide distribution of failure times — some fail early (capital runs out fast), others last longer but still go bankrupt. High variance in outcomes indicates significant risk.`;
    } else {
      insightText = `Very few runs survived (${survivedCount}/${results.runs.length}). The histogram shows where most bankruptcies cluster. If failures are concentrated early, initial capital is insufficient. If spread out, randomness in costs/revenue is the primary factor.`;
    }

    return { histogramData: buckets, insight: insightText };
  }, [results, params.simulationDuration]);

  const maxCount = Math.max(...histogramData.map((d) => d.bankrupted + d.survived));
  const avgLifespan = results.averageLifespan;

  return (
    <div style={styles.container} className="nb-card animate-slide-up">
      <div style={styles.header}>
        <h3 style={styles.title}>
          <Icons.BarChart3 size={18} strokeWidth={2.5} />
          Outcome Distribution (Frequency Histogram)
        </h3>
        <span style={styles.badge}>
          {results.runs.length} runs
        </span>
      </div>
      <p style={styles.explainer}>
        <Icons.Info size={13} strokeWidth={2} style={{ flexShrink: 0 }} />
        This <strong>frequency histogram</strong> shows the distribution of simulation outcomes across time. 
        The x-axis represents <strong>when</strong> each run ended (in months). 
        Red bars = runs that went bankrupt during that period. 
        Green bar = runs that <strong>survived the entire duration</strong>.
      </p>
      
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={histogramData} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <XAxis
              dataKey="range"
              stroke="#1a1a1a"
              strokeWidth={2}
              tick={{ fontSize: 10, fontFamily: 'Space Mono' }}
              label={{ value: 'Time Period (Months)', position: 'bottom', offset: 5, fontSize: 12, fontWeight: 700 }}
            />
            <YAxis
              stroke="#1a1a1a"
              strokeWidth={2}
              tick={{ fontSize: 11, fontFamily: 'Space Mono' }}
              label={{ value: 'Frequency (Runs)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12, fontWeight: 700 }}
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
              formatter={(value: any, name: any) => [
                `${value} runs`, 
                name === 'bankrupted' ? 'Bankrupt' : 'Survived'
              ]}
              labelFormatter={(label: any) => `Months ${label}`}
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
                value: `MEAN: ${avgLifespan}mo`,
                position: 'top',
                fill: '#A855F7',
                fontSize: 11,
                fontWeight: 700,
              }}
            />
            <Bar dataKey="bankrupted" stackId="a" radius={0}>
              {histogramData.map((entry, index) => {
                const intensity = maxCount > 0 ? entry.bankrupted / maxCount : 0;
                return (
                  <Cell
                    key={`b-${index}`}
                    fill={`rgba(239, 68, 68, ${0.3 + intensity * 0.7})`}
                    stroke="#1a1a1a"
                    strokeWidth={2}
                  />
                );
              })}
            </Bar>
            <Bar dataKey="survived" stackId="a" radius={0}>
              {histogramData.map((_entry, index) => (
                <Cell
                  key={`s-${index}`}
                  fill="#22C55E"
                  stroke="#1a1a1a"
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: '#EF4444' }} />
          <span>Bankrupt (terminated early)</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: '#22C55E' }} />
          <span>Survived full duration</span>
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: '#A855F7' }} />
          <span>Mean lifespan</span>
        </div>
      </div>

      {/* Contextual Insight */}
      <div style={styles.insightBox}>
        <div style={styles.insightHeader}>
          <Icons.Lightbulb size={14} strokeWidth={2.5} />
          INTERPRETATION
        </div>
        <p style={styles.insightText}>{insight}</p>
        <p style={styles.insightNote}>
          <strong>M&S Concept:</strong> This histogram represents an <em>empirical probability distribution</em> — 
          each bar's height (frequency) divided by total runs gives the empirical probability of that outcome 
          occurring. The shape of this distribution reveals the system's stochastic behavior.
        </p>
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
    marginBottom: 8,
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
  explainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
    fontSize: '0.78rem',
    color: '#777',
    lineHeight: 1.5,
    marginBottom: 16,
    padding: '8px 12px',
    background: '#f8f8f5',
    border: '1px solid #e0e0e0',
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
    flexWrap: 'wrap' as const,
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
  insightBox: {
    marginTop: 16,
    padding: '14px 16px',
    border: '2px solid var(--nb-black)',
    background: 'var(--nb-yellow-light)',
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.7rem',
    fontWeight: 900,
    letterSpacing: '1px',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
  },
  insightText: {
    margin: 0,
    fontSize: '0.82rem',
    lineHeight: 1.5,
    color: '#444',
    marginBottom: 8,
  },
  insightNote: {
    margin: 0,
    fontSize: '0.75rem',
    lineHeight: 1.4,
    color: '#666',
    paddingTop: 8,
    borderTop: '1px solid rgba(0,0,0,0.1)',
    fontStyle: 'italic' as const,
  },
};
