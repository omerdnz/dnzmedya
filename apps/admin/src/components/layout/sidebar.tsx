'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, Button, LogoInline } from '@dnzmedya/ui';
import { adminNav, type NavItem } from '@/lib/nav';
import { useAuthStore } from '@/stores/auth';
import { NavIcon, ChildNavIcon } from '@/components/layout/nav-icons';

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const isActive = item.href === '/' ? pathname === '/' : item.href ? pathname.startsWith(item.href) : false;

  if (!item.href) return null;

  return (
    <Link href={item.href} className="relative block">
      <motion.div
        whileHover={{ x: depth > 0 ? 4 : 2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300',
          depth > 0 && 'pl-8',
          isActive
            ? 'text-brand-white'
            : 'text-brand-gray-400 hover:text-brand-gray-300',
        )}
      >
        {isActive && (
          <motion.div
            layoutId="admin-nav-active"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-gold/20 via-brand-gold/10 to-transparent border border-brand-gold/20"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-3">
          {depth === 0 ? (
            <NavIcon name={item.icon} active={isActive} />
          ) : (
            <ChildNavIcon active={isActive} />
          )}
          {item.label}
        </span>
      </motion.div>
    </Link>
  );
}

function NavGroup({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const hasActiveChild = item.children?.some(
    (child) => child.href && pathname.startsWith(child.href),
  );
  const [open, setOpen] = useState(hasActiveChild ?? false);

  return (
    <div>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-300',
          hasActiveChild ? 'text-brand-white' : 'text-brand-gray-400 hover:text-brand-gray-300',
        )}
      >
        <NavIcon name={item.icon} active={!!hasActiveChild} />
        <span className="flex-1 text-left">{item.label}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-4 w-4 text-brand-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-0.5 border-l border-brand-gold/10 ml-5 pl-2">
              {item.children?.map((child, i) => (
                <motion.div
                  key={child.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <NavLink item={child} depth={1} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar() {
  const { user, clearAuth, refreshToken } = useAuthStore();

  async function handleLogout() {
    try {
      if (refreshToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // ignore
    }
    clearAuth();
    window.location.href = '/login';
  }

  return (
    <aside className="relative flex h-screen w-[270px] shrink-0 flex-col border-r border-white/[0.08] glass-elevated">
      <div className="pointer-events-none absolute inset-0 admin-grid-bg opacity-40" />
      <div className="pointer-events-none absolute -top-24 left-0 h-48 w-full bg-gradient-to-b from-brand-cyan/5 to-transparent" />

      <div className="relative border-b border-white/[0.08] px-5 py-6">
        <Link href="/" className="group flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="drop-shadow-[0_0_18px_rgba(0,206,209,0.3)]"
          >
            <LogoInline className="h-12 w-full max-w-[220px]" />
          </motion.div>
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-gold/80">Kurumsal Panel</p>
        </div>
      </div>

      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {adminNav.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
          >
            {item.children ? <NavGroup item={item} /> : <NavLink item={item} />}
          </motion.div>
        ))}
      </nav>

      <div className="relative border-t border-white/[0.08] p-4">
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gold/30 to-brand-cyan/20 font-heading text-sm font-bold text-brand-gold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brand-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-brand-gray-500">{user.email}</p>
              </div>
            </div>
            <span className="mt-2 inline-block rounded-full bg-brand-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-gold">
              {user.role}
            </span>
          </motion.div>
        )}
        <Button variant="outline" size="sm" className="w-full border-white/10 hover:border-red-400/30 hover:text-red-400" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </div>
    </aside>
  );
}
