import { useState, useCallback, useRef } from 'react';
import type { SimulationParams, SimulationResults } from './types';
import { runSimulation } from './engine/simulation';
import { defaultParams } from './presets/scenarios';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ResultsPanel from './components/ResultsPanel';
import CapitalChart from './components/CapitalChart';
import OutcomeHistogram from './components/OutcomeHistogram';
import SurvivalGauge from './components/SurvivalGauge';
import AnimatedRun from './components/AnimatedRun';
import GuidePanel from './components/GuidePanel';
import { Icons } from './components/icons';

export default function App() {
  const [params, setParams] = useState<SimulationParams>(defaultParams as SimulationParams);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'charts' | 'animated' | 'guide'>('guide');
  const [runCount, setRunCount] = useState(0);
  const runTimeRef = useRef<number>(0);

  const handleRunSimulation = useCallback(() => {
    setIsRunning(true);
    setProgress(0);

    requestAnimationFrame(() => {
      const startTime = performance.now();

      const simResults = runSimulation(params, (prog) => {
        setProgress(prog);
      });

      runTimeRef.current = Math.round(performance.now() - startTime);
      setResults(simResults);
      setProgress(100);
      setRunCount((c) => c + 1);
      setActiveTab('charts');

      setTimeout(() => {
        setIsRunning(false);
      }, 300);
    });
  }, [params]);

  return (
    <div style={styles.app}>
      <Header />

      <main style={styles.main}>
        {/* Left Panel: Controls */}
        <aside style={styles.sidebar}>
          <ControlPanel
            params={params}
            onParamsChange={setParams}
            onRunSimulation={handleRunSimulation}
            isRunning={isRunning}
            progress={progress}
          />
        </aside>

        {/* Right Panel: Results */}
        <section style={styles.content}>
          {/* Tab Switcher */}
          <div style={styles.tabBar}>
            <button
              className={`nb-btn nb-btn-sm ${activeTab === 'guide' ? 'nb-btn-primary' : ''}`}
              onClick={() => setActiveTab('guide')}
              style={styles.tabBtn}
            >
              <Icons.BookOpen size={14} strokeWidth={2.5} />
              How It Works
            </button>
            <button
              className={`nb-btn nb-btn-sm ${activeTab === 'charts' ? 'nb-btn-primary' : ''}`}
              onClick={() => setActiveTab('charts')}
              style={styles.tabBtn}
            >
              <Icons.BarChart3 size={14} strokeWidth={2.5} />
              Results
            </button>
            <button
              className={`nb-btn nb-btn-sm ${activeTab === 'animated' ? 'nb-btn-primary' : ''}`}
              onClick={() => setActiveTab('animated')}
              style={styles.tabBtn}
            >
              <Icons.Eye size={14} strokeWidth={2.5} />
              Watch a Run
            </button>
            {runTimeRef.current > 0 && (
              <span style={styles.runTime}>
                <Icons.Zap size={12} strokeWidth={2.5} />
                {runTimeRef.current}ms | Run #{runCount}
              </span>
            )}
          </div>

          {activeTab === 'guide' ? (
            <div style={styles.resultsArea}>
              <GuidePanel />
            </div>
          ) : activeTab === 'charts' ? (
            <div style={styles.resultsArea}>
              <ResultsPanel results={results} params={params} />
              {results && (
                <>
                  <SurvivalGauge rate={results.survivalRate} />
                  <CapitalChart results={results} />
                  <OutcomeHistogram results={results} params={params} />
                </>
              )}
            </div>
          ) : (
            <div style={styles.resultsArea}>
              <AnimatedRun params={params} />
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerLeft}>
          <Icons.Dices size={14} strokeWidth={2.5} />
          Startup Survival Simulator — Monte Carlo Engine
        </span>
        <span style={styles.footerRight}>
          Built with React + Recharts | Modeling & Simulation Project
        </span>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    gap: 0,
    flex: 1,
    maxWidth: 1600,
    margin: '0 auto',
    width: '100%',
  },
  sidebar: {
    padding: 20,
    borderRight: 'var(--nb-border)',
    background: 'var(--nb-bg)',
    maxHeight: 'calc(100vh - 160px)',
    overflowY: 'auto' as const,
    position: 'sticky' as const,
    top: 0,
  },
  content: {
    padding: 24,
    minHeight: '100vh',
  },
  tabBar: {
    display: 'flex',
    gap: 10,
    marginBottom: 24,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  tabBtn: {
    textTransform: 'none' as const,
  },
  runTime: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#666',
    background: 'var(--nb-surface)',
    border: '2px solid #ddd',
    padding: '4px 12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  resultsArea: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24,
  },
  footer: {
    background: 'var(--nb-black)',
    color: '#888',
    borderTop: '4px solid var(--nb-yellow)',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    fontWeight: 600,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  footerRight: {
    color: '#666',
  },
};
