# Plan — navy/cyan redesign

1. Branch `redesign/navy-cyan`; commit spec + plan.
2. Apply migration `redesign_content_model` via Supabase MCP.
3. Seed text content via SQL (hotlinked image URLs).
4. `lib/types.ts` + `lib/data.ts` (typed queries) + `lib/slug.ts`.
5. Tokens, fonts, `globals.css`, root layout, metadata.
6. Public components: Nav, Hero, About, Skills, ProjectCard, ProjectsGrid, Credentials, Contact, Footer, Reveal, icons.
7. `/projects/[slug]` page + not-found.
8. Admin: layout + sidebar, profile, contact, projects (list/new/edit + GalleryManager), credentials (list/new/edit), actions with `useActionState`, toast; login restyle.
9. `scripts/seed-from-reference.ts` + `npm run seed:reference` (runs when service key present).
10. Lint, build, dev server, browser QA (desktop + mobile), one fix batch, confirm.
11. Merge to main, push, verify live; update memory note.
