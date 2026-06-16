'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { PageTransition } from '@/components/layout/page-transition';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen bg-brand-black">
      <div className="pointer-events-none fixed inset-0 admin-grid-bg opacity-30" />
      <div className="pointer-events-none fixed -right-32 top-0 h-[500px] w-[500px] rounded-full bg-brand-gold/[0.03] blur-3xl" />
      <div className="pointer-events-none fixed -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-brand-cyan/[0.04] blur-3xl" />

      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
