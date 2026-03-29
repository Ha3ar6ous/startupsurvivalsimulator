import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { SimulationParams, MonthData } from '../types';

interface AnimatedRunProps {
  params: SimulationParams;
}

function gaussianRandom(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stdDev + mean;
}

export default function AnimatedRun({ params }: AnimatedRunProps) {
  const [data, setData] = useState<MonthData[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [status, setStatus] = useState<'alive' | 'dead' | 'idle'>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const capitalRef = useRef(params.initialCapital);
  const monthRef = useRef(0);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setData([{ month: 0, capital: params.initialCapital, revenue: 0, costs: 0, funding: 0 }]);
    setIsPlaying(false);
    setIsDone(false);
    setStatus('idle');
    capitalRef.current = params.initialCapital;
    monthRef.current = 0;
  }, [params.initialCapital]);

  useEffect(() => {
    reset();
  }, [reset]);

  const step = useCallback(() => {
    monthRef.current++;
    const month = monthRef.current;

    if (month > params.simulationDuration) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setIsDone(true);
      setStatus('alive');
      return;
    }

    const marketFactor = 1 + gaussianRandom(0, params.marketVolatility / 100);
    const growthMultiplier = Math.pow(1 + params.revenueGrowthRate / 100, month - 1);
    const revenueNoise = gaussianRandom(0, params.revenueRandomness / 100);
    const revenue = Math.max(0, params.monthlyRevenueBase * growthMultiplier * marketFactor * (1 + revenueNoise));

    let costs = params.fixedMonthlyCosts * Math.max(0.5, marketFactor);
    if (Math.random() < params.costSpikeProbability / 100) {
      costs += params.costSpikeMin + Math.random() * (params.costSpikeMax - params.costSpikeMin);
    }

    let funding = 0;
    if (Math.random() < params.fundingProbability / 100) {
      funding = params.fundingMin + Math.random() * (params.fundingMax - params.fundingMin);
    }

    capitalRef.current = capitalRef.current + revenue - costs + funding;

    const newPoint: MonthData = {
      month,
      capital: Math.round(capitalRef.current * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
      costs: Math.round(costs * 100) / 100,
      funding: Math.round(funding * 100) / 100,
    };

    setData((prev) => [...prev, newPoint]);

    if (capitalRef.current <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setIsDone(true);
      setStatus('dead');
    }
  }, [params]);

  const play = useCallback(() => {
    if (isDone) reset();
    setIsPlaying(true);
    intervalRef.current = setInterval(step, 120);
  }, [isDone, reset, step]);

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const currentCapital = data.length > 0 ? data[data.length - 1].capital : params.initialCapital;
  const currentMonth = data.length > 0 ? data[data.length - 1].month : 0;

  return (
    <div style={styles.container} className="nb-card">
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span>🎬</span> Animated Single Run
        </h3>
        <div style={styles.controls}>
          {!isPlaying ? (
            <button className="nb-btn nb-btn-sm nb-btn-primary" onClick={play}>
              {isDone ? '🔄 Replay' : '▶ Play'}
            </button>
          ) : (
            <button className="nb-btn nb-btn-sm nb-btn-danger" onClick={pause}>
              ⏸ Pause
            </button>
          )}
          <button className="nb-btn nb-btn-sm" onClick={reset}>
            ↩ Reset
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div style={styles.statusBar}>
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>Month</span>
          <span style={styles.statusValue}>{currentMonth} / {params.simulationDuration}</span>
        </div>
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>Capital</span>
          <span style={{
            ...styles.statusValue,
            color: currentCapital >= 0 ? 'var(--nb-green)' : 'var(--nb-red)',
          }}>
            ${currentCapital.toLocaleString()}
          </span>
        </div>
        <div style={styles.statusItem}>
          <span style={styles.statusLabel}>Status</span>
          <span style={{
            ...styles.statusBadge,
            background: status === 'dead' ? 'var(--nb-red)' :
              status === 'alive' ? 'var(--nb-green)' : 'var(--nb-yellow)',
            color: status === 'dead' ? 'white' : 'var(--nb-black)',
          }}>
            {status === 'dead' ? '💀 DEAD' : status === 'alive' ? '✅ SURVIVED' : '⏳ WAITING'}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <XAxis
              dataKey="month"
              stroke="#1a1a1a"
              strokeWidth={2}
              tick={{ fontSize: 11, fontFamily: 'Space Mono' }}
              domain={[0, params.simulationDuration]}
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
            />
            <ReferenceLine y={0} stroke="#EF4444" strokeWidth={2} strokeDasharray="8 4" />
            <Line
              type="monotone"
              dataKey="capital"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
              animationDuration={0}
            />
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
  controls: {
    display: 'flex',
    gap: 8,
  },
  statusBar: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
    padding: '10px 16px',
    background: 'var(--nb-black)',
    border: 'var(--nb-border)',
    flexWrap: 'wrap' as const,
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  statusLabel: {
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: '#888',
    letterSpacing: '0.5px',
  },
  statusValue: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'var(--nb-yellow)',
  },
  statusBadge: {
    padding: '2px 8px',
    fontWeight: 700,
    fontSize: '0.7rem',
    border: '2px solid var(--nb-black)',
    textTransform: 'uppercase' as const,
  },
  chartWrapper: {
    border: 'var(--nb-border)',
    background: '#fafaf9',
    padding: '10px 0',
  },
};
