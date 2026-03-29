import { useState, useEffect } from 'react';

export default function Header() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.titleRow}>
          <div style={styles.badge}>
            <span style={styles.badgeIcon}>🎲</span>
            <span>MONTE CARLO</span>
          </div>
          <h1 style={{
            ...styles.title,
            ...(glitch ? styles.titleGlitch : {}),
          }}>
            Startup Survival Simulator
          </h1>
          <p style={styles.subtitle}>
            Model startup performance under uncertainty using probabilistic simulation.
            Configure parameters, run thousands of scenarios, and visualize survival outcomes.
          </p>
        </div>
        <div style={styles.stats}>
          <div style={{ ...styles.chip, background: 'var(--nb-yellow)' }}>
            <span>⚡</span> Real-time Engine
          </div>
          <div style={{ ...styles.chip, background: 'var(--nb-blue-light)' }}>
            <span>📊</span> Interactive Charts
          </div>
          <div style={{ ...styles.chip, background: 'var(--nb-green-light)' }}>
            <span>🎯</span> Up to 5000 Runs
          </div>
        </div>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: 'var(--nb-black)',
    color: 'var(--nb-white)',
    borderBottom: '4px solid var(--nb-yellow)',
    padding: '32px 24px 28px',
  },
  inner: {
    maxWidth: 1440,
    margin: '0 auto',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--nb-yellow)',
    color: 'var(--nb-black)',
    padding: '4px 14px',
    border: '2px solid var(--nb-yellow)',
    fontWeight: 700,
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    width: 'fit-content',
  },
  badgeIcon: {
    fontSize: '1rem',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    transition: 'all 0.1s',
  },
  titleGlitch: {
    textShadow: '2px 0 var(--nb-red), -2px 0 var(--nb-blue)',
    transform: 'skewX(-1deg)',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#aaa',
    maxWidth: 680,
    lineHeight: 1.5,
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 10,
    marginTop: 20,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    border: '2px solid var(--nb-black)',
    fontWeight: 700,
    fontSize: '0.78rem',
    color: 'var(--nb-black)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
};
