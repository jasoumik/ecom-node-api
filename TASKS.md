# Tasks & Migration Log

Tracks all infrastructure and migration work done on this repo.

---

## Phase 1 — Monorepo Separation ✅

**Status:** Completed — 2026-05-15

### Changes made
- Extracted from `ecom-node-react` monorepo (`apps/api/`)
- Fixed hardcoded JWT secret → now reads from `process.env.JWT_SECRET`
- Updated CORS → now reads allowed origins from `process.env.FRONTEND_URL` (comma-separated)
- Created `.env.example` with all required environment variables
- Added `uploads/`, `.turbo/`, and lockfiles to `.gitignore`
- Ports: API on `3000`, frontend on `3001`

### Acceptance criteria
- [x] `npm run build` produces `dist/src/main.js` without errors
- [x] All 138 API endpoints reachable at `/api/*`
- [x] JWT auth works with env-based secret
- [x] CORS allows frontend origin via `FRONTEND_URL` env var

---

## Phase 2 — Cloudflare R2 File Storage ✅

**Status:** Completed — 2026-05-15

### Changes made
- Added `src/storage/storage.service.ts` — S3Client wrapper with `upload()` and `delete()`
- Added `src/storage/storage.module.ts` — global module, available to all feature modules
- Registered `StorageModule` in `app.module.ts`
- `media.module.ts` — switched multer from `diskStorage` to `memoryStorage()`
- `media.controller.ts` — streams file buffer directly to R2, no disk touch
- `media.service.ts` — `saveFileRecord()` accepts pre-built URL, added `getFileById()`
- Delete endpoint removes file from R2 before removing DB record
- Added `@aws-sdk/client-s3` and `@aws-sdk/lib-storage` to `package.json`
- Added R2 env vars to `.env.example`
- `ServeStaticModule` kept active for legacy `/uploads/` URLs until Phase 3

### Required env vars (fill in your `.env`)
```env
S3_ENDPOINT=https://7723c6b012b22da227803709055d0ef1.r2.cloudflarestorage.com
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=auto
S3_PUBLIC_URL=https://pub-xxxx.r2.dev
```

### Acceptance criteria
- [x] `src/storage/storage.service.ts` created
- [x] `StorageModule` globally registered
- [x] Multer uses `memoryStorage()` — no files written to disk
- [x] Upload endpoint returns full R2 URL
- [x] Delete endpoint removes file from R2 bucket
- [ ] Test: upload returns `https://...r2.dev/...` URL (needs deployed env)
- [ ] Test: image renders in frontend from R2 URL

---

## Phase 3 — Existing File Migration to R2 ⏳

**Status:** Pending — requires server access + maintenance window

### Goal
Move all existing files from server `/uploads/` directory to R2 and update all database URL references.

### Tasks
- [ ] Take full PostgreSQL backup: `pg_dump -U ecom_user ecom > backup_before_migration.sql`
- [ ] Install AWS CLI on server
- [ ] Configure AWS CLI with R2 credentials (`aws configure`)
- [ ] Sync files: `aws s3 sync ./uploads/ s3://ecom-media/ --endpoint-url https://7723c6b012b22da227803709055d0ef1.r2.cloudflarestorage.com`
- [ ] Verify file count matches (local vs R2)
- [ ] Run DB migration SQL (see `docs/separation-plan.md` for full script)
  - Tables: `media_files`, `products`, `categories`, `banners`, `users`, `bundles`, `brands`, `countries`, `age_groups`, `mother_categories`
- [ ] Spot-check URLs in DB: `SELECT url FROM media_files LIMIT 10;`
- [ ] Remove `ServeStaticModule` from `app.module.ts`
- [ ] Remove `@nestjs/serve-static` from `package.json`
- [ ] Rename `/uploads/` to `uploads_backup_YYYYMMDD/` (keep 30 days before deleting)
- [ ] Deploy updated API
- [ ] Smoke test: all existing images load from R2 URLs
- [ ] Smoke test: new uploads go to R2

### Notes
- Do during a maintenance window or low-traffic period
- DB backup is mandatory before the SQL update step

---

## Phase 4 — WebP Conversion + Brand Watermark ✅

**Status:** Completed — 2026-05-15

### Goal
All uploaded images are automatically converted to WebP and optionally stamped with a configurable brand watermark.

### Changes made
- Added `src/image-processing/image-processing.service.ts` — processes images using `sharp`:
  - Converts every image to WebP at quality 85
  - Applies text watermark via SVG overlay (auto-sized font, opacity-controlled)
  - Applies image watermark by fetching configured URL, resizing, and compositing
  - Non-image files pass through unchanged
- Added `src/image-processing/image-processing.module.ts` — imports `DatabaseModule`, exports service
- `media.controller.ts` — calls `imageProcessingService.processImage(file)` before `storageService.upload()`
- `media.module.ts` — imports `ImageProcessingModule`
- `app.module.ts` — registers `ImageProcessingModule`
- `settings.service.ts` — seeds 7 new watermark settings on startup
- `package.json` — added `sharp ^0.33.0`

### Watermark settings (configurable via Admin → Settings)

| Key | Default | Description |
|-----|---------|-------------|
| `watermark_enabled` | `false` | Master on/off switch |
| `watermark_type` | `text` | `text` or `image` |
| `watermark_text` | `Your Brand` | Text string for text watermark |
| `watermark_image` | _(empty)_ | URL of PNG/SVG logo for image watermark |
| `watermark_opacity` | `0.5` | Float 0.1–1.0 |
| `watermark_position` | `southeast` | `northwest` / `northeast` / `southwest` / `southeast` / `center` |
| `watermark_size` | `200` | Width in px for image watermark resize |

### Acceptance criteria
- [x] All image uploads return `.webp` URLs
- [x] Watermark settings seeded automatically on first startup
- [x] Text watermark renders as SVG overlay at configured opacity and position
- [x] Image watermark fetches URL, resizes, composites at configured position
- [x] Non-image uploads (PDF, video) are unaffected
- [x] Watermark can be disabled via `watermark_enabled = false`
- [ ] Run `npm install` on server to pull `sharp` binary after deploy

### Notes
- Run `npm install` after deploying — `sharp` includes a native binary that must be compiled for the target platform

---

## Backlog

- [ ] Add Swagger/OpenAPI documentation
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add Docker + docker-compose for local dev
- [ ] Move OTP storage from in-memory Map to Redis or DB (currently lost on restart)
