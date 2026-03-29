import type { SimulationResults, SimulationParams } from '../types';

export function exportToJSON(results: SimulationResults, params: SimulationParams): void {
  const data = {
    parameters: params,
    summary: {
      survivalRate: results.survivalRate,
      bankruptcyRate: results.bankruptcyRate,
      averageLifespan: results.averageLifespan,
      medianLifespan: results.medianLifespan,
      averageFinalCapital: results.averageFinalCapital,
      medianFinalCapital: results.medianFinalCapital,
      stdDevLifespan: results.stdDevLifespan,
    },
    runs: results.runs.map((r) => ({
      id: r.id,
      survived: r.survived,
      bankruptcyMonth: r.bankruptcyMonth,
      finalCapital: r.finalCapital,
      monthCount: r.months.length,
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'simulation-results.json');
}

export function exportToCSV(results: SimulationResults): void {
  const headers = ['Run ID', 'Survived', 'Bankruptcy Month', 'Final Capital', 'Lifespan (months)'];
  const rows = results.runs.map((r) => [
    r.id,
    r.survived ? 'Yes' : 'No',
    r.bankruptcyMonth ?? 'N/A',
    r.finalCapital,
    r.months.length,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'simulation-results.csv');
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
