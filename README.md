# 🚀 Startup Survival Simulator

A powerful, interactive web application designed to model and simulate startup survival under uncertainty using **Monte Carlo simulation** and stochastic processes. 

Built with a bold **Neobrutalist** design system, this tool allows entrepreneurs and students to explore how randomness in revenue, costs, funding, and market conditions affects the probability of a startup's success.

![Startup Simulator Preview](https://github.com/Ha3ar6ous/startupsurvivalsimulator/raw/main/preview.png)

## ✨ Features

- **Monte Carlo Engine**: Runs 100 to 5000+ simulations in milliseconds using a high-performance JavaScript engine.
- **India-Specific Presets**: Configurations inspired by real-world Indian startup models (D2C, Fintech, Ed-Tech, Quick Commerce).
- **Interactive Visualizations**:
  - **Capital Paths**: Multi-run overlay line charts showing individual "possible futures".
  - **Lifespan Distribution**: Color-coded histograms for bankruptcy vs. survival data.
  - **Survival Gauge**: Instant probability verdict based on statistical outcomes.
- **Animated Run Mode**: Step-by-step playback of a single simulation run to observe month-by-month changes.
- **Data Export**: Export your simulation results to **JSON** or **CSV** for further analysis.
- **Educational Guide**: Built-in documentation on M&S concepts (Stochastic modeling, Gaussian distribution, variance, risk).

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (Hooks & Functional Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Custom CSS (Vanilla) with Neobrutalism tokens
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📂 Project Structure

```text
src/
├── components/          # React Components
│   ├── AnimatedRun      # Step-by-step simulation playback
│   ├── CapitalChart     # Recharts multi-line chart
│   ├── ControlPanel     # Configuration UI & Presets
│   ├── GuidePanel       # Educational content & docs
│   ├── Header           # Branding & startup marquee
│   ├── Icons            # Centralized Lucide icon map
│   ├── OutcomeHistogram # Survival distribution chart
│   ├── ResultsPanel     # Metrics & statistical tables
│   ├── SurvivalGauge    # Probability visualizer
│   └── Tooltip          # Accessible info help
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

## 🧠 Modeling & Simulation Concepts

This project implements several key M&S concepts:

- **Stochastic Processes**: Modeling evolution over time using random variables.
- **Monte Carlo Method**: Repeated random sampling to obtain numerical results.
- **Gaussian (Normal) Distribution**: Used for realistic revenue and market noise.
- **Risk Assessment**: Using variance, standard deviation, and percentiles to quantify business risk.

## 🚀 Getting Started

1. Clone the repository: `git clone https://github.com/Ha3ar6ous/startupsurvivalsimulator.git`
2. Install dependencies: `npm install`
3. Run developmental server: `npm run dev`
4. Build for production: `npm run build`

## 📄 License

MIT

---
*Built for the Modeling & Simulation subject to bridge the gap between business and math.*
