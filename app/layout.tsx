import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { CaseFlowProvider } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CASEFLOW — From Pending to Progress',
  description: 'Agentic AI Legal Backlog & Procedural Bottleneck Resolution Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex`}>
        <CaseFlowProvider>
          <Suspense fallback={<div className="w-64 bg-slate-900 h-screen fixed left-0 top-0" />}>
            <Sidebar />
          </Suspense>
          <div className="flex-1 ml-64 flex flex-col min-h-screen">
            {children}
          </div>
        </CaseFlowProvider>
      </body>
    </html>
  );
}
