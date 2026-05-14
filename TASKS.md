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

### Acceptance criteria
- [x] `npm run build` produces `dist/` without errors
- [x] All API endpoints reachable at `/api/*`
- [x] JWT auth works with env-based secret
- [x] CORS allows frontend origin via env var

---

## Phase 2 — Cloudflare R2 File Storage ⏳

**Status:** Pending

### Goal
All new file uploads go to Cloudflare R2 instead of local disk.

### Tasks
- [ ] Create R2 bucket `ecom-media` in Cloudflare dashboard
- [ ] Install `@aws-sdk/client-s3` and `@aws-sdk/lib-storage`
- [ ] Create `src/storage/storage.service.ts` with upload/delete methods
- [ ] Create `src/storage/storage.module.ts` (global)
- [ ] Register `StorageModule` in `app.module.ts`
- [ ] Update `media.module.ts` — switch multer to `memoryStorage()`
- [ ] Update `media.controller.ts` — use `StorageService.upload()` instead of disk
- [ ] Update `media.service.ts` — accept full R2 URL instead of building `/uploads/` path
- [ ] Update delete endpoint — call `StorageService.delete()` before DB removal
- [ ] Add R2 env vars to `.env.example`
- [ ] Test: upload returns `https://cdn.yourdomain.com/...` URL
- [ ] Test: image renders in frontend
- [ ] Test: delete removes file from R2 bucket

### Required env vars
```env
S3_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
S3_BUCKET=ecom-media
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=auto
S3_PUBLIC_URL=https://cdn.yourdomain.com
```

---

## Phase 3 — Existing File Migration to R2 ⏳

**Status:** Pending — depends on Phase 2

### Goal
Move all files from server `/uploads/` directory to R2 and update all database URL references.

### Tasks
- [ ] Take full PostgreSQL backup before running any SQL
- [ ] Install AWS CLI on server
- [ ] Configure AWS CLI with R2 credentials
- [ ] Run `aws s3 sync ./uploads/ s3://ecom-media/ --endpoint-url ...`
- [ ] Verify file count matches (local vs R2)
- [ ] Run DB migration SQL to update all `/uploads/` paths to full R2 URL
  - Tables: `media_files`, `products`, `categories`, `banners`, `users`, `bundles`, `brands`, `countries`, `age_groups`, `mother_categories`
- [ ] Spot-check URLs in DB after migration
- [ ] Remove `ServeStaticModule` from `app.module.ts`
- [ ] Remove `@nestjs/serve-static` from `package.json`
- [ ] Rename `/uploads/` to `uploads_backup_YYYYMMDD/` on server (keep 30 days)
- [ ] Deploy updated API
- [ ] Smoke test: all existing images load from R2 URLs
- [ ] Smoke test: new uploads go to R2

### Notes
- Do this during a maintenance window or low-traffic period
- DB backup is mandatory before the SQL update step
- Keep `uploads_backup/` for at least 30 days before deleting

---

## Backlog

- [ ] Add Swagger/OpenAPI documentation
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Add Docker + docker-compose for local dev
- [ ] Move OTP storage from in-memory Map to Redis or DB (currently lost on restart)
