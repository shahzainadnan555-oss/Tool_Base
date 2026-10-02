# ToolMyra

Free online utility platform — converters, compressors, generators, calculators, and more.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to your production domain for canonical URLs, sitemap, Open Graph, and structured data.

Optional:

- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — Search Console meta verification token
- `ADMIN_UI_ENABLED=true` — expose `/admin` foundation UI in production (not authentication)

## Validation

```bash
npm run validate:registry
npm run validate:production
BASE_URL=http://127.0.0.1:3000 npm run validate:production
npm run typecheck
npm run lint
npm run build
```

## Architecture highlights

- Central tool registry: `lib/tools/registry.ts` (+ category tool modules)
- Category system: `lib/tools/categories.ts`
- Instant frontend search: `lib/tools/search.ts`
- Reusable tool page shell: `components/tools/ToolPageShell.tsx`
- SEO helpers: `lib/seo/`
- Analytics abstraction: `lib/analytics/` (no sensitive payloads)
- Admin foundation: `/admin` (noindex, robots disallow, blocked in production unless `ADMIN_UI_ENABLED=true`)

## Adding a tool

1. Add a complete entry in the appropriate `lib/tools/*-tools.ts` module
2. Add matching workspace config under the tool’s `lib/*/configs.ts`
3. The tool appears in search, category pages, sitemap, cards, and `/tools/[slug]`

Do not duplicate tool definitions elsewhere. Run `npm run validate:registry` after registry changes.
