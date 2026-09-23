# NadiVedas website

This repository contains the complete editable source for `sites.nadivedas.com`:

- pages and components in `app/`
- public images, audio, video facades, and downloadable assets in `public/`
- API routes and payment callbacks in `app/api/`
- Cloudflare Worker entrypoint in `worker/`
- D1 schema and migrations in `db/` and `drizzle/`
- automated checks in `tests/`

## Local development

Requires Node.js 22.13+ and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

## Verify a change

```bash
pnpm run build
node --test tests/booking-preference.test.mjs
```

The production build is emitted to `dist/`. Generated output, local environment
files, and secrets are intentionally excluded from Git.

## Nine-minute leaf-finding offer

For Indian visitors entering the general leaf-finding journey, the homepage
starts a nine-minute ₹540 offer. The UI timer and the server-side PayU amount
share the same expiry. After expiry, the amount returns to ₹999. Lineage-specific
search fees and international pricing continue to use their configured values.

## Production configuration

Cloudflare must provide the `DB` D1 binding, the `THUMBPRINTS` R2 binding, and
the production secrets used by payment, CRM, messaging, analytics, and PDF
services. Never commit `.env` files or secret values to this repository.

Cloudflare is connected to the `main` branch. Every push to `main` creates a
deployment after the configured Cloudflare build succeeds.
