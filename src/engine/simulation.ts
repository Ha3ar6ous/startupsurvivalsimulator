import type { SimulationParams, SimulationRun, SimulationResults, MonthData } from '../types';

// Box-Muller transform for generating normally distributed random numbers
function gaussianRandom(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z * stdDev + mean;
}

function runSingleSimulation(params: SimulationParams, id: number): SimulationRun {
  const months: MonthData[] = [];
  let capital = params.initialCapital;
  let survived = true;
  let bankruptcyMonth: number | null = null;

  for (let month = 1; month <= params.simulationDuration; month++) {
    // Market factor: random shock centered at 1
    const marketFactor = 1 + gaussianRandom(0, params.marketVolatility / 100);

    // Revenue: base * growth * market * randomness
    const growthMultiplier = Math.pow(1 + params.revenueGrowthRate / 100, month - 1);
    const revenueNoise = gaussianRandom(0, params.revenueRandomness / 100);
    const revenue = Math.max(
      0,
      params.monthlyRevenueBase * growthMultiplier * marketFactor * (1 + revenueNoise)
    );

    // Costs
    let costs = params.fixedMonthlyCosts * Math.max(0.5, marketFactor);

    // Cost spike
    if (Math.random() < params.costSpikeProbability / 100) {
      costs += params.costSpikeMin + Math.random() * (params.costSpikeMax - params.costSpikeMin);
    }

    // Funding event
    let funding = 0;
    if (Math.random() < params.fundingProbability / 100) {
      funding = params.fundingMin + Math.random() * (params.fundingMax - params.fundingMin);
    }

    capital = capital + revenue - costs + funding;

    months.push({
      month,
      capital: Math.round(capital * 100) / 100,
      revenue: Math.round(revenue * 100) / 100,
      costs: Math.round(costs * 100) / 100,
      funding: Math.round(funding * 100) / 100,
    });

    if (capital <= 0) {
      survived = false;
      bankruptcyMonth = month;
      break;
    }
  }

  return {
    id,
    months,
    survived,
    bankruptcyMonth,
    finalCapital: Math.round(capital * 100) / 100,
  };
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
}

function standardDeviation(arr: number[]): number {
  const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
  const sqDiffs = arr.map((v) => Math.pow(v - mean, 2));
  return Math.sqrt(sqDiffs.reduce((s, v) => s + v, 0) / arr.length);
}

export function runSimulation(
  params: SimulationParams,
  onProgress?: (progress: number) => void
): SimulationResults {
  const runs: SimulationRun[] = [];
  const batchSize = 50;

  for (let i = 0; i < params.numSimulations; i++) {
    runs.push(runSingleSimulation(params, i));
    if (onProgress && i % batchSize === 0) {
      onProgress((i / params.numSimulations) * 100);
    }
  }

  const survivedCount = runs.filter((r) => r.survived).length;
  const lifespans = runs.map((r) => r.bankruptcyMonth ?? params.simulationDuration);
  const finalCapitals = runs.map((r) => r.finalCapital);

  // Build capital paths for chart (sample up to 100 runs)
  const sampleSize = Math.min(100, runs.length);
  const sampleIndices = new Set<number>();
  while (sampleIndices.size < sampleSize) {
    sampleIndices.add(Math.floor(Math.random() * runs.length));
  }
  const sampledRuns = [...sampleIndices].map((i) => runs[i]);

  const capitalPaths: { month: number; [key: string]: number }[] = [];
  for (let m = 0; m < params.simulationDuration; m++) {
    const point: { month: number; [key: string]: number } = { month: m + 1 };
    sampledRuns.forEach((run, idx) => {
      if (run.months[m]) {
        point[`run${idx}`] = run.months[m].capital;
      }
    });
    capitalPaths.push(point);
  }

  return {
    runs,
    survivalRate: Math.round((survivedCount / params.numSimulations) * 10000) / 100,
    bankruptcyRate: Math.round(((params.numSimulations - survivedCount) / params.numSimulations) * 10000) / 100,
    averageLifespan: Math.round((lifespans.reduce((s, v) => s + v, 0) / lifespans.length) * 10) / 10,
    medianLifespan: percentile(lifespans, 50),
    averageFinalCapital: Math.round(finalCapitals.reduce((s, v) => s + v, 0) / finalCapitals.length),
    medianFinalCapital: Math.round(percentile(finalCapitals, 50)),
    stdDevLifespan: Math.round(standardDeviation(lifespans) * 10) / 10,
    percentile10Lifespan: Math.round(percentile(lifespans, 10) * 10) / 10,
    percentile90Lifespan: Math.round(percentile(lifespans, 90) * 10) / 10,
    capitalPaths,
  };
}

// For Web Worker usage
export function runSimulationInChunks(
  params: SimulationParams,
  chunkSize: number = 100
): { getNext: () => SimulationRun[] | null; totalChunks: number } {
  let currentIndex = 0;
  const totalChunks = Math.ceil(params.numSimulations / chunkSize);

  return {
    totalChunks,
    getNext: () => {
      if (currentIndex >= params.numSimulations) return null;
      const end = Math.min(currentIndex + chunkSize, params.numSimulations);
      const results: SimulationRun[] = [];
      for (let i = currentIndex; i < end; i++) {
        results.push(runSingleSimulation(params, i));
      }
      currentIndex = end;
      return results;
    },
  };
}
