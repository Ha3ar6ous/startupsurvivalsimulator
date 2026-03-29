import { useState, useEffect } from 'react';
import { Icons } from './icons';

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
            <Icons.Dices size={16} />
            <span>MONTE CARLO SIMULATION</span>
          </div>
          <h1 style={{
            ...styles.title,
            ...(glitch ? styles.titleGlitch : {}),
          }}>
            Startup Survival Simulator
          </h1>
          <p style={styles.subtitle}>
            Understand how startups survive or fail under uncertainty. Tweak parameters, 
            run thousands of random scenarios, and see the probability of survival — 
            all powered by Monte Carlo simulation.
          </p>
        </div>
        <div style={styles.stats}>
          <div style={{ ...styles.chip, background: 'var(--nb-yellow)' }}>
            <Icons.Activity size={14} strokeWidth={2.5} />
            Real-time Engine
          </div>
          <div style={{ ...styles.chip, background: 'var(--nb-blue-light)' }}>
            <Icons.BarChart3 size={14} strokeWidth={2.5} />
            Interactive Charts
          </div>
          <div style={{ ...styles.chip, background: 'var(--nb-green-light)' }}>
            <Icons.IndianRupee size={14} strokeWidth={2.5} />
            India Focused
          </div>
          <div style={{ ...styles.chip, background: 'var(--nb-orange-light)' }}>
            <Icons.BookOpen size={14} strokeWidth={2.5} />
            Learn M&S Concepts
          </div>
        </div>

        {/* Indian Startup Marquee */}
        <div style={styles.startupBanner}>
          <span style={styles.bannerLabel}>
            <Icons.Building2 size={12} strokeWidth={2.5} />
            INSPIRED BY
          </span>
          <div style={styles.startupLogos}>
            {indianStartups.map((s) => (
              <span key={s.name} style={{ ...styles.startupLogo, color: s.color, borderColor: s.color }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

const indianStartups = [
  { name: 'Flipkart', color: '#2874F0' },
  { name: 'Zomato', color: '#E23744' },
  { name: 'Paytm', color: '#00BAF2' },
  { name: 'Razorpay', color: '#3395FF' },
  { name: 'CRED', color: '#E5E5E5' },
  { name: 'Zerodha', color: '#387ED1' },
  { name: 'Ola', color: '#1C8C37' },
  { name: 'BYJU\'S', color: '#8B2F9A' },
  { name: 'Zepto', color: '#6C2DC7' },
  { name: 'boAt', color: '#E53935' },
];

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: 'var(--nb-black)',
    color: 'var(--nb-white)',
    borderBottom: '4px solid var(--nb-yellow)',
    padding: '32px 24px 24px',
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
    fontSize: '0.72rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    width: 'fit-content',
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
    fontSize: '0.95rem',
    color: '#aaa',
    maxWidth: 700,
    lineHeight: 1.6,
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
    fontSize: '0.75rem',
    color: 'var(--nb-black)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  startupBanner: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap' as const,
  },
  bannerLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.65rem',
    fontWeight: 700,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    whiteSpace: 'nowrap' as const,
  },
  startupLogos: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  startupLogo: {
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '3px 10px',
    border: '1.5px solid',
    letterSpacing: '0.5px',
    opacity: 0.7,
  },
};
