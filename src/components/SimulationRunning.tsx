import { useState, useEffect } from 'react';
import { Icons } from './icons';

interface SimulationRunningProps {
  progress: number;
  onViewResults: () => void;
  autoSwitchSeconds: number;
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

  return (
    <div style={styles.container} className="nb-card animate-slide-up">
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          <Icons.Zap 
            size={64} 
            strokeWidth={2.5} 
            style={{ 
              color: 'var(--nb-yellow)',
              animation: isComplete ? 'none' : 'pulse 1s infinite' 
            }} 
          />
        </div>
        
        <h2 style={styles.title}>
          {isComplete ? 'SIMULATION COMPLETE!' : 'RUNNING MONTE CARLO ENGINE...'}
        </h2>
        
        <p style={styles.subtitle}>
          {isComplete 
            ? 'Thousands of scenarios have been calculated. Ready to see the outcomes?'
            : 'Processing random paths for revenue, costs, and market volatility...'}
        </p>

        {/* Progress bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          </div>
          <div style={styles.progressLabel}>
            {Math.round(progress)}%
          </div>
        </div>

        {isComplete && (
          <div style={styles.actionArea} className="animate-slide-up">
            <button 
              className="nb-btn nb-btn-primary" 
              onClick={onViewResults}
              style={styles.resultsBtn}
            >
              <Icons.BarChart3 size={20} strokeWidth={2.5} />
              VIEW DETAILED RESULTS
            </button>
            <div style={styles.countdownText}>
              <Icons.Timer size={14} />
              Auto-redirecting in <strong>{countdown}s</strong>...
            </div>
          </div>
        )}

        <div style={styles.statsRow}>
          <StatBox label="Process" value="Stochastic" icon={<Icons.Layers size={14} />} />
          <StatBox label="Distribution" value="Gaussian" icon={<Icons.Activity size={14} />} />
          <StatBox label="Method" value="Monte Carlo" icon={<Icons.Dices size={14} />} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div style={styles.statBox}>
      <div style={styles.statLabel}>{icon} {label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--nb-white)',
    padding: '40px',
  },
  content: {
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 24,
  },
  iconWrapper: {
    background: 'var(--nb-black)',
    padding: '24px',
    border: '4px solid var(--nb-yellow)',
    boxShadow: '8px 8px 0px var(--nb-black)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 900,
    margin: 0,
    letterSpacing: '-1px',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
    lineHeight: 1.5,
  },
  progressContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  progressTrack: {
    height: '32px',
    background: 'var(--nb-white)',
    border: '4px solid var(--nb-black)',
    position: 'relative' as const,
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
  progressLabel: {
    fontSize: '1.2rem',
    fontWeight: 900,
    fontFamily: 'var(--font-mono)',
  },
  actionArea: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  resultsBtn: {
    width: '100%',
    padding: '20px',
    fontSize: '1.2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  countdownText: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.9rem',
    color: '#888',
    fontWeight: 600,
  },
  statsRow: {
    display: 'flex',
    gap: 24,
    marginTop: 20,
    borderTop: '2px solid #eee',
    paddingTop: 24,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  statLabel: {
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: '#aaa',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: '0.8rem',
    fontWeight: 900,
    color: 'var(--nb-black)',
  },
};
