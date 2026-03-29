export interface SimulationParams {
  initialCapital: number;
  monthlyRevenueBase: number;
  revenueGrowthRate: number;
  revenueRandomness: number;
  fixedMonthlyCosts: number;
  costSpikeProbability: number;
  costSpikeMin: number;
  costSpikeMax: number;
  fundingProbability: number;
  fundingMin: number;
  fundingMax: number;
  marketVolatility: number;
  simulationDuration: number;
  numSimulations: number;
}

export interface MonthData {
  month: number;
  capital: number;
  revenue: number;
  costs: number;
  funding: number;
}

export interface SimulationRun {
  id: number;
  months: MonthData[];
  survived: boolean;
  bankruptcyMonth: number | null;
  finalCapital: number;
}

export interface SimulationResults {
  runs: SimulationRun[];
  survivalRate: number;
  bankruptcyRate: number;
  averageLifespan: number;
  medianLifespan: number;
  averageFinalCapital: number;
  medianFinalCapital: number;
  stdDevLifespan: number;
  percentile10Lifespan: number;
  percentile90Lifespan: number;
  capitalPaths: { month: number; [key: string]: number }[];
}

export interface PresetScenario {
  name: string;
  description: string;
  emoji: string;
  params: Partial<SimulationParams>;
}
