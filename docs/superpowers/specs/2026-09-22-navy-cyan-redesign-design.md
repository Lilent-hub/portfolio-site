# Portfolio redesign — "navy + cyan, modernized"

Date: 2026-09-22 · Status: approved in chat · Base: existing repo (Next.js 16, Tailwind 4, Supabase, Vercel)

## Goal
Replace the unstyled default portfolio with a modern dark-navy/cyan design inspired by
https://lilent-hub.github.io/johndignadice.github.io/ (inspiration, not a clone), extend the
data model so every element of the design is editable, and grow `/admin` into a full CRUD
editor. Ship to Vercel via `main`.

## Decisions (from brainstorm)
- Build on the existing repo; keep Supabase project `portfolio-site` (rdcpntgiyjdatqepqdee).
- Import all reference content (text + images) so the site launches populated.
- Credentials section kept; rendered only when non-empty.
- Each project gets a dedicated page `/projects/[slug]` with captioned screenshots.
- Dark theme only.
- Stack unchanged: TypeScript, React 19 / Next.js 16 App Router, Tailwind 4, Postgres (Supabase).

## Visual world
- Palette tokens (CSS vars on :root): bg `#0B1220`, surface `#111C33`, surface-2 `#162345`,
  border `rgba(255,255,255,.08)`, text `#E6EDF7`, muted `#8B9BB4`, accent `#22D3EE`,
  accent-strong `#06B6D4`, accent-glow `rgba(34,211,238,.25)`.
- Type: Sora (display, 600/700), Inter (body), fluid sizes via clamp(); tabular nums for dates.
- Accent is used sparingly: links, section rule, focus ring, hero glow, primary CTA. Not on every border.
- No emoji icons; inline SVG icons only. Max width 1100px. Section rhythm 96–128px.
- Public site register: Experience. Admin register: Operate (denser, same tokens).

## Public surfaces
- Nav: sticky, glass on scroll, `JD` monogram, links About/Skills/Projects/Contact, CTA "Let's talk".
- Hero: photo (avatar_url) with cyan ring, name, headline, tagline, CTAs (Email me, View projects).
- About: two columns — paragraphs (bio, split on blank lines) left; highlights list right.
- Skills: chip cloud.
- Projects: responsive card grid (thumbnail, title, tags, 2-line excerpt) → `/projects/[slug]`.
- Project page: title, tags, description, stacked captioned screenshots, prev/next project.
- Credentials: list (title, issuer, date, Verify link, optional image) — hidden when empty.
- Contact: card with email (copy button + mailto), GitHub, LinkedIn.
- Footer: © year name.

## Motion
- Section scroll-reveal (IntersectionObserver + CSS transition, `.reveal` → `.is-visible`).
- Hero staggered entrance on load; subtle ring pulse.
- Card hover lift + thumbnail scale; chip hover tint. Nav blur on scroll.
- `prefers-reduced-motion: reduce` disables transforms/animations.

## Data model changes (migration `redesign_content_model`)
- profile: + `tagline text`, + `highlights text[] default '{}'` (avatar_url already exists)
- projects: + `slug text unique`, + `tags text[] default '{}'` (image_url = thumbnail)
- contact: + `github_url text`
- new `project_images(id, project_id fk cascade, url, caption, sort_order, created_at)` with RLS
  matching the other tables (public read, authenticated write).

## Admin (`/admin`)
- Sidebar layout: Profile, Projects, Credentials, Contact; Sign out; "View site".
- Profile: photo upload, name, headline, tagline, bio, highlights (one per line), skills (comma list).
- Projects: list ordered by sort_order with up/down reorder; New/Edit page: title, slug (auto from
  title, editable), description, tags, thumbnail, gallery manager (multi-upload, caption, reorder,
  remove; saved as one array on submit), Delete with confirm.
- Credentials: list + New/Edit page, Delete with confirm.
- Contact: email, GitHub, LinkedIn.
- Forms use `useActionState`; actions return `{ ok, message, errors? }`; inline errors + toast.

## Import
- `scripts/seed-from-reference.ts` (run once locally, needs SUPABASE_SERVICE_ROLE_KEY): fetches
  data.js + images from the GitHub Pages site, uploads images to `portfolio-media/imported/…`,
  upserts profile/contact/projects/project_images. Fixes: LinkedIn gets https://, GitHub placeholder
  left blank, "Salesforece" → "Salesforce".
- Interim: text content seeded via SQL with image URLs hotlinked to GitHub Pages.

## Deploy & verification
- `npm run lint && npm run build` green; browser QA desktop + mobile (one batched round, one fix batch,
  one confirm round); merge `redesign/navy-cyan` → `main`, push → Vercel; verify live URL.
