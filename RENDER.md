# DNZMEDYA — Render.com Yayın Rehberi

Bu rehber projeyi [Render](https://render.com) üzerinde test/canlı ortama almak içindir.

## Gereksinimler

- GitHub/GitLab repo (Render repo bağlantısı ister)
- Render hesabı (ücretsiz plan yeterli — test için)
- **4 servis:** 1 PostgreSQL + 3 Web (API, Site, Admin)

---

## Yöntem 1 — Blueprint (önerilen)

1. Kodu GitHub'a push edin
2. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
3. Repo'yu seçin → `render.yaml` otomatik algılanır
4. **Apply** tıklayın

| Servis | Ad | Rol |
|--------|-----|-----|
| PostgreSQL | `dnzmedya-db` | Veritabanı |
| Web | `dnzmedya-api` | NestJS API |
| Web | `dnzmedya-web` | Vitrin sitesi |
| Web | `dnzmedya-admin` | Admin panel |

---

## Yöntem 2 — Manuel

### Adım 1: PostgreSQL

**New** → **PostgreSQL** → Name: `dnzmedya-db` → Connection string kopyalayın

### Adım 2: API

- Build: `bash scripts/render-build-api.sh`
- Start: `bash scripts/render-start-api.sh`
- Release: `bash scripts/render-release.sh`
- Health Check: `/api/v1/hero/active`

Env: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `RUN_SEED=true`, `CORS_ORIGINS`, `STORAGE_PUBLIC_URL`

### Adım 3: Web

- Build: `bash scripts/render-build-web.sh`
- Start: `bash scripts/render-start-web.sh`
- Env: `NEXT_PUBLIC_API_URL=https://dnzmedya-api.onrender.com`

### Adım 4: Admin

- Build: `bash scripts/render-build-admin.sh`
- Start: `bash scripts/render-start-admin.sh`
- Env: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ADMIN_URL`

---

## Deploy sonrası zorunlu

1. **CORS_ORIGINS** (API): `https://dnzmedya-web.onrender.com,https://dnzmedya-admin.onrender.com`
2. **STORAGE_PUBLIC_URL** (API): `https://dnzmedya-api.onrender.com/uploads`
3. Seed sonrası **RUN_SEED=false**
4. Web + Admin → **Clear build cache & deploy**

## Admin: `admin@dnzmedya.com` / `Admin123!`

Detaylı sorun giderme için DEPLOY.md ile birlikte kullanın.
