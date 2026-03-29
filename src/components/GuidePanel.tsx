import { Icons } from './icons';
import { useState } from 'react';

export default function GuidePanel() {
  const [openSection, setOpenSection] = useState<string | null>('what');

  const toggle = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div style={styles.container} className="nb-card animate-slide-up">
      <div style={styles.header}>
        <h3 style={styles.title}>
          <Icons.BookOpen size={18} strokeWidth={2.5} />
          How This Simulator Works
        </h3>
        <span style={styles.badge}>
          <Icons.Lightbulb size={12} strokeWidth={2.5} />
          LEARN
        </span>
      </div>

      {sections.map((section) => (
        <div key={section.key} style={styles.section}>
          <button
            onClick={() => toggle(section.key)}
            style={styles.sectionBtn}
          >
            <div style={styles.sectionLeft}>
              <section.icon size={16} strokeWidth={2.5} style={{ color: section.color }} />
              <span>{section.title}</span>
            </div>
            {openSection === section.key ? (
              <Icons.ChevronUp size={16} />
            ) : (
              <Icons.ChevronDown size={16} />
            )}
          </button>
          {openSection === section.key && (
            <div style={styles.sectionContent}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: 'var(--nb-border)',
    background: 'var(--nb-yellow-light)',
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: 0,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: '0.65rem',
    fontWeight: 700,
    background: 'var(--nb-yellow)',
    color: 'var(--nb-black)',
    padding: '3px 10px',
    border: '2px solid var(--nb-black)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  section: {
    borderBottom: '1px solid #e0e0e0',
  },
  sectionBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    color: 'var(--nb-black)',
    transition: 'background 0.15s',
  },
  sectionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  sectionContent: {
    padding: '0 20px 16px',
    animation: 'slideUp 0.2s ease-out',
  },
  p: {
    fontSize: '0.83rem',
    lineHeight: 1.6,
    color: '#444',
    marginBottom: 10,
  },
  ol: {
    fontSize: '0.83rem',
    lineHeight: 1.8,
    color: '#444',
    paddingLeft: 20,
    marginBottom: 10,
  },
  paramExplain: {
    fontSize: '0.82rem',
    lineHeight: 1.5,
    color: '#444',
    padding: '6px 0',
    borderBottom: '1px solid #f0f0f0',
  },
};

const sections = [
  {
    key: 'what',
    title: 'What is this?',
    icon: Icons.HelpCircle,
    color: 'var(--nb-blue)',
    content: (
      <div>
        <p style={styles.p}>
          This simulator models how a <strong>startup (small business)</strong> might perform 
          over time. Think of it as a "what-if" machine — it runs your business scenario 
          hundreds or thousands of times with different random events each time.
        </p>
        <p style={styles.p}>
          Each run is like one possible future. Some futures are good (the business 
          survives), some are bad (it runs out of money). By running many scenarios, 
          we can calculate the <strong>probability of survival</strong>.
        </p>
      </div>
    ),
  },
  {
    key: 'monte',
    title: 'What is Monte Carlo Simulation?',
    icon: Icons.Dices,
    color: 'var(--nb-purple)',
    content: (
      <div>
        <p style={styles.p}>
          <strong>Monte Carlo simulation</strong> is a technique that uses random sampling 
          to solve problems. Instead of trying to calculate an exact answer, we:
        </p>
        <ol style={styles.ol}>
          <li>Run the same scenario many times (100-5000 runs)</li>
          <li>Each time, add randomness (like dice rolls) to the inputs</li>
          <li>Collect all the results</li>
          <li>Use statistics to find patterns and probabilities</li>
        </ol>
        <p style={styles.p}>
          It's named after the Monte Carlo casino in Monaco — because it uses randomness, 
          just like gambling!
        </p>
      </div>
    ),
  },
  {
    key: 'params',
    title: 'Understanding the Parameters',
    icon: Icons.Settings,
    color: 'var(--nb-orange)',
    content: (
      <div>
        <div style={styles.paramExplain}>
          <strong>Starting Money (₹):</strong> How much money the startup begins with. 
          Like the initial investment or savings.
        </div>
        <div style={styles.paramExplain}>
          <strong>Monthly Income:</strong> How much money comes in every month from 
          customers. Revenue = money earned.
        </div>
        <div style={styles.paramExplain}>
          <strong>Growth Rate (%):</strong> How fast your income grows each month. 
          5% means income increases by 5% every month.
        </div>
        <div style={styles.paramExplain}>
          <strong>Income Randomness (%):</strong> How unpredictable your income is. 
          Higher = more variation month to month.
        </div>
        <div style={styles.paramExplain}>
          <strong>Monthly Expenses (₹):</strong> Fixed costs like rent, salaries, servers. 
          Must be paid every month.
        </div>
        <div style={styles.paramExplain}>
          <strong>Surprise Cost Chance (%):</strong> Probability that an unexpected 
          expense pops up (like equipment breaking, legal issues).
        </div>
        <div style={styles.paramExplain}>
          <strong>Funding Chance (%):</strong> Probability an investor puts money into 
          the startup in any given month.
        </div>
        <div style={styles.paramExplain}>
          <strong>Market Ups & Downs (%):</strong> How much the overall market affects 
          both income and costs. Higher = more chaos.
        </div>
      </div>
    ),
  },
  {
    key: 'results',
    title: 'Reading the Results',
    icon: Icons.BarChart3,
    color: 'var(--nb-green)',
    content: (
      <div>
        <div style={styles.paramExplain}>
          <strong>Survival Rate:</strong> Out of all simulation runs, how many survived 
          the full duration? 70% means 7 out of 10 hypothetical startups would survive.
        </div>
        <div style={styles.paramExplain}>
          <strong>Average Lifespan:</strong> On average, how many months did the startup 
          last before running out of money (or reaching the end)?
        </div>
        <div style={styles.paramExplain}>
          <strong>Capital Over Time Chart:</strong> Each colored line is one possible 
          future. If a line hits ₹0, the startup went bankrupt in that scenario.
        </div>
        <div style={styles.paramExplain}>
          <strong>Distribution Histogram:</strong> Shows how many runs ended at each 
          month. A tall green bar at the end = many survived. Red bars = bankruptcies.
        </div>
      </div>
    ),
  },
  {
    key: 'concepts',
    title: 'Key M&S Concepts Used Here',
    icon: Icons.GraduationCap,
    color: 'var(--nb-red)',
    content: (
      <div>
        <div style={styles.paramExplain}>
          <strong>Stochastic Modeling:</strong> Using random variables to model 
          uncertainty. Our revenue, costs, and funding are all stochastic (random).
        </div>
        <div style={styles.paramExplain}>
          <strong>Random Variables:</strong> Values that change randomly each run. 
          We use Gaussian (normal) distribution for realistic randomness.
        </div>
        <div style={styles.paramExplain}>
          <strong>Probability Distribution:</strong> The histogram shows the 
          distribution of outcomes — how likely each result is.
        </div>
        <div style={styles.paramExplain}>
          <strong>Statistical Analysis:</strong> Mean (average), median (middle value), 
          standard deviation (spread), and percentiles help us understand the results.
        </div>
        <div style={styles.paramExplain}>
          <strong>Variance & Risk:</strong> Higher variance = more unpredictable outcomes. 
          In business, this means more risk.
        </div>
      </div>
    ),
  },
];
