# Admin API — Agent Guide

## Package manager

Use `pnpm` (not npm). Lockfile is `pnpm-lock.yaml`. `.npmrc` sets `node-linker=hoisted`.

## Key commands

```bash
pnpm dev            # hot-reload dev server (tsx watch)
pnpm build          # tsc compile to dist/
pnpm start          # node dist/index.js
pnpm test           # jest
pnpm test:coverage  # jest --coverage (threshold 80%)
pnpm lint           # eslint src/
pnpm lint:fix       # eslint src/ --fix
pnpm format         # prettier --write "src/**/*.ts"
pnpm migration:run  # typeorm migration:run
pnpm migration:generate  # typeorm migration:generate
```

Pre-commit hook runs `pnpm lint-staged` which calls `eslint --fix` + `prettier --write` on staged `.ts` files.

## Architecture

Clean Architecture, strict layering:

```
src/
  domain/          # entities, value-objects, repository interfaces — zero deps
  application/     # use cases, DTOs — depends only on domain
  infrastructure/  # TypeORM, telemetry, auth providers
  presentation/    # Fastify, routes, controllers, plugins
  shared/          # env config, error handler, AppError
```

Dependency rule: `domain ← application ← presentation/infrastructure`. Never import infra into domain.

## Path aliases

```json
"@domain/*", "@application/*", "@infrastructure/*", "@presentation/*", "@shared/*"
```

Configured in both `tsconfig.json` and `jest.config.ts` (moduleNameMapper). Tests use separate `tsconfig.test.json` that extends main config with `"types": ["jest", "node"]`.

## Env loading

- `.env.local` for development
- `.env.test` for tests (auto-detected via `NODE_ENV === 'test'`)
- Loaded by `src/shared/constants/env.ts` using dotenv

## TypeScript quirks

- `tsconfig.json` uses `ignoreDeprecations: "6.0"` because `baseUrl`/`paths` are deprecated in TS 7+
- `emitDecoratorMetadata` + `experimentalDecorators` enabled (TypeORM requirement)

## Fastify quirks

- Routes mounted under `/api/v1` prefix
- `app.authenticate` decorator available for route protection (`preHandler: [app.authenticate]`)
- Error handler (`src/shared/middleware/error-handler.ts`) uses `as unknown as Record<string, unknown>` cast for unknown error statusCodes
- `app.ts` uses `as any` casts for `setErrorHandler` and `register(routes)` — Fastify v4 type limitations

## Tests

- Use `jest.mock` pattern (manual mocks)
- Repositories are mocked via `jest.Mocked<UserRepository>`
- All test files live under `tests/` directory
- Coverage threshold: 80% across branches, functions, lines, statements

## Database

- TypeORM with MySQL
- `synchronize: true` only in development
- Entity files: `*.entity.ts` in `src/infrastructure/database/entities/`
- Migration commands use `typeorm-ts-node-commonjs` with `-d src/infrastructure/database/typeorm.config.ts`

## Telemetry

- OpenTelemetry traces export to OTLP endpoint (`OTEL_ENDPOINT` env)
- Prometheus metrics at `GET /metrics`
- Health check at `GET /health`

## Docker

- `docker-compose.yml` includes MySQL 8, app (build from Dockerfile), and OTEL collector
- Quick start: `docker compose --env-file .env.local up -d`
