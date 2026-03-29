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

export default function App() {
  const [params, setParams] = useState<SimulationParams>(defaultParams as SimulationParams);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'charts' | 'animated'>('charts');
  const [runCount, setRunCount] = useState(0);
  const runTimeRef = useRef<number>(0);

  const handleRunSimulation = useCallback(() => {
    setIsRunning(true);
    setProgress(0);

    // Use requestAnimationFrame to keep UI responsive
    requestAnimationFrame(() => {
      const startTime = performance.now();

      const simResults = runSimulation(params, (prog) => {
        setProgress(prog);
      });

      runTimeRef.current = Math.round(performance.now() - startTime);
      setResults(simResults);
      setProgress(100);
      setRunCount((c) => c + 1);

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
              className={`nb-btn nb-btn-sm ${activeTab === 'charts' ? 'nb-btn-primary' : ''}`}
              onClick={() => setActiveTab('charts')}
              style={styles.tabBtn}
            >
              <span>📊</span> Full Simulation
            </button>
            <button
              className={`nb-btn nb-btn-sm ${activeTab === 'animated' ? 'nb-btn-primary' : ''}`}
              onClick={() => setActiveTab('animated')}
              style={styles.tabBtn}
            >
              <span>🎬</span> Animated Run
            </button>
            {runTimeRef.current > 0 && (
              <span style={styles.runTime}>
                ⚡ {runTimeRef.current}ms • Run #{runCount}
              </span>
            )}
          </div>

          {activeTab === 'charts' ? (
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
        <span>
          🎲 Startup Survival Simulator — Monte Carlo Engine
        </span>
        <span style={styles.footerRight}>
          Built with React + Recharts • Neobrutalism UI
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
  },
  tabBtn: {
    textTransform: 'none' as const,
  },
  runTime: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#666',
    background: 'var(--nb-surface)',
    border: '2px solid #ddd',
    padding: '4px 12px',
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
  footerRight: {
    color: '#666',
  },
};
