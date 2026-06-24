# OWC Website — Office of Workers Compensation Papua New Guinea

Full-stack corporate website for the Papua New Guinea Office of Workers Compensation, with a public-facing site and a Staff CMS with role-based access control and content approval workflows.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing key

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS (artifact: `owc-website`, path `/`)
- API: Express 5 (artifact: `api-server`, path `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Auth: JWT (`jsonwebtoken`) + password hashing (`bcryptjs`)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/owc-website/src/pages/` — all public pages (Home, About, Services, Forms, News, Publications, Legislation, Tenders, FAQs, Contact, Search)
- `artifacts/owc-website/src/pages/staff/` — Staff CMS pages (login, dashboard, news, publications, forms, legislation, tenders, services, faqs, contact-submissions, pending-approvals, users)
- `artifacts/owc-website/src/components/staff/StaffLayout.tsx` — staff sidebar layout
- `artifacts/api-server/src/routes/` — all API route handlers (staff auth, CRUD for all content types, search, stats, contact)
- `lib/db/src/schema/index.ts` — Drizzle DB schema (source of truth)
- `lib/api-spec/src/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → React Query hooks + Zod validators. Edit the spec, run codegen, never hand-write hooks.
- JWT auth for staff with `requireStaffAuth` middleware; tokens stored in `localStorage` as `owc_staff_token`.
- Staff roles: `admin` > `editor` > `viewer`. Admins manage users and approve content. Editors create/edit. Viewers read-only.
- Approval workflow: content created by editors lands in `draft` status; admins approve to `published`.
- bcryptjs (pure JS) used instead of native `bcrypt` to avoid native module build issues on Replit.

## Product

**Public site:** Home, About, Services, Forms & Downloads, News (list + article detail), Publications, Legislation, Tenders, FAQs, Contact, Site Search.

**Staff CMS** (at `/staff`): Login portal → Dashboard → manage News, Publications, Forms, Legislation, Tenders, Services, FAQs, Contact Submissions, Pending Approvals, User Management.

## Default Staff Credentials

- **Email:** `admin@owc.gov.pg`
- **Password:** `Admin123!`
- **Role:** admin (full access)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT use `pnpm approve-builds` — it is interactive and will hang.
- `bcryptjs` is pure JS. Do NOT switch to native `bcrypt`.
- After schema changes, run `pnpm run typecheck:libs` to rebuild lib declarations before leaf checks.
- Some generated API params (e.g. `ListFormsParams`, `ListServicesParams`, `ListFaqsParams`) do not have a `limit` field — use `{}` or other available params.
- Staff page type casts: use `as unknown as ContentItem[]` for API response arrays, `as unknown as Parameters<typeof mutate>[0]["data"]` for mutation data params.
- `useSearch` requires `queryKey` in its query options object (generated hook quirk).
- Paths are NOT rewritten by the proxy — services must handle their full base path (e.g. `/api/...`).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
