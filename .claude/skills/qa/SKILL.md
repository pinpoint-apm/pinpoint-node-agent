---
name: qa
description: QA a pinpoint-node-agent change end to end on a worktree. Derive scenarios from the issue, run them in an app with the agent against a local collector, check memory with heap snapshots when the change calls for it, and report pass/fail with evidence. Use after the Tape tests pass, before a PR is merged and before a release.
---

# QA

Tape tests prove the code. QA proves the change in a running app, the way a user of the
agent sees it. Run QA after the tests pass.

## Target

- QA runs on a worktree path of the branch under test.
- Run every scenario on the base, the branch it merges into, and on the change branch.
  A scenario that passes on both did not test the change.

## Scenarios

- Write the scenario list before running anything, and show it to the developer.
- One scenario per `input → expected` bullet of the issue.
- Add the regressions the change can cause: the other frameworks (Express, Koa, Next.js),
  sampling off, error routes, async child traces, and the paths next to the changed code.

## Environment

- Apps: `demo/express`, `demo/koa-example`, `demo/nextjs`. Pick the ones the change touches.
- Collector: a local gRPC server that records every message it receives. Never an internal
  host. Point the agent at it with `PINPOINT_COLLECTOR_IP`, `PINPOINT_COLLECTOR_SPAN_PORT`,
  `PINPOINT_COLLECTOR_STAT_PORT` and `PINPOINT_COLLECTOR_TCP_PORT`.
  - The collector answers the span RPC the branch uses (`SendSpanBatch`, or the `SendSpan`
    stream on older branches).
  - Bind the span, stat and tcp services to separate ports, as in production. With one port,
    grpc-js shares the connection opened at agent start, so the span channel never opens its
    own socket inside a request and that path goes untested.
  - On master the adaptors in `test/support/test-grpc-data-sender.js` can serve as the collector.
- QA starts and stops its own app and collector. Note each PID and stop only those.
- Start node by its real binary (`node -p process.execPath`), not a version manager shim such
  as Volta's. With a shim the noted PID is the shim's, and a signal such as SIGUSR2 for a heap
  snapshot stops the shim instead of reaching the app.
  A server the developer started is left running.

## Checks

Pick the checks per change and say why each one was picked or skipped.

### Functional

- Send the scenario requests and check what the collector received: Span rpc and
  annotations, SpanChunk `localAsyncId`, metadata, ExceptionMetaData, stats.
- Judge by the received data, not by agent logs.

### Memory

- Pick it when the change touches the lifetime of traces, AsyncLocalStorage, senders,
  caches, timers or sockets, and before every release.
- Run the app with `--inspect` or `--heapsnapshot-signal=SIGUSR2`. Load it with
  `wrk -t2 -c2` on the main route, plus the error routes every few seconds.
- Take a snapshot after warm-up, then more at intervals under load.
- Compare across snapshots: `Trace`, `SpanEvent`, `DisableTrace`, `TraceRoot`,
  `SpanBuilder` / `SpanRecorder` / `CallStack`, the singletons, and heap size.
- For every retained `Trace`, read its retainer path. A path through `TCP`, `Http2Stream`
  or `Timeout` to `Symbol(kResourceStore)` means an agent resource holds a request's store.
- Pass: counts stay bounded, heap size stays flat, no `Trace` is held by an agent resource.
- Report it in the format of the 1.4.4 release issue comment (#549): environment, load,
  object count table per snapshot, findings, conclusion.

### Compatibility

- The Node.js versions in `package.json` `engines` and the frameworks the change touches.

## Report

- One line per scenario: PASS or FAIL, the scenario, the evidence (command, output,
  received data). Base and change branch side by side.
- Then the environment: worktree, commit, Node.js version, app, load.
- Post the report as a comment on the PR under test; a release QA goes on the release
  issue. When QA runs before the PR exists, post it right after the PR is created.

## Cleanup

- No app, collector or load process is left after QA.
- Heap snapshot files are removed unless the developer asks to keep them.
