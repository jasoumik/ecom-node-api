# ecom-node-api

NestJS REST API for the eCommerce platform. Handles products, orders, users, auth, media, and all backend business logic.

## Tech Stack

- **Framework** — NestJS v11 (Node.js)
- **Database** — PostgreSQL via Knex.js
- **Auth** — JWT + OTP (phone/email) + bcrypt
- **File Storage** — Cloudflare R2 (S3-compatible) — _migration in progress_
- **Email** — Nodemailer / Brevo
- **SMS** — NetSMSBD

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm

## Setup

```bash
# Install dependencies
npm install

# Copy env file and fill in your values
cp .env.example .env
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated |
| `MAIL_HOST` | SMTP host |
| `MAIL_USER` | SMTP username |
| `MAIL_PASS` | SMTP password |

## Running

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

API will be available at `http://localhost:3000/api`

## Database

```bash
# Run migrations
npx knex migrate:latest --knexfile knexfile.ts

# Run seeds
npx knex seed:run --knexfile knexfile.ts
```

## Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

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

## Project Structure

```
src/
├── auth/               # Authentication & JWT
├── database/           # Knex config, migrations, seeds
├── media/              # File upload handling
├── products/           # Product catalog & stock
├── orders/             # Order processing
├── users/              # User management
├── notification/       # SMS & WhatsApp providers
├── email/              # Email providers
└── [feature]/          # One folder per feature module
```

## Related Repos

- **Frontend (Web)** — [ecom-react-web](https://github.com/jasoumik/ecom-react-web)
