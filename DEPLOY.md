# PharmaGarde — Vercel Deployment Guide

## Pre-Flight Checklist

Before deploying, verify:

- [ ] Supabase project is live with all migrations applied
- [ ] Seed data is in place (Jerada city, districts, pharmacies, duty schedule)
- [ ] `get_pharmacies_on_duty` RPC function returns results
- [ ] All environment variables are ready
- [ ] Code is committed to a Git repository (GitHub/GitLab/Bitbucket)

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already)

```bash
cd pharmagarde
git init
git add .
git commit -m "feat: Phase 1 — Foundation complete"
```

### 1.2 Push to GitHub

```bash
# Create a new repository on GitHub (do not initialize with README)
# Then:
git remote add origin https://github.com/<your-username>/pharmagarde.git
git branch -M main
git push -u origin main
```

---

## Step 2: Configure Vercel Project

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or your project root)
   - **Build Command**: `next build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. Add Environment Variables (see Step 3)
5. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts:
# ? Set up and deploy "~/pharmagarde"? [Y/n] → Y
# ? Which scope do you want to deploy to? → Your account
# ? Link to existing project? [y/N] → N
# ? What's your project name? [pharmagarde] → pharmagarde
```

---

## Step 3: Environment Variables

Add these in **Vercel Dashboard → Project Settings → Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<anon-key>` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `<service-role-key>` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://pharmagarde.vercel.app` | Production |

### ⚠️ Critical Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. **Never** add it to client-side code.
- `NEXT_PUBLIC_*` variables are exposed to the browser. Only use the anon key here.
- The service role key is only used in `lib/supabase/admin.ts` (server-side only).

---

## Step 4: Configure Supabase for Production

### 4.1 Update Supabase URL in Auth Settings

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Set **Site URL**: `https://pharmagarde.vercel.app`
3. Add Redirect URLs:
   - `https://pharmagarde.vercel.app/**`
   - `https://pharmagarde-*.vercel.app/**` (for preview deployments)

### 4.2 Enable CORS (if needed later for API)

1. **Supabase Dashboard → Database → Extensions**
2. Ensure `pg_net` is enabled (for webhooks, Phase 5+)

### 4.3 Connection Pooling (Recommended)

For high traffic, enable connection pooling:
1. **Supabase Dashboard → Database → Connection Pooling**
2. Note the **Connection String** for future scaling

---

## Step 5: Domain Configuration (Optional)

### Custom Domain

1. **Vercel Dashboard → Project Settings → Domains**
2. Add your domain (e.g., `pharmagarde.ma`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Redirect Rules

Add to `vercel.json` if you want root domain redirect:

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/fr/jerada",
      "permanent": true
    }
  ]
}
```

---

## Step 6: Post-Deployment Verification

### 6.1 Smoke Tests

Run these checks immediately after deployment:

```bash
# Test homepage loads
curl -s -o /dev/null -w "%{http_code}" https://pharmagarde.vercel.app/fr/jerada
# Expected: 200

# Test API (Server Action)
curl -X POST https://pharmagarde.vercel.app/
  -H "Content-Type: application/json"   -d '{"latitude":34.31167,"longitude":-2.16361}'

# Test dark mode CSS
curl -s https://pharmagarde.vercel.app/fr/jerada | grep -q "dark" && echo "OK"
```

### 6.2 Manual Verification Checklist

- [ ] Open `https://your-domain.vercel.app/fr/jerada`
- [ ] Verify page loads within 3 seconds
- [ ] Check light/dark mode toggle works
- [ ] Switch languages (EN/FR/AR) — verify RTL for Arabic
- [ ] Click "Find pharmacies near me" — allow GPS
- [ ] Verify pharmacy cards appear with:
  - [ ] Name and address
  - [ ] Distance calculation
  - [ ] 🟢 Verified Today badge
  - [ ] Reliability score (e.g., 98%)
  - [ ] Source attribution
  - [ ] Call button → opens dialer
  - [ ] Directions button → opens Google Maps
- [ ] Click a pharmacy card → map centers on it
- [ ] Click a map marker → card highlights
- [ ] Test on mobile device (iOS Safari + Android Chrome)
- [ ] Test with GPS denied → falls back to city center

### 6.3 Core Web Vitals Check

Open Chrome DevTools → Lighthouse → Mobile:

| Metric | Target | Action if Failing |
|--------|--------|-------------------|
| LCP | < 2.5s | Optimize images, use `next/image` |
| FID/INP | < 200ms | Reduce JS bundle, code split |
| CLS | < 0.1 | Set explicit dimensions on images |
| TTFB | < 600ms | Use Vercel Edge, optimize DB queries |

---

## Step 7: Monitoring Setup (Phase 2 Prep)

### Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### PostHog

```bash
npm install posthog-js
```

Add to `src/components/providers/AnalyticsProvider.tsx`:

```typescript
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: true,
      })
    }
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

---

## Troubleshooting

### Build Fails: "Cannot find module 'leaflet'"

```bash
npm install leaflet @types/leaflet
```

### Build Fails: "Server Actions not enabled"

Ensure `next.config.js` has:
```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '1mb',
  },
}
```

### Runtime Error: "supabaseUrl is required"

Environment variables not set. Check Vercel Dashboard → Settings → Environment Variables.

### Map Tiles Not Loading (CORS)

OpenStreetMap tiles should work without CORS issues. If using custom tiles, add to `next.config.js`:
```javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'your-tile-server.com' },
  ],
}
```

### Arabic Text Not Rendering

Ensure `Noto Sans Arabic` font is loaded. Check Network tab for font requests.

### GPS Not Working on iOS Safari

- Requires HTTPS (Vercel provides this)
- User must allow location permission
- Add `geolocation=(self)` to Permissions-Policy header (already in `vercel.json`)

---

## Production Checklist

- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (auto on Vercel)
- [ ] Environment variables set for Production
- [ ] Supabase Auth URL configured
- [ ] Sentry DSN configured (Phase 2)
- [ ] PostHog key configured (Phase 2)
- [ ] Google Search Console verified
- [ ] `robots.txt` accessible
- [ ] Sitemap generated (Phase 3)
- [ ] Uptime monitoring (e.g., UptimeRobot)
- [ ] Backup strategy for Supabase data

---

## Rollback Strategy

If deployment breaks:

1. **Vercel Dashboard → Deployments**
2. Find last working deployment
3. Click **... → Promote to Production**

Or via CLI:
```bash
vercel --prod
# Select previous deployment from list
```

---

## Cost Estimate (Vercel + Supabase)

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Vercel | Pro (if > 1TB bandwidth) | $20/mo |
| Vercel | Hobby (personal) | Free |
| Supabase | Free (500MB DB, 2GB bandwidth) | Free |
| Supabase | Pro (8GB DB, 100GB bandwidth) | $25/mo |
| Domain | .ma or .com | ~$10-15/yr |

**Phase 1 expected cost: $0** (Hobby + Free tier sufficient for Jerada)

---

*Last updated: 2026-08-01*
