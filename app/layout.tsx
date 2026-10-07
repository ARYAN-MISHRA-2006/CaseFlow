import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import './globals.css';
import { CaseFlowProvider } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif', style: 'normal' });

export const metadata: Metadata = {
  title: 'CASEFLOW — From Pending to Progress',
  description: 'Indian Judicial & Case Management Bottleneck Resolution Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <CaseFlowProvider>
          <AppShell>{children}</AppShell>
        </CaseFlowProvider>
      </body>
    </html>
  );
}
