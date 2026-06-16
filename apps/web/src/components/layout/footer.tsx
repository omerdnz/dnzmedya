'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogoInline } from '@dnzmedya/ui';
import type { SiteSettings } from '@/lib/site-settings';
import { str } from '@/lib/site-settings';

const quickLinks = [
  { label: 'Hakkımızda', href: '/#hakkimizda' },
  { label: 'Hizmetler', href: '/hizmetler' },
  { label: 'Referanslar', href: '/#referanslar' },
  { label: 'Blog', href: '/blog' },
  { label: 'Teklif Al', href: '/teklif-al' },
];

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'F',
  twitter: 'X',
  instagram: 'I',
  linkedin: 'L',
  youtube: 'Y',
};

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const site = settings?.site ?? {};
  const social = settings?.social ?? {};

  const description = str(
    site.description,
    'DNZMEDYA, dijitalde büyümek isteyen markalar için yenilikçi web yazılım, SEO ve dijital reklam çözümleri sunan profesyonel bir ajansdır.',
  );
  const phone = str(site.phone, '0 533 616 94 84');
  const phoneLink = str(site.phoneLink, 'tel:+905336169484');
  const email = str(site.email, 'omerdeniz07@gmail.com');
  const address = str(site.address, 'Muratpaşa, Antalya, TR');
  const copyright = str(site.copyright, "© Tüm Telif Hakları 2026 DNZMEDYA'ya aittir");

  const socialEntries = Object.entries(SOCIAL_LABELS)
    .map(([key, label]) => ({ key, label, href: str(social[key]) }))
    .filter((item) => item.href && item.href !== '#');

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-brand-dark">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.04)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="container relative mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <LogoInline className="mb-6 h-12 md:h-14 drop-shadow-[0_0_18px_rgba(0,206,209,0.28)]" />
            <p className="max-w-md leading-relaxed text-brand-gray-400">{description}</p>
            {socialEntries.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socialEntries.map((socialItem) => (
                  <motion.a
                    key={socialItem.key}
                    href={socialItem.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-brand-gray-400 transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
                    aria-label={socialItem.key}
                  >
                    {socialItem.label}
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-5 font-heading font-semibold text-brand-gold">Hızlı Linkler</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray-400 transition-colors duration-300 hover:text-brand-gold hover:pl-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-heading font-semibold text-brand-gold">İletişim</h4>
            <ul className="space-y-3 text-sm text-brand-gray-400">
              <li>
                <a href={phoneLink} className="transition-colors hover:text-brand-cyan">
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="transition-colors hover:text-brand-cyan">
                  {email}
                </a>
              </li>
              <li>{address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-brand-gray-500">{copyright}</p>
          <p className="text-xs text-brand-gray-600">Crafted with precision in Antalya</p>
        </div>
      </div>
    </footer>
  );
}
