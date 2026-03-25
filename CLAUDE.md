# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests
npm test

# Run a single test file
npx tape test/path/to/file.test.js

# Run tests matching a pattern
npx tape -i .testignore 'test/instrumentation/**/*.test.js'

# Lint (outputs checkstyle-result.xml)
npm run lint

# Test coverage
npm run coverage
```

## Architecture

This is the official Pinpoint APM agent for Node.js. It instruments Node.js applications to collect distributed traces and metrics, then ships them to a Pinpoint collector via gRPC.

### Initialization Flow

`index.js` bootstraps the agent:
1. `ConfigBuilder` loads config from `pinpoint-config.json` (searched in entry script dir, then cwd) merged with env vars
2. `AgentBuilder` assembles the agent with logger, gRPC data sender, enrichers, and services
3. `UriStatsMonitor` starts collecting URI/exception statistics if enabled
4. Module instrumentation hooks are registered via `require-in-the-middle` and `@pinpoint-apm/shimmer`

### Key Layers

- **`lib/context/`** — Trace lifecycle. `TraceContext` manages active traces using async-local-storage (thread-local equivalent). Traces contain call stacks and spans.
- **`lib/instrumentation/module/`** — 13 framework plugins (Express v4/v5, Koa, HTTP/HTTPS, MongoDB, MySQL, MySQL2, pg, Redis, ioredis, Fetch/Undici, Next.js). Each patches the framework to create/continue trace spans.
- **`lib/client/`** — gRPC sender that streams trace data to the Pinpoint collector (default: localhost:9991-9993).
- **`lib/metric/`** — Background monitors: `AgentStatsMonitor` (CPU/memory), `UriStatsMonitor` (request URI patterns), `PingScheduler` (heartbeat), `ActiveRequestRepository` (in-flight requests).
- **`lib/data/`** — DTOs and protobuf definitions (`lib/data/v1/`) for the wire protocol.

### Trace Enrichers

Enrichers (`SpanRecorderEnricher`, `TraceCompletionEnricher`) are applied to spans before transmission. They are registered via `AgentBuilder.addEnricher()` and run in the `TraceContext`.

### Configuration

Default config lives in `lib/pinpoint-config-default.json`. Key defaults: sampling rate 10% (1/10), collector at localhost, URI stats enabled. Environment variables override JSON config.

### Exports

The package exposes named exports for programmatic use:
- `./agent-builder` — `AgentBuilder` class
- `./config` — `ConfigBuilder` class
- `./uri-stats` — `UriStatsBuilder` for manual URI stats recording
- `./agent-info` — `AgentInfo` metadata

### Test Framework

Tests use **Tape** (not Jest/Mocha). Integration tests in `test/instrumentation/module/` use **testcontainers** to spin up real databases (MongoDB, MySQL, PostgreSQL, Redis). The `.testignore` file excludes `node_modules`.

TypeScript declarations are in `index.d.ts` and per-module `.d.ts` files; generated output goes to `dist/`.

## Git Rules

- **One commit per PR**: Before committing, squash all changes into a single commit using `git commit` (not amend). If multiple commits exist on the branch, squash them before pushing.
- **Commit message format**: `[#ISSUE_NUMBER] Short description` followed by a concise body explaining what and why.
- **No Co-Authored-By lines**: Do not append `Co-Authored-By` trailers to commit messages.
- **Testing**: New features and bug fixes must include functional tests for all supported web frameworks (Express, Koa, Next.js). Run relevant test files and confirm they pass before committing.
- **All documentation in English**: Commit messages, PR descriptions, issue bodies, review comments, and any GitHub-facing content must be written in English. Keep concise with bullet points, and update PR descriptions via `gh pr edit` when pushing changes that alter scope.
- **After PR merge**: `git fetch upstream` → `git checkout master` → `git rebase upstream/master` → `git push origin master` → delete feature branch locally and remotely.
- **New tasks**: When starting a new feature or issue without an existing GitHub issue, create one first via `gh issue create`.
