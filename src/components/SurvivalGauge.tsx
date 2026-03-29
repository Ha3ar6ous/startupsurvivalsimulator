import { Icons } from './icons';

interface SurvivalGaugeProps {
  rate: number;
}

export default function SurvivalGauge({ rate }: SurvivalGaugeProps) {
  const color = rate >= 70 ? 'var(--nb-green)' : rate >= 40 ? 'var(--nb-orange)' : 'var(--nb-red)';

  const GaugeIcon = rate >= 70 ? Icons.Shield : rate >= 40 ? Icons.AlertTriangle : Icons.Skull;

  return (
    <div style={styles.container} className="nb-card animate-slide-up">
      <div style={styles.header}>
        <h3 style={styles.title}>
          <Icons.Gauge size={18} strokeWidth={2.5} />
          Survival Gauge
        </h3>
      </div>
      <p style={styles.explainer}>
        <Icons.Info size={13} strokeWidth={2} style={{ flexShrink: 0 }} />
        This bar shows the overall survival probability. Green = safe, 
        Yellow = risky, Red = likely to fail. Based on all simulation runs combined.
      </p>
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
            <GaugeIcon size={18} strokeWidth={2.5} />
            {rate}%
          </span>
          <span style={styles.gaugeLabel}>100%</span>
        </div>
      </div>
      <div style={styles.verdict}>
        {rate >= 80 ? (
          <span style={{ color: 'var(--nb-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icons.Shield size={16} strokeWidth={2.5} /> Strong survival outlook — low risk of bankruptcy
          </span>
        ) : rate >= 60 ? (
          <span style={{ color: 'var(--nb-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icons.CheckCircle2 size={16} strokeWidth={2.5} /> Good chances, but some risk remains
          </span>
        ) : rate >= 40 ? (
          <span style={{ color: 'var(--nb-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icons.AlertTriangle size={16} strokeWidth={2.5} /> Moderate risk — the startup may struggle
          </span>
        ) : rate >= 20 ? (
          <span style={{ color: 'var(--nb-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icons.Flame size={16} strokeWidth={2.5} /> High risk — survival is unlikely without changes
          </span>
        ) : (
          <span style={{ color: 'var(--nb-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icons.Skull size={16} strokeWidth={2.5} /> Critical — near-certain failure with these settings
          </span>
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
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  verdict: {
    textAlign: 'center' as const,
    fontWeight: 700,
    fontSize: '0.88rem',
    padding: '8px 0 0',
  },
};
