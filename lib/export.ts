// Eksportfunktioner til CSV og PDF
import Papa from 'papaparse';
import type { TaxCalculationResult, BudgetAnalysis, InvestmentSimulation } from '@/types';
import { formatKr } from './utils';

export function exportTaxToCSV(tax: TaxCalculationResult): void {
  const rows = [
    { post: 'Bruttoindkomst/måned', beløb: Math.round(tax.bruttoIndkomst) },
    { post: 'AM-bidrag (8%)', beløb: -Math.round(tax.amBidrag) },
    { post: 'Personlig indkomst', beløb: Math.round(tax.personligIndkomst) },
    { post: 'Bundskat', beløb: -Math.round(tax.bundskat) },
    { post: 'Kommuneskat', beløb: -Math.round(tax.kommuneskat) },
    { post: 'Kirkeskat', beløb: -Math.round(tax.kirkeskat) },
    { post: 'Topskat', beløb: -Math.round(tax.topskat) },
    { post: 'Nettoindkomst/måned', beløb: Math.round(tax.nettoIndkomst) },
    { post: 'Effektiv skatteprocent', beløb: `${tax.effektivSkatteprocent.toFixed(1)}%` },
  ];
  downloadFile(Papa.unparse(rows, { header: true }), 'skatteestimat.csv', 'text/csv;charset=utf-8;');
}

export function exportBudgetToCSV(budget: BudgetAnalysis): void {
  const rows = [
    { kategori: 'Nettoindkomst', beløb: Math.round(budget.totalIndkomst), type: '' },
    { kategori: 'Faste udgifter', beløb: Math.round(budget.fasteUdgifter), type: 'fast' },
    { kategori: 'Variable udgifter', beløb: Math.round(budget.variableUdgifter), type: 'variabel' },
    { kategori: 'Rådighedsbeløb', beløb: Math.round(budget.rådighedsbeløb), type: '' },
    { kategori: 'Opsparingsrate', beløb: `${budget.opsparingsrate.toFixed(1)}%`, type: '' },
    { kategori: 'Gældsgrad', beløb: `${budget.gældsgrad.toFixed(1)}%`, type: '' },
  ];
  downloadFile(Papa.unparse(rows, { header: true }), 'budget.csv', 'text/csv;charset=utf-8;');
}

export function exportInvestmentToCSV(sim: InvestmentSimulation): void {
  const rows = sim.simulationsData.map((d) => ({ år: d.år, indskudt: d.indskudt, min_scenarie: d.min, forventet: d.forventet, max_scenarie: d.max }));
  downloadFile(Papa.unparse(rows, { header: true }), 'investering_simulation.csv', 'text/csv;charset=utf-8;');
}

export async function exportFullReportToPDF(tax: TaxCalculationResult, budget: BudgetAnalysis, sim: InvestmentSimulation | null): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 20;

  const addSection = (title: string) => { y += 5; doc.setFontSize(13); doc.setTextColor(30, 64, 175); doc.text(title, 20, y); y += 7; doc.setDrawColor(200, 200, 220); doc.line(20, y, pageW - 20, y); y += 5; };
  const addRow = (label: string, value: string) => { doc.setFontSize(10); doc.setTextColor(51, 65, 85); doc.text(label, 20, y); doc.text(value, pageW - 20, y, { align: 'right' }); y += 6; if (y > 270) { doc.addPage(); y = 20; } };

  doc.setFontSize(18); doc.setTextColor(15, 23, 42); doc.text('Dansk Økonomirapport', 20, y); y += 10;
  doc.setFontSize(9); doc.setTextColor(100); doc.text(`Genereret: ${new Date().toLocaleDateString('da-DK')} – Estimater, ikke autoriseret rådgivning`, 20, y); y += 12;

  addSection('Skatteestimat (månedlig)');
  addRow('Bruttoindkomst', formatKr(tax.bruttoIndkomst));
  addRow('AM-bidrag (8%)', `-${formatKr(tax.amBidrag)}`);
  addRow('Nettoindkomst', formatKr(tax.nettoIndkomst));
  addRow('Effektiv skat', `${tax.effektivSkatteprocent.toFixed(1)}%`);

  addSection('Budget');
  addRow('Nettoindkomst', formatKr(budget.totalIndkomst));
  addRow('Rådighedsbeløb', formatKr(budget.rådighedsbeløb));
  addRow('Opsparingsrate', `${budget.opsparingsrate.toFixed(1)}%`);

  if (sim) {
    addSection(`Investeringssimulation – ${sim.scenarie.navn}`);
    addRow('Månedligt indskud', formatKr(sim.månedligtBeløb));
    addRow('Forventet slutværdi', formatKr(sim.slutværdiForventet));
  }

  y += 10; doc.setFontSize(8); doc.setTextColor(150);
  doc.text('ADVARSEL: Estimater baseret på generelle satser. Konsultér Skattestyrelsen og en autoriseret rådgiver.', 20, y, { maxWidth: pageW - 40 });
  doc.save('oekonomirapport.pdf');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob(['﻿' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
