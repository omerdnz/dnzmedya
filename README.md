# DNZMEDYA V2

Enterprise dijital ajans platformu — vitrin sitesi, admin panel, NestJS API.

## Mimari

| Uygulama | Port | Teknoloji |
|----------|------|-----------|
| **Web** (vitrin) | 3000 | Next.js 15, Framer Motion |
| **Admin** (panel) | 3001 | Next.js 15, React Query |
| **API** (backend) | 4000 | NestJS, JWT, RBAC |
| **Veritabanı** | — | SQLite (Prisma) |

## Hızlı Başlangıç (Geliştirme)

```powershell
pnpm install
copy .env.example .env

# Veritabanı
$env:DATABASE_URL = "file:C:/path/to/dnzmedya/packages/database/prisma/dev.db"
pnpm db:generate
pnpm db:push
pnpm db:seed

# Tüm servisler
pnpm dev
```

## Erişim

- **Site:** http://localhost:3000
- **Admin:** http://localhost:3001
- **API:** http://localhost:4000/api/v1

### Admin Giriş (seed)

- E-posta: `admin@dnzmedya.com`
- Şifre: `Admin123!` — canlıda mutlaka değiştirin

## Admin Panel — İçerik Yönetimi

| Menü | Yönetilen alan |
|------|----------------|
| Hero | Ana sayfa başlık & CTA |
| Hizmetler | /hizmetler + ana sayfa |
| Blog | Yazılar & kategoriler |
| Referanslar | Logo grid |
| SSS | FAQ bölümü |
| Ayarlar | Footer, iletişim, sosyal medya |
| Medya | Görsel yükleme |
| Raporlar | Ziyaretçi istatistikleri |

## Production Build

```bash
pnpm build
```

## Canlıya Alma

Detaylı rehber: **[DEPLOY.md](./DEPLOY.md)**

```bash
# Docker (ilk kurulum)
RUN_SEED=true docker compose up -d --build
```

## Proje Yapısı

```
apps/web      → Public site
apps/admin    → Admin panel
apps/api      → NestJS REST API
packages/database → Prisma + seed
packages/ui   → Shared components
packages/types → Shared types
```
