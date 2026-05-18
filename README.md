# ecom-node-api

NestJS REST API for the eCommerce platform. Handles products, orders, users, auth, media, and all backend business logic.

## Tech Stack

- **Framework** — NestJS v11 (Node.js)
- **Database** — PostgreSQL via Knex.js
- **Auth** — JWT + OTP (phone/email) + bcrypt
- **File Storage** — Cloudflare R2 (S3-compatible)
- **Email** — Nodemailer / Brevo
- **SMS** — NetSMSBD

---

## Getting Started

Follow these steps in order.

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DB_HOST` | PostgreSQL host (usually `localhost`) |
| `DB_PORT` | PostgreSQL port (usually `5432`) |
| `DB_NAME` | Database name (e.g. `ecom`) |
| `DB_USERNAME` | Your PostgreSQL username |
| `DB_PASSWORD` | Your PostgreSQL password (leave blank if none) |
| `JWT_SECRET` | Strong random string for signing JWT tokens |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated |
| `S3_ENDPOINT` | Cloudflare R2 endpoint URL |
| `S3_BUCKET` | R2 bucket name |
| `S3_ACCESS_KEY_ID` | R2 access key |
| `S3_SECRET_ACCESS_KEY` | R2 secret key |
| `S3_PUBLIC_URL` | Public CDN URL for uploaded files |
| `MAIL_HOST` | SMTP host |
| `MAIL_PORT` | SMTP port (usually 587) |
| `MAIL_USER` | SMTP username |
| `MAIL_PASS` | SMTP password |
| `MAIL_FROM` | From address for outgoing emails |

### 4. Create the database

Create a PostgreSQL database matching the `DB_NAME` value in your `.env`:

```bash
psql -c "CREATE DATABASE ecom;"
```

If you want a dedicated user:

```bash
psql -c "CREATE USER ecom_user WITH PASSWORD 'your_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE ecom TO ecom_user;"
```

Then update `DB_USERNAME` and `DB_PASSWORD` in `.env` accordingly.

### 5. Run migrations

```bash
npx knex migrate:latest --knexfile knexfile.ts
```

This creates all tables. If you add new migration files later, run the same command — Knex only applies pending ones.

### 6. Run seeds

```bash
npx knex seed:run --knexfile knexfile.ts
```

This populates the database with:
- Admin and customer user accounts
- Age groups, mother categories, labels, countries
- Sample brands, categories, products
- Delivery charges, coupons, settings, promises
- Email and SMS templates
- Sample orders and reviews

> **Default admin credentials**
> - Phone: `01616684803`
> - Password: `123456`

### 7. Start the server

```bash
# Development (watch mode — restarts on file change)
npm run start:dev

# Production
npm run build
npm run start:prod
```

API is available at `http://localhost:3000/api`

---

## Database Commands

```bash
# Apply all pending migrations
npx knex migrate:latest --knexfile knexfile.ts

# Check migration status
npx knex migrate:status --knexfile knexfile.ts

# Roll back the last batch
npx knex migrate:rollback --knexfile knexfile.ts

# Run all seed files
npx knex seed:run --knexfile knexfile.ts
```

Migrations live in `src/database/migrations/`.
Seeds live in `src/database/seeds/` and run in filename order.

---

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## API Modules

| Module | Base Route | Description |
|--------|-----------|-------------|
| auth | `/api/auth` | Login, register, OTP |
| products | `/api/products` | Product catalog, stock |
| orders | `/api/orders` | Order management |
| users | `/api/users` | User management |
| categories | `/api/categories` | Product categories |
| brands | `/api/brands` | Brands |
| banners | `/api/banners` | Homepage banners |
| media | `/api/media` | File upload & management |
| coupons | `/api/coupons` | Discount coupons |
| delivery | `/api/delivery` | Delivery charges |
| dashboard | `/api/dashboard` | Analytics |
| reviews | `/api/reviews` | Product reviews |
| wishlist | `/api/wishlist` | User wishlists |
| bundles | `/api/bundles` | Product bundles |
| settings | `/api/settings` | Store settings |
| labels | `/api/labels` | Product/banner labels |
| age-groups | `/api/age-groups` | Shop by age |
| landing-pages | `/api/landing-pages` | Product landing pages |

---

## Project Structure

```
src/
├── auth/               # JWT authentication, OTP
├── database/
│   ├── migrations/     # Knex migration files (run in order)
│   └── seeds/          # Seed data files
├── media/              # File upload to Cloudflare R2
├── image-processing/   # WebP conversion, watermarking
├── products/           # Product catalog & stock management
├── orders/             # Order processing & invoice generation
├── users/              # User accounts & addresses
├── notification/       # SMS (NetSMSBD) & WhatsApp providers
├── email/              # Email providers (Nodemailer/Brevo)
└── [feature]/          # One folder per feature module
```

---

## Related Repos

- **Frontend (Web)** — [ecom-react-web](https://github.com/jasoumik/ecom-react-web)
