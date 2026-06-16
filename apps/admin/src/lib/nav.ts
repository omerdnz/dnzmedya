export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
}

export const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'dashboard' },
  {
    label: 'İçerik',
    icon: 'content',
    children: [
      { label: 'Sayfalar', href: '/pages' },
      { label: 'Blog', href: '/blog' },
      { label: 'Hizmetler', href: '/services' },
      { label: 'Referanslar', href: '/references' },
      { label: 'Hazır Scriptler', href: '/scripts' },
      { label: 'SSS', href: '/faqs' },
      { label: 'Hero', href: '/hero' },
    ],
  },
  { label: 'Medya Merkezi', href: '/media', icon: 'media' },
  { label: 'SEO', href: '/seo', icon: 'seo' },
  {
    label: 'CRM',
    icon: 'crm',
    children: [
      { label: 'Müşteriler', href: '/customers' },
      { label: 'Teklifler', href: '/quotes' },
      { label: 'Formlar', href: '/forms' },
    ],
  },
  { label: 'Raporlar', href: '/reports', icon: 'reports' },
  { label: 'Kullanıcılar', href: '/users', icon: 'users' },
  { label: 'Ayarlar', href: '/settings', icon: 'settings' },
  { label: 'Yedekleme', href: '/backup', icon: 'backup' },
  { label: 'Sistem', href: '/system', icon: 'system' },
];
