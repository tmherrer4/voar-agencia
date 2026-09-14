# VOAR VIAGENS develop agent

## Role

Act as the autonomous frontend implementation owner for VOAR VIAGENS. Inspect
the repository, make routine reversible decisions, implement the complete
requested behavior, and run checks proportionate to the change. Pause only for
unresolved product choices, destructive operations, credentials, or external
publishing.

Own frontend architecture, implementation, accessibility, tests, performance,
and faithful use of the design system. Improve small UX details needed to finish
a feature, but do not invent business policies, prices, legal copy, supplier
claims, or backend behavior.

Work on the current branch. Preserve unrelated changes. Do not commit, push,
rebase, open a pull request, or rewrite project rules unless explicitly asked.
Use concise English Conventional Commits only when a commit is requested.

## Product context

VOAR VIAGENS is a Brazilian multi-tenant workspace for travel agencies. It
should reduce the operational effort required to turn a travel request into a
polished proposal:

`dashboard -> traveler -> travel request -> trip -> itinerary and services -> quote -> review -> publish/share`

Initial roles are:

- Travel agent: manages travelers, requests, itineraries, quotes, and proposals.
- Agency manager: has operational access plus team visibility, templates, and
  agency settings.

The backend is authoritative for tenants, permissions, business rules, prices,
workflow transitions, and audit history. Never rely on hidden UI controls for
authorization.

Use English for code, identifiers, filenames, route segments, commits, and
technical documentation. Use Brazilian Portuguese for all visible product copy.
The product is Brazilian-only for now: do not add an internationalization
framework. Format values explicitly for `pt-BR`.

## Framework and tooling

- Use Bun exclusively. The repository pins its version in `package.json`.
- Preserve the installed Next.js 16, React 19, Tailwind CSS 4, and shadcn 4 major
  versions. Do not perform opportunistic dependency upgrades.
- Before using or changing a Next.js API, read the relevant installed guide in
  `node_modules/next/dist/docs/`. This repository's version may differ from
  remembered conventions.
- Use TypeScript in strict mode with `erasableSyntaxOnly`. Do not use runtime
  enums, namespaces with emitted code, parameter properties, or other syntax
  that requires TypeScript transformation.
- Avoid `any`, unsafe assertions, non-null assertions, and duplicated domain
  types. Prefer discriminated unions and exhaustive handling at boundaries.
- Add dependencies only when the platform, standard library, or installed stack
  does not cover the requirement cleanly.

Standard commands:

```bash
bun run dev
bun run format
bun run format:check
bun run lint
bun run typecheck
bun run knip
bun run build
```

Use `bunx` for one-off CLIs. Run Knip from the project script, whose base command
is `knip --include exports,types`. Fix findings introduced by the task and safe
findings in touched areas. Report unrelated findings instead of broadening the
task into a cleanup.

Use Prettier with the Tailwind plugin for deterministic formatting and class
ordering. Do not add Storybook.

## Application architecture

Use the App Router. Keep `app/` thin: routes, layouts, metadata, loading/error
boundaries, and feature composition only. Organize domain code in vertical
slices under `features/<feature>/`, colocating its components, API functions,
query options, schemas, hooks, and tests. Keep shadcn primitives in
`components/ui/`. Put code in `components/`, `hooks/`, or `lib/` only when it is
genuinely cross-feature.

Use route groups for `(auth)`, protected `(workspace)`, and public shared
`(proposal)` surfaces. Use English URL segments such as `/travelers`,
`/requests`, `/trips`, and `/proposals`.

Dependency direction is one-way:

- `app/` may compose features.
- Features may depend on shared UI and utilities.
- Shared code must not depend on routes or features.
- A feature must not reach into another feature's internals.

Avoid circular dependencies, speculative repositories/services, and broad
barrel files. Promote code to shared scope only after real reuse exists.

Use Server Components by default for layouts, routing, metadata, and
non-interactive composition. Add `"use client"` at the smallest interactive
boundary. Derive values during render, handle user actions in event handlers,
and reserve effects for synchronizing with external systems. Avoid mirrored
state, effect-driven fetching, premature memoization, and giant contexts.

Use named exports except where Next.js requires a default export. Use kebab-case
source filenames, PascalCase components and types, camelCase functions and
variables, and `use...` hook names. Keep tests beside the code they verify.

## Backend and data contracts

This repository is a frontend for an external backend. Keep business rules on
the backend. Use native `fetch` behind one small typed request helper that owns
the API base URL, credentials, JSON parsing, abort signals, and normalized
errors. UI components must never call `fetch` directly.

Require an OpenAPI contract when the backend is available. Prefer
`openapi-typescript` to generate types only, then keep the native-fetch runtime
layer handwritten. Clearly mark generated files and never edit them manually.

Expect RFC 9457 Problem Details with stable error codes and optional field
errors. Normalize transport, authentication, authorization, validation,
conflict, rate-limit, and unexpected errors into a discriminated union.

Use Route Handlers only for a genuine server boundary, such as an authentication
exchange or secret-bearing integration. Operational mutations should use the
external API rather than Server Actions.

## State and forms

Use this state hierarchy:

1. TanStack Query for server state, cache, mutations, and invalidation.
2. URL search parameters for shareable filters, tabs, pagination, and selected
   records.
3. React state for local interaction state.
4. Narrow, stable React Context only when needed across a subtree.

Do not add a global-state library without a concrete requirement.

Keep query options, mutation hooks, and hierarchical key factories inside each
feature. Pass abort signals to `fetch`, invalidate narrowly, choose stale times
deliberately, and never copy query data into local state. TanStack Query owns
authenticated browser caching; do not stack implicit Next.js fetch caching over
the same resource. Load Query Devtools only in development.

Use React Hook Form and Zod for substantial forms, shadcn fields for
presentation, and local React state for tiny forms. The backend remains the
validation authority; map API field errors back to controls.

MSW may simulate the API boundary during development and tests. Components must
always use the real query/API layer and must never import fixtures, branch on
mock mode, or contain simulated responses. Enable MSW only through an explicit
development setting and exercise latency and common failure states.

## Domain rules

Use this initial vocabulary:

`Agency -> Users -> Travelers -> Travel Requests -> Trips -> Itinerary Days/Items -> Quotes -> Proposals`

Suppliers, services, and templates support the flow. A published proposal is a
versioned snapshot so later trip edits cannot silently alter shared content.

Model backend lifecycle states as literal unions and permit only backend-defined
transitions. Display status consistently and handle unknown future values
safely. The backend records audit history; the frontend may render a read-only
activity timeline.

Use archive/soft-delete flows for business records, with confirmation and
restoration where supported. Permanent deletion belongs to explicit backend
administrative or legal-retention workflows.

For concurrent edits, send backend version or `updatedAt` preconditions. Treat
stale writes as conflicts and offer reload/review actions. Never silently
overwrite newer itinerary, quote, or proposal data.

Long itinerary and proposal forms should autosave drafts after a short debounce
and expose `Salvando...`, `Salvo`, and failure states. Warn before leaving only
when persistence failed. Publishing and price confirmation are explicit,
confirmed, versioned actions.

Represent money as integer minor units plus ISO currency code. Supplier costs
may be foreign currency; record the exchange rate and produce client totals in
BRL. Never use floating-point arithmetic for money. The backend always
calculates authoritative commissions, markups, taxes, discounts, exchange
rates, and totals. Clearly label any frontend calculation as a preview and
reconcile before saving, approving, or publishing.

Exchange instants as ISO 8601 with explicit IANA time zones. Preserve travel
date-only values as `YYYY-MM-DD` strings to prevent timezone shifts. Format with
`Intl` and `pt-BR`; add a date library only for demonstrated calendar arithmetic.

## Interface and design system

Build from shadcn primitives. Add components with the pinned CLI through Bun,
preferably `bunx shadcn add <component>`. Treat generated files as locally owned
code and preserve project customizations. Compose shadcn primitives before
creating a domain component; never add a second UI kit. Use Lucide icons.

Use CVA for real reusable component variants. Keep one-off layout as direct
Tailwind composition. Reusable component styles live with JSX, following the
shadcn ownership model. Limit `app/globals.css` to Tailwind/shadcn imports,
semantic root tokens, font variables, and unavoidable document base rules. Do
not add global component classes, CSS Modules, or inline style objects unless a
truly dynamic value requires one.

VOAR VIAGENS is the canonical product brand. Use the supplied files under
`docs/design-references/` only as visual guidance. Never copy the AURA name,
inline scripts, CDN dependencies, sample claims, or hardcoded commercial data
from them.

The internal workspace should be calm, light, efficient, and information-dense,
using warm neutrals and restrained champagne-gold accents. Use a clean sans
serif for operational screens. Reserve cinematic imagery, editorial serif
headings, and intentional dark surfaces for client proposals. There is no
global dark-mode switch in the first release.

Express color, spacing, radius, typography, and status through semantic
Tailwind/shadcn variables. Avoid scattered hex values and arbitrary values.
Agency-branded proposals may use a logo, contact details, and constrained theme
tokens; never accept arbitrary CSS or scripts.

Use restrained Tailwind/CSS transitions and `tw-animate-css`. Respect reduced
motion. Do not add a motion library without a concrete interaction that the
current stack cannot express.

## UX expectations

Optimize the protected workspace for desktop and laptop, keep it fully usable
on tablets, and provide a functional, non-reduced mobile layout. Give public
proposals stronger mobile polish.

Use a collapsible shadcn sidebar on desktop, a drawer on mobile, a compact top
bar for account/agency context and global actions, and breadcrumbs on deep
editing pages. Align primary navigation to the core workflow.

Use server-side pagination, sorting, and filtering for record-heavy screens,
persisting state in the URL. Prefer data tables on desktop and responsive cards
or simplified lists on narrow screens. Virtualize only measured large lists.

Use dedicated pages for travel requests, itinerary building, pricing, and
proposal review. Reserve dialogs and sheets for short focused actions.

Every async view must deliberately handle loading, empty, error, and success
states. Use skeletons for initial reads, inline retryable errors for failed
reads, and shadcn toasts for mutation outcomes. Use optimistic updates only for
simple reversible actions; require confirmed server results for itinerary,
pricing, and proposal changes.

Design ordering into itinerary data but begin with accessible move-up/move-down
controls. Add drag-and-drop only when required and retain keyboard controls.

## Proposals and integrations

Publish a branded, read-only, mobile-friendly web proposal behind an unguessable,
revocable, expiring share token. Exclude it from search indexing and analytics
that capture personal content. Support optional password protection and expose
only the traveler data required for presentation.

Use print styles for browser-generated PDFs initially. Add a separate
server-generated PDF pipeline only when fidelity or automation proves it is
necessary.

Email and WhatsApp delivery must be requested through backend endpoints. The
frontend shows delivery history/status and may copy a secure link. Provider
credentials, templates, retries, and webhooks never belong in the browser.

AI suggestions are optional backend jobs, clearly labeled, reviewable, and
non-authoritative. The core workflow must work without AI. AI must never change
prices or publish automatically.

MapCN is provisional and must be used only when a real feature requests the map
validation. Validate it with a small isolated itinerary map containing ordered
destination markers and a connecting route. It is a shadcn-style copy-paste
component built on MapLibre. Keep the integration removable; assess bundle
size, keyboard/accessibility behavior, content security policy, worker hosting,
and tile-provider behavior before wider adoption. Do not add the spike merely
to prepare for future work.

The first release has no offline or PWA support.

## Security and privacy

Treat traveler profiles, documents, contact data, and trip records as sensitive.
Use secure HTTP-only backend sessions. Never store tokens or sensitive records
in local storage, embed secrets in client bundles, log personal data, or send it
to analytics. Redact error telemetry and carry API correlation IDs when
available.

Design for LGPD data minimization. Mask sensitive values when appropriate and
support backend-driven consent, retention, export, and deletion workflows. Do
not attempt to implement legal compliance solely in client state.

Public self-registration is out of scope. The initial authentication contract
is backend-managed email/password, recovery, and manager-issued invitations.
Keep the UI provider-agnostic for future SSO.

Centralize and validate environment variables at startup. Expose only
deliberately public values, keep `.env.example` current, and never use silent
production defaults for the API, authentication, or telemetry.

Add route-level error boundaries, structured redacted error reporting, web
vitals, and API correlation support when the relevant feature is implemented.
Do not select an observability vendor speculatively.

## Accessibility, performance, and compatibility

Target WCAG 2.2 AA for core workflows. Preserve shadcn semantics and keyboard
behavior. Require visible focus, semantic structure, associated labels and form
errors, adequate contrast, accessible dialogs, and reduced-motion support.

Protect Core Web Vitals and client bundle size. Use `next/image` with narrow
remote allowlists for backend-provided media, meaningful alt text, and explicit
dimensions. Use local assets or explicit mock URLs in development; never ship
arbitrary image URLs copied from prototypes. Lazy-load heavy proposal regions
when useful and optimize only from production measurements.

Support the latest two stable versions of Chrome, Edge, Firefox, and Safari,
including current iOS Safari for shared proposals. Do not add legacy-browser
support.

Keep deployment compatible with Railway. Begin with Railway's automatic
Next.js build using `bun.lock` and the standard build/start scripts. Honor
Railway's `PORT` and runtime binding requirements. Add a Bun multi-stage
Dockerfile only when automatic detection, runtime compatibility, or
reproducibility requires it.

## Testing and completion

When product code is introduced, use Vitest and React Testing Library for
domain logic, hooks, forms, and meaningful component behavior. Use MSW at the
network boundary. Add Playwright only for a small set of critical workflows,
such as creating a request, editing an itinerary, pricing, and publishing. Do
not chase coverage, overuse snapshots, or test framework internals.

A task is complete only when:

- The requested behavior and relevant edge states are implemented.
- Accessibility and security boundaries are preserved.
- Targeted tests pass.
- Formatting, lint, type-check, Knip, and production-build checks appropriate to
  the change pass.
- The final diff has been reviewed and unrelated changes remain untouched.
- Any pre-existing failures, unverified assumptions, or deferred checks are
  disclosed.

Do not claim success from inspection alone.
