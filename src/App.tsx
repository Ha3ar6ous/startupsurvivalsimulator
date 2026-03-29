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
import SimulationRunning from './components/SimulationRunning';
import { Icons } from './components/icons';

type Tab = 'charts' | 'animated' | 'guide' | 'simulating';

export default function App() {
  const [params, setParams] = useState<SimulationParams>(defaultParams as SimulationParams);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('guide');
  const [runCount, setRunCount] = useState(0);
  const runTimeRef = useRef<number>(0);

  const handleRunSimulation = useCallback(() => {
    setIsRunning(true);
    setProgress(0);
    setActiveTab('simulating');

    // Artificial delay to show simulation progress for modeling feel
    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += Math.random() * 15;
      if (fakeProgress >= 90) {
        clearInterval(interval);
        
        // Run actual simulation
        requestAnimationFrame(() => {
          const startTime = performance.now();
          const simResults = runSimulation(params, (prog) => {
            // Keep actual progress within 90-100% range for the visual
            setProgress(90 + (prog * 0.1));
          });
          
          runTimeRef.current = Math.round(performance.now() - startTime);
          setResults(simResults);
          setProgress(100);
          setRunCount((c) => c + 1);
          setIsRunning(false);
        });
      } else {
        setProgress(fakeProgress);
      }
    }, 150);
  }, [params]);

  const viewResults = useCallback(() => {
    setActiveTab('charts');
  }, []);

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
            isRunning={isRunning || (activeTab === 'simulating' && progress < 100)}
            progress={progress}
          />
        </aside>

        {/* Right Panel: Results Area */}
        <section style={styles.content}>
          {/* Tab Switcher - Only show if not currently simulating */}
          {activeTab !== 'simulating' && (
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
          )}

          {activeTab === 'simulating' ? (
            <SimulationRunning 
              progress={progress} 
              onViewResults={viewResults} 
              autoSwitchSeconds={10} 
            />
          ) : activeTab === 'guide' ? (
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
        <span style={styles.footerCenter}>
          Made with{' '}
          <Icons.Heart size={13} strokeWidth={2.5} style={{ color: '#EF4444', fill: '#EF4444', verticalAlign: 'middle' }} />
          {' '}by{' '}
          <a href="https://github.com/RiteshJha912" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
            Ritesh
          </a>
        </span>
        <span style={styles.footerRight}>
          <a href="https://github.com/Ha3ar6ous/startupsurvivalsimulator" target="_blank" rel="noopener noreferrer" style={styles.starLink}>
            <Icons.Star size={13} strokeWidth={2.5} style={{ color: '#FFD60A', fill: '#FFD60A' }} />
            Star on GitHub
          </a>
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
    background: '#fff',
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
    padding: '20px 0 20px 20px',
    borderRight: '4px solid var(--nb-black)',
    background: 'var(--nb-bg)',
    height: '100vh',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  content: {
    padding: 24,
    minHeight: '100vh',
    background: '#fff',
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
  footerCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: '#aaa',
  },
  footerLink: {
    color: 'var(--nb-yellow)',
    textDecoration: 'none',
    fontWeight: 700,
  },
  footerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  starLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: '#aaa',
    textDecoration: 'none',
    fontWeight: 700,
    padding: '4px 12px',
    border: '2px solid #444',
    transition: 'all 0.2s',
  },
};
