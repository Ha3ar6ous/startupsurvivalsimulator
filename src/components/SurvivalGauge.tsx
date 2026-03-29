interface SurvivalGaugeProps {
  rate: number; // 0-100
}

export default function SurvivalGauge({ rate }: SurvivalGaugeProps) {
  const color = rate >= 70 ? 'var(--nb-green)' : rate >= 40 ? 'var(--nb-orange)' : 'var(--nb-red)';
  const emoji = rate >= 70 ? '🟢' : rate >= 40 ? '🟡' : '🔴';

  return (
    <div style={styles.container} className="nb-card animate-slide-up">
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span>🎯</span> Survival Gauge
        </h3>
      </div>
      <div style={styles.gaugeWrapper}>
        <div style={styles.gaugeBackground}>
          <div
            style={{
              ...styles.gaugeFill,
              width: `${rate}%`,
              background: color,
            }}
          />
        </div>
        <div style={styles.gaugeLabels}>
          <span style={styles.gaugeLabel}>0%</span>
          <span style={{ ...styles.gaugeCenter, color }}>
            {emoji} {rate}%
          </span>
          <span style={styles.gaugeLabel}>100%</span>
        </div>
      </div>
      <div style={styles.verdict}>
        {rate >= 80 ? (
          <span style={{ color: 'var(--nb-green)' }}>💪 Strong survival outlook</span>
        ) : rate >= 60 ? (
          <span style={{ color: 'var(--nb-green)' }}>👍 Good chances, some risk</span>
        ) : rate >= 40 ? (
          <span style={{ color: 'var(--nb-orange)' }}>⚠️ Moderate risk — proceed with caution</span>
        ) : rate >= 20 ? (
          <span style={{ color: 'var(--nb-red)' }}>🚨 High risk — survival unlikely</span>
        ) : (
          <span style={{ color: 'var(--nb-red)' }}>💀 Critical — near-certain failure</span>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 20,
  },
  header: {
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
  gaugeWrapper: {
    marginBottom: 12,
  },
  gaugeBackground: {
    height: 32,
    background: '#e5e5e5',
    border: 'var(--nb-border)',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  gaugeFill: {
    height: '100%',
    transition: 'width 1s ease-out',
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0,0,0,0.05) 10px,
      rgba(0,0,0,0.05) 20px
    )`,
  },
  gaugeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  gaugeLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#999',
  },
  gaugeCenter: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.3rem',
    fontWeight: 700,
  },
  verdict: {
    textAlign: 'center' as const,
    fontWeight: 700,
    fontSize: '0.9rem',
    padding: '8px 0 0',
  },
};
