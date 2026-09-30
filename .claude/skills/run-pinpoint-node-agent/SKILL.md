---
name: run-pinpoint-node-agent
description: Run the pinpoint-node-agent test suite, a single test file, lint, or coverage locally. Use when asked to run, test, lint, or check coverage for the agent, or to confirm a change works before a PR. Library package; Tape tests, testcontainers for integration tests.
---

# Run pinpoint-node-agent

pinpoint-node-agent is a library, not a server. "Running" it means running its Tape tests. Run commands from the repo root.

## Prerequisites

- `npm install` done.
- Docker running for integration tests in `test/instrumentation/module/` (testcontainers: MongoDB, MySQL, PostgreSQL, Redis).

## Tests

```bash
# Single file, while iterating
npx tape test/path/to/file.test.js

# Files matching a pattern
npx tape -i .testignore 'test/instrumentation/**/*.test.js'

# Full suite, before a PR
npm test
```

## Lint

```bash
npm run lint
```

Writes results to `checkstyle-result.xml` and always exits 0, so read the file to see violations.

## Coverage

```bash
npm run coverage
```

nyc prints a text summary and writes lcov to `coverage/`.
