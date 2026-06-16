# DNZMEDYA — Canlıya Alma Rehberi

Bu rehber projeyi production ortamına almak için gereken adımları içerir.

## Mimari

| Servis | Port | Açıklama |
|--------|------|----------|
| Web | 3000 | Vitrin sitesi (dnzmedya.com) |
| Admin | 3001 | Yönetim paneli (admin.dnzmedya.com) |
| API | 4000 | Backend (api.dnzmedya.com) |

## Canlıya almadan önce kontrol listesi

- [ ] `.env` dosyasında **JWT_SECRET** ve **JWT_REFRESH_SECRET** güçlü rastgele değerler
- [ ] **SEED_ADMIN_PASSWORD** değiştirildi (seed sonrası admin şifresini panelden güncelleyin)
- [ ] **NEXT_PUBLIC_API_URL** tarayıcıdan erişilebilir public API adresi (Docker hostname değil!)
- [ ] **CORS_ORIGINS** production domainleri içeriyor
- [ ] **GROQ_API_KEY** AI chat için (opsiyonel)
- [ ] SSL sertifikası (Let's Encrypt) nginx veya hosting paneli üzerinden

## Yöntem 1 — VPS (Node.js + PM2) — Önerilen

### 1. Sunucuya projeyi yükleyin

```bash
git clone <repo-url> /var/www/dnzmedya
cd /var/www/dnzmedya
pnpm install
cp .env.example .env
nano .env   # production değerlerini girin
```

### 2. Veritabanı

```bash
export DATABASE_URL="file:/var/www/dnzmedya/packages/database/prisma/dev.db"
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 3. Production build

```bash
pnpm build
```

### 4. PM2 ile servisleri başlatın

```bash
npm i -g pm2

# API
cd apps/api && pm2 start dist/main.js --name dnz-api

# Web
cd ../web && pm2 start "pnpm start" --name dnz-web

# Admin
cd ../admin && pm2 start "pnpm start" --name dnz-admin

pm2 save
pm2 startup
```

### 5. Nginx reverse proxy

```nginx
# dnzmedya.com → localhost:3000
# admin.dnzmedya.com → localhost:3001
# api.dnzmedya.com → localhost:4000
```

Certbot ile SSL: `certbot --nginx -d dnzmedya.com -d www.dnzmedya.com -d admin.dnzmedya.com -d api.dnzmedya.com`

## Yöntem 2 — Docker

### 1. `.env` dosyasını hazırlayın

```bash
cp .env.example .env
```

Production örneği:

```env
JWT_SECRET=<64-char-random>
JWT_REFRESH_SECRET=<64-char-random>
NEXT_PUBLIC_API_URL=https://api.dnzmedya.com
NEXT_PUBLIC_SITE_URL=https://dnzmedya.com
NEXT_PUBLIC_ADMIN_URL=https://admin.dnzmedya.com
STORAGE_PUBLIC_URL=https://api.dnzmedya.com/uploads
CORS_ORIGINS=https://dnzmedya.com,https://www.dnzmedya.com,https://admin.dnzmedya.com
RUN_SEED=true
```

> **Önemli:** `NEXT_PUBLIC_*` değerleri **build sırasında** Docker image'a gömülür. Domain değişirse `docker compose build --no-cache` gerekir.

### 2. İlk kurulum

```bash
RUN_SEED=true docker compose up -d --build
```

Sonraki güncellemelerde `RUN_SEED=false` kullanın (veriyi silmez).

### 3. Nginx (opsiyonel profile)

```bash
docker compose --profile production up -d
```

## Admin paneli

- URL: `https://admin.dnzmedya.com` (veya `:3001` dev)
- Varsayılan: `admin@dnzmedya.com` / `Admin123!` — **hemen değiştirin**

### Admin'den yönetilen içerikler

| Bölüm | Ne yapılır |
|-------|------------|
| Hero | Ana sayfa başlık, alt başlık, CTA |
| Hizmetler | /hizmetler sayfası + ana sayfa kartları |
| Blog | Yazılar, kategoriler |
| Referanslar | Logo grid |
| SSS | Sıkça sorulan sorular |
| Ayarlar | Footer, iletişim, sosyal medya |
| Medya | Görsel yükleme |

## Yedekleme

- **Veritabanı:** `packages/database/prisma/dev.db`
- **Medya:** `apps/api/uploads/`
- Docker: `db_data` ve `uploads_data` volume'leri

## Güncelleme

```bash
git pull
pnpm install
pnpm db:push
pnpm build
pm2 restart all
# veya: docker compose up -d --build
```

## Sorun giderme

| Sorun | Çözüm |
|-------|-------|
| Hero değişmiyor | Sayfayı hard refresh (Ctrl+Shift+R) |
| Admin API hatası | `NEXT_PUBLIC_API_URL` ve CORS kontrol edin |
| Görseller yüklenmiyor | `STORAGE_PUBLIC_URL` ve nginx `/uploads` proxy |
| AI chat çalışmıyor | `GROQ_API_KEY` web `.env.local` veya sunucu env |
