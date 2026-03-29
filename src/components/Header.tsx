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
          <div style={styles.bannerLabel}>
            <Icons.Building2 size={12} strokeWidth={2.5} />
            INSPIRED BY
          </div>
          <div style={styles.marqueeContainer}>
            <div className="nb-marquee">
              {/* Render twice for continuous scrolling */}
              {[...indianStartups, ...indianStartups].map((s, idx) => (
                <span 
                  key={`${s.name}-${idx}`} 
                  style={{ ...styles.startupLogo, color: s.color, borderColor: s.color }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const indianStartups = [
  { name: 'Flipkart', color: '#2874F0' },
  { name: 'Zomato', color: '#E23744' },
  { name: 'Swiggy', color: '#FC8019' },
  { name: 'Paytm', color: '#00BAF2' },
  { name: 'PhonePe', color: '#5F259F' },
  { name: 'Razorpay', color: '#3395FF' },
  { name: 'CRED', color: '#FFFFFF' },
  { name: 'Zerodha', color: '#387ED1' },
  { name: 'Groww', color: '#00D09C' },
  { name: 'Ola', color: '#1C8C37' },
  { name: 'Zepto', color: '#6C2DC7' },
  { name: 'Lenskart', color: '#00BAC6' },
  { name: 'Nykaa', color: '#FC2779' },
  { name: 'Mamaearth', color: '#00AE44' },
  { name: 'BYJU\'S', color: '#8B2F9A' },
  { name: 'boAt', color: '#E53935' },
  { name: 'Urban Company', color: '#FFFFFF' },
  { name: 'Postman', color: '#FF6C37' },
  { name: 'Unacademy', color: '#08BD80' },
  { name: 'PhysicsWallah', color: '#FFFFFF' },
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
    marginTop: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    borderTop: '1px solid #333',
    paddingTop: 16,
    overflow: 'hidden',
  },
  marqueeContainer: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  bannerLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.65rem',
    fontWeight: 900,
    color: 'var(--nb-yellow)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    whiteSpace: 'nowrap' as const,
    zIndex: 2,
    background: 'var(--nb-black)',
    paddingRight: 8,
  },
  startupLogo: {
    fontSize: '0.65rem',
    fontWeight: 800,
    padding: '4px 12px',
    border: '2px solid',
    letterSpacing: '0.5px',
    background: 'rgba(255,255,255,0.05)',
    whiteSpace: 'nowrap' as const,
    boxShadow: '1px 1px 0px currentColor',
  },
};
