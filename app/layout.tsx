import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dansk Økonomiapp – Skat, Budget & Investering',
  description: 'Personlig økonomiassistent med skatteestimat, budgetanalyse og investeringsscenarier baseret på danske regler.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className="h-full">
      <body className="min-h-full bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
