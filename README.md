# VOAR VIAGENS frontend

Internal workspace for Brazilian travel agencies to turn traveler requests into
itineraries, quotes, and polished client proposals.

## Requirements

- [Bun 1.4.0](https://bun.sh/)

Install dependencies and start Next.js:

```bash
bun install
bun run dev
```

Open <http://localhost:3000>.

## Commands

```bash
bun run dev           # development server
bun run build         # production build
bun run start         # production server
bun run format        # format supported files
bun run format:check  # verify formatting
bun run lint          # ESLint and Next.js rules
bun run typecheck     # strict TypeScript check
bun run knip          # unused exports and types
bun run check         # non-build quality checks
```

Use `bun install --frozen-lockfile` in reproducible environments.

## Architecture

This is a Next.js 16 App Router frontend for an external API. Product code will
use feature-oriented vertical slices: thin routes under `app/`, domain code
under `features/`, shadcn primitives under `components/ui/`, and genuinely
shared utilities under `lib/` or `hooks/`.

The planned application stack includes shadcn, Tailwind CSS, TanStack Query,
React Hook Form, Zod, OpenAPI-generated types, and MSW at the development/test
network boundary. Runtime libraries are added only when the first real feature
uses them.

Components always consume the typed API/query layer. MSW may replace the network
boundary in development and tests, but mock fixtures never belong in components.
Add `.env.example` with the first environment-backed integration and keep it in
sync with the validated configuration.

User-facing text and formatting target Brazilian Portuguese (`pt-BR`). Source
code and technical documentation use English.

## Agent development contract

Codex and Claude share the instructions in
[`agents/develop_agent.instructions.md`](agents/develop_agent.instructions.md).
`AGENTS.md` activates the contract for coding work, and `CLAUDE.md` imports
`AGENTS.md`.

## Design references

Non-production references live in [`docs/design-references/`](docs/design-references/).

## Deployment

Railway is the deployment target. Begin with its automatic Next.js build using
the committed `bun.lock` and the standard `build` and `start` scripts. Add a
Dockerfile only if automatic detection or runtime reproducibility requires it.
