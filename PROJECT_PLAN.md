# DNZMEDYA V2 — Proje Planı

## Genel Bakış

Enterprise dijital ajans platformu: vitrin sitesi + custom admin panel + NestJS API + PostgreSQL.

**Tasarım:** Siyah / Gold / Beyaz — Minimal, Premium, Teknoloji  
**Logo:** Cyan (#00CED1) DNZ + Beyaz MEDYA + circuit accent (marka kimliği)  
**Fontlar:** Montserrat (başlık), Inter (içerik)  
**Köşe:** 16px | **Shadow:** Soft

---

## Mimari

```
apps/
  web/      → Next.js 15 (App Router) — Public site
  admin/    → Next.js 15 (App Router) — Admin panel
  api/      → NestJS — REST API
packages/
  database/ → Prisma schema + client
  ui/       → Shared React components
  types/    → Shared TypeScript types
  config/   → ESLint, Tailwind, TS configs
```

**Stack:** TypeScript, Tailwind, Framer Motion, GSAP, Zustand, React Query, Redis, JWT+RBAC, SMTP, Docker+Nginx

---

## Fazlar

### Faz 1 — Altyapı ✅ (Bu oturum)
- [x] Monorepo (pnpm + Turbo)
- [x] Docker Compose (PostgreSQL, Redis, Nginx)
- [x] Prisma schema (tüm modeller)
- [x] Seed data (admin user, site settings, hero)
- [x] Shared packages

### Faz 2 — API
- [ ] Auth (JWT, refresh, RBAC, 2FA)
- [ ] CRUD: pages, posts, services, media, SEO
- [ ] CRM: customers, quotes, forms
- [ ] Analytics, audit log, rate limit
- [ ] S3-compatible storage adapter
- [ ] PDF quote generation, SMTP mail

### Faz 3 — Admin Panel
- [ ] Dashboard (drag-drop widgets, stats)
- [ ] İçerik yönetimi (Tiptap editor)
- [ ] Medya merkezi (crop, compress, alt text)
- [ ] SEO paneli
- [ ] CRM + teklif modülü
- [ ] Raporlama grafikleri
- [ ] Kullanıcı/rol yönetimi, ayarlar, yedekleme

### Faz 4 — Frontend (Web)
- [ ] Hero (video bg, mouse follow, parallax)
- [ ] Tüm sayfalar (admin'den yönetilebilir)
- [ ] Blog, SSS, iletişim, teklif formu
- [ ] SEO (metadata, JSON-LD, sitemap, robots)
- [ ] Dark mode, mobil uyum, LCP < 2s

### Faz 5 — Test & Deploy
- [ ] E2E testler
- [ ] Performance audit
- [ ] Production Docker build
- [ ] Nginx reverse proxy config

---

## Veritabanı Modelleri

| Model | Açıklama |
|-------|----------|
| User, Role, Permission | Auth + RBAC |
| Page, PageSection | Dinamik sayfalar |
| Post, Category, Tag | Blog |
| Service, Script, Reference, CaseStudy | İçerik |
| Media | Dosya yönetimi |
| SeoMeta | Sayfa SEO |
| Form, FormSubmission | Formlar |
| Customer, Quote, QuoteItem | CRM |
| AnalyticsEvent | Ziyaret/trafik |
| AuditLog | Güvenlik log |
| Setting | Site ayarları |
| DashboardWidget | Admin widget layout |

---

## Sonraki Adım

API modüllerini tamamla → Admin panel sayfalarını bağla → Frontend'i API'ye bağla.
