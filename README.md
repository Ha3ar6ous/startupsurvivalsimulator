# Startup Survival Simulator

A powerful, interactive web application that models and simulates startup survival under uncertainty using **Monte Carlo simulation** and stochastic processes.

Built with a bold **Neobrutalist** design system, this tool allows users to explore how randomness in revenue, costs, funding, and market conditions affects the probability of a startup's success.

## Features

- **Monte Carlo Engine**: Runs 100 to 5000+ simulations in milliseconds using a high-performance JavaScript engine.
- **India-Specific Presets**: Configurations inspired by real-world Indian startup models (D2C, Fintech, Ed-Tech, Rapid Delivery).
- **Interactive Visualizations**:
  - **Capital Paths**: Multi-run overlay line charts showing individual "possible futures".
  - **Outcome Distribution**: Stacked frequency histograms for bankruptcy vs. survival with contextual interpretation.
  - **Survival Gauge**: Instant probability verdict based on statistical outcomes.
- **Animated Run Mode**: Step-by-step playback of a single simulation run to observe month-by-month changes.
- **Live Simulation View**: 4 animated mini-simulation canvases showing real-time stochastic paths during computation.
- **Data Export**: Export your simulation results to **JSON** or **CSV** for further analysis.
- **Educational Guide**: Built-in documentation on M&S concepts (Stochastic modeling, Gaussian distribution, variance, risk).

## Tech Stack

| Technology | Purpose |
|---|---|
| [React](https://reactjs.org/) | UI Framework (Hooks & Functional Components) |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Recharts](https://recharts.org/) | Data Visualization |
| [Lucide React](https://lucide.dev/) | Icon System |
| Custom CSS | Neobrutalism Design System |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |

## Project Structure

```text
src/
├── components/          # React Components
│   ├── AnimatedRun      # Step-by-step simulation playback
│   ├── CapitalChart     # Recharts multi-line chart
│   ├── ControlPanel     # Configuration UI & Presets
│   ├── GuidePanel       # Educational content & docs
│   ├── Header           # Branding & startup marquee
│   ├── Icons            # Centralized Lucide icon map
│   ├── OutcomeHistogram # Outcome frequency distribution
│   ├── ResultsPanel     # Metrics & statistical tables
│   ├── SimulationRun    # Live simulation running view
│   ├── SurvivalGauge    # Probability visualizer
│   └── Tooltip          # Accessible info tooltips
├── engine/              # Core Logic
│   └── simulation.ts    # Monte Carlo simulation engine
├── presets/             # Data
│   └── scenarios.ts     # Pre-defined startup scenarios
├── utils/               # Utilities
│   └── export.ts        # CSV/JSON export logic
├── types.ts             # Global TypeScript interfaces
├── App.tsx              # Main layout & state orchestration
├── main.tsx             # Application entry point
└── index.css            # Neobrutalist design system & tokens
```

---

## Modeling & Simulation Syllabus Coverage

This project implements concepts from the following **M&S syllabus modules** (SVU-KJSCE 2023 Curriculum):

### Module 1: Introduction to Modeling and Simulation
| Topic | Implementation |
|---|---|
| **Systems, Models and Simulation** | The startup is modeled as a discrete system with state variables (capital, revenue, costs). The simulation iterates over discrete time steps (months). |
| **Simulation Examples** | The project itself is a simulation example — modeling a financial system under uncertainty, analogous to inventory simulation and reliability problems. |
| **Discrete-Event Simulation** | Revenue events, cost spikes, and funding rounds are modeled as discrete events occurring at each time step with defined probabilities. |
| **Steps of Simulation Study** | The app follows the standard simulation study steps: Problem Formulation → Input Modeling → Model Building → Verification → Output Analysis. |
| **Time-Advance Algorithm** | The simulation uses a fixed-increment time advance — each iteration represents one month. |

### Module 2: Basic Probability and Statistics
| Topic | Implementation |
|---|---|
| **Bernoulli Trials & Distribution** | Cost spike events and funding events use Bernoulli trials — each month has a fixed probability of the event occurring (success/failure). |
| **Normal (Gaussian) Distribution** | Revenue randomness and market volatility are modeled using the Normal distribution via Box-Muller transform. |
| **Uniform Distribution** | Cost spike amounts and funding amounts are sampled from a Uniform distribution between [min, max]. |
| **Useful Statistical Models** | The output analysis computes mean, median, standard deviation, and percentiles — all fundamental statistical measures. |
| **Empirical Distributions** | The outcome histogram is an empirical probability distribution constructed from simulation output data. |

### Module 3: Random Numbers and Random Variates
| Topic | Implementation |
|---|---|
| **Random Number Generation** | Uses JavaScript's `Math.random()` (PRNG) as the underlying uniform random number source. |
| **Generating Random Variates (Inverse Transform)** | The Box-Muller transform is used to generate Gaussian variates from uniform random numbers — a direct application of variate generation techniques. |
| **Generating Continuous Random Variates** | Continuous variates from Normal and Uniform distributions are generated for revenue noise and market factors. |

### Module 4: Input Modeling
| Topic | Implementation |
|---|---|
| **Data Collection & Histograms** | The simulation output is visualized as frequency histograms (Outcome Distribution chart), directly applying histogram-based data analysis. |
| **Parameter Estimation** | Users provide input parameters (mean revenue, variance, probabilities) — this is the parameter estimation step of input modeling. |
| **Sample Mean and Variance** | Computed from simulation output: average lifespan, standard deviation of lifespan, average final capital. |
| **Selecting the Family of Distributions** | Different parameters map to specific distribution families: Normal for revenue, Uniform for costs, Bernoulli for events. |

### Module 5: Verification, Validation and Output Analysis
| Topic | Implementation |
|---|---|
| **Output Analysis** | The results panel provides comprehensive output analysis: survival rate, bankruptcy rate, percentiles (P10, P90), mean, median. |
| **Types of Simulations** | This is a **terminating simulation** — each run ends at a fixed duration or when capital reaches zero. |
| **Stochastic Nature of Output Data** | Each simulation run produces different results due to randomness. Running 500+ runs demonstrates the stochastic nature of output. |
| **Measures of Performance** | Survival rate, average lifespan, and final capital serve as performance measures for evaluating the system. |
| **Verification of Simulation Models** | Users can verify results by watching individual animated runs and comparing against the batch simulation output. |

---

## Getting Started

```bash
git clone https://github.com/Ha3ar6ous/startupsurvivalsimulator.git
cd startupsurvivalsimulator
npm install
npm run dev
```

## License

MIT

---

Made with ❤️ by [Ritesh](https://github.com/RiteshJha912) | [⭐ Star on GitHub](https://github.com/Ha3ar6ous/startupsurvivalsimulator)
