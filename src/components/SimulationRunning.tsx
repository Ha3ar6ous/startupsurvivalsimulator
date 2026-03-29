import { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from './icons';

interface SimulationRunningProps {
  progress: number;
  onViewResults: () => void;
  autoSwitchSeconds: number;
}

// Mini simulation that draws a random capital path on a canvas
function MiniSimCanvas({ color, delay }: { color: string; delay: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dataRef = useRef<number[]>([]);
  const startedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    let capital = 50 + Math.random() * 30; // start between 50-80% height
    dataRef.current = [capital];
    
    const timeout = setTimeout(() => {
      startedRef.current = true;
    }, delay);

    const draw = () => {
      if (!startedRef.current) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Add new data point
      const change = (Math.random() - 0.48) * 8; // slight downward bias for drama
      capital = Math.max(0, Math.min(100, capital + change));
      dataRef.current.push(capital);

      // Keep max 80 points
      if (dataRef.current.length > 80) {
        dataRef.current.shift();
      }

      // Clear & draw
      ctx.clearRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += H / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Bankruptcy line
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, H - 5);
      ctx.lineTo(W, H - 5);
      ctx.stroke();
      ctx.setLineDash([]);

      // Capital path
      const data = dataRef.current;
      if (data.length < 2) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < data.length; i++) {
        const x = (i / 79) * W;
        const y = H - (data[i] / 100) * H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill under curve
      ctx.fillStyle = color.replace(')', ', 0.08)').replace('rgb', 'rgba');
      ctx.lineTo((data.length - 1) / 79 * W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();

      // Current value dot
      const lastX = ((data.length - 1) / 79) * W;
      const lastY = H - (data[data.length - 1] / 100) * H;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animRef.current);
    };
  }, [color, delay]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={120}
      style={miniStyles.canvas}
    />
  );
}

function MiniSimBox({ title, runId, color, delay, status }: { 
  title: string; runId: string; color: string; delay: number; status: string;
}) {
  return (
    <div style={miniStyles.box}>
      <div style={miniStyles.boxHeader}>
        <span style={miniStyles.boxTitle}>
          <span style={{ ...miniStyles.dot, background: color }} />
          {title}
        </span>
        <span style={{ ...miniStyles.statusBadge, color }}>
          {status}
        </span>
      </div>
      <MiniSimCanvas color={color} delay={delay} />
      <div style={miniStyles.boxFooter}>
        <span style={miniStyles.runLabel}>{runId}</span>
        <span style={miniStyles.runLabel}>
          <Icons.Activity size={10} /> LIVE
        </span>
      </div>
    </div>
  );
}

export default function SimulationRunning({ progress, onViewResults, autoSwitchSeconds }: SimulationRunningProps) {
  const [countdown, setCountdown] = useState(autoSwitchSeconds);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setIsComplete(true);
    }
  }, [progress]);

  useEffect(() => {
    if (!isComplete) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onViewResults();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, onViewResults]);

  const stableViewResults = useCallback(() => {
    onViewResults();
  }, [onViewResults]);

  return (
    <div style={styles.container}>
      {/* 2x2 grid of mini simulations + center message */}
      <div style={styles.simGrid}>
        {/* Top Row */}
        <MiniSimBox 
          title="Revenue Path" 
          runId="RUN #247" 
          color="rgb(59, 130, 246)" 
          delay={0} 
          status={isComplete ? 'DONE' : 'RUNNING'} 
        />
        <MiniSimBox 
          title="Cost Dynamics" 
          runId="RUN #512" 
          color="rgb(239, 68, 68)" 
          delay={200} 
          status={isComplete ? 'DONE' : 'RUNNING'} 
        />

        {/* Center Panel */}
        <div style={styles.centerPanel}>
          <div style={styles.centerIcon}>
            <Icons.Dices 
              size={40} 
              strokeWidth={2} 
              style={{ 
                color: 'var(--nb-yellow)',
                animation: isComplete ? 'none' : 'pulse 1.5s infinite ease-in-out',
              }} 
            />
          </div>
          
          <h2 style={styles.title}>
            {isComplete ? 'SIMULATION COMPLETE' : 'MONTE CARLO ENGINE'}
          </h2>
          <p style={styles.subtitle}>
            {isComplete 
              ? 'All scenarios processed successfully'
              : 'Processing stochastic scenarios...'}
          </p>

          {/* Progress */}
          <div style={styles.progressWrapper}>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>
            <span style={styles.progressPercent}>{Math.round(progress)}%</span>
          </div>

          {isComplete && (
            <div style={styles.actionArea} className="animate-slide-up">
              <button 
                className="nb-btn nb-btn-primary" 
                onClick={stableViewResults}
                style={styles.resultsBtn}
              >
                <Icons.BarChart3 size={18} strokeWidth={2.5} />
                VIEW RESULTS
              </button>
              <div style={styles.countdownRow}>
                <Icons.Timer size={13} />
                Auto-redirect in <strong>{countdown}s</strong>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row */}
        <MiniSimBox 
          title="Capital Flow" 
          runId="RUN #891" 
          color="rgb(34, 197, 94)" 
          delay={400} 
          status={isComplete ? 'DONE' : 'RUNNING'} 
        />
        <MiniSimBox 
          title="Market Noise" 
          runId="RUN #103" 
          color="rgb(168, 85, 247)" 
          delay={600} 
          status={isComplete ? 'DONE' : 'RUNNING'} 
        />
      </div>

      {/* Bottom Stats */}
      <div style={styles.statsRow}>
        <StatChip label="Method" value="Monte Carlo" />
        <StatChip label="Distribution" value="Gaussian" />
        <StatChip label="Process" value="Stochastic" />
        <StatChip label="Variables" value="4 Random" />
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.statChip}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
    </div>
  );
}

const miniStyles: Record<string, React.CSSProperties> = {
  box: {
    background: 'var(--nb-black)',
    border: '3px solid #333',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  boxHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 10px',
    borderBottom: '1px solid #333',
  },
  boxTitle: {
    fontSize: '0.6rem',
    fontWeight: 800,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'pulse 1.5s infinite',
  },
  statusBadge: {
    fontSize: '0.55rem',
    fontWeight: 900,
    letterSpacing: '1px',
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '120px',
    background: '#0a0a0a',
  },
  boxFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 10px',
    borderTop: '1px solid #333',
  },
  runLabel: {
    fontSize: '0.5rem',
    fontWeight: 700,
    color: '#555',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    padding: '10px 0',
  },
  simGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto auto',
    gap: 16,
  },
  centerPanel: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    padding: '32px 24px',
    background: 'var(--nb-white)',
    border: '4px solid var(--nb-black)',
    boxShadow: '8px 8px 0px var(--nb-black)',
  },
  centerIcon: {
    background: 'var(--nb-black)',
    padding: '16px',
    border: '3px solid var(--nb-yellow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 900,
    margin: 0,
    letterSpacing: '-0.5px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#888',
    margin: 0,
  },
  progressWrapper: {
    width: '100%',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    width: '100%',
    height: '24px',
    background: '#f0f0f0',
    border: '3px solid var(--nb-black)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'var(--nb-green)',
    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
    backgroundSize: '40px 40px',
    animation: 'progress-bar-stripes 1s linear infinite',
    transition: 'width 0.3s ease-out',
  },
  progressPercent: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 900,
    fontSize: '1rem',
  },
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    width: '100%',
    maxWidth: 400,
  },
  resultsBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '1.1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  countdownRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.82rem',
    color: '#888',
    fontWeight: 600,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  statChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '8px 16px',
    border: '2px solid #eee',
    background: '#fafafa',
  },
  statLabel: {
    fontSize: '0.55rem',
    fontWeight: 800,
    color: '#bbb',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statValue: {
    fontSize: '0.75rem',
    fontWeight: 900,
    color: 'var(--nb-black)',
  },
};
