# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start Next.js dev server (localhost:3000)
npm run dev:mobile       # Start dev server on LAN (0.0.0.0:3000) for mobile testing
npm run dev:clean        # Clear .next cache and restart dev
npm run dev:clean:mobile # Clear cache + mobile-accessible dev

# Production
npm run build            # Build for production
npm run start            # Run production server

# Linting
npm run lint             # Run ESLint
```

No test suite is configured.

## Architecture

### What this is

A **Next.js 15 frontend-only e-commerce store**. There is no local database. All data comes from a separate backend REST API (default: `http://localhost:5055/v1`), set via `NEXT_PUBLIC_API_BASE_URL`.

### Environment variables

Required env vars live in `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL` — backend API base URL
- `NEXT_PUBLIC_CLOUDINARY_URL` / `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` — image uploads
- `NEXT_PUBLIC_STORE_DOMAIN` — frontend base URL
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET` — NextAuth session config

Stripe keys, OAuth client IDs/secrets, and Google Analytics IDs are **fetched dynamically from the backend** via `SettingServices.js` — they are not stored in env files.

### Request flow

1. **Root layout** (`src/app/layout.jsx`) runs server-side and fetches store settings, global settings, and customization in parallel.
2. Results are injected into React Context providers (`SettingContext`, `UserContext`, `LoyaltyContext`, etc.) via `src/app/provider.js`.
3. Pages and components read from context or call services directly.
4. API calls go through Axios instances in `src/services/httpServices.js`, which handles JWT token injection.

### Service layer (`src/services/`)

Each domain has its own service file (e.g., `ProductServices.js`, `OrderServices.js`, `CustomerServices.js`). Server-side services are marked `"use server"`. The base Axios instance and token management live in `httpServices.js`. Response unwrapping is in `CommonService.js`.

### Authentication

NextAuth v4 with JWT strategy. Config is built dynamically in `src/lib/next-auth-options.js` — providers (Google, GitHub, Facebook) are conditionally added based on secrets returned by the backend. Token refresh runs automatically on expiry inside the `jwt` callback. `src/middleware.js` protects `/user`, `/order`, and `/checkout` routes and also handles i18n locale routing.

### State management

No Redux (the `@redux/*` path alias exists but is unused). State is managed via React Context:
- `SettingContext` — store, global, and customization settings (populated server-side)
- `UserContext` — logged-in user, shipping address, applied coupon
- `LoyaltyContext` — loyalty program config and user points (sessionStorage cache, 5-min TTL)
- `LanguageContext` — active locale for i18n
- `SidebarContext` — mobile sidebar open/close
- Shopping cart: `react-use-cart` `CartProvider`

### Path aliases (`jsconfig.json`)

`@components/*`, `@context/*`, `@hooks/*`, `@layout/*`, `@app/*`, `@services/*`, `@styles/*`, `@utils/*`, `@lib/*`, `@config/*`, `@/*` all resolve to `src/`.

### Key patterns

- **Async data fetching in client components:** use the `useAsync` hook (`src/hooks/useAsync.js`), which wraps Axios with cancel token support.
- **Form validation:** Zod schemas in `src/lib/form-schema.js`, wired via React Hook Form.
- **Caching:** Next.js `cache()` deduplicates server-side product fetches; `revalidateTag()` invalidates after order creation; loyalty config uses sessionStorage.
- **Payments:** Stripe public key is loaded from backend settings. `StripeProvider` (`src/context/StripeProvider.js`) wraps checkout pages with Stripe Elements.
- **Images:** All uploads go to Cloudinary. Next.js Image is configured to allow any remote hostname (see `next.config.js`).
- **i18n:** Locale files live in `locales/`. Default language is Spanish. Language switching is client-side via `LanguageContext`.
- **Postal codes:** Mexican postal code lookup utility at `src/utils/zmgPostalCodes.js`.

### Deployment

Docker + Google Cloud Build (`cloudbuild.yaml`). The Next.js output mode is `standalone`.
