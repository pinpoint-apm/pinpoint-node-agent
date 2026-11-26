---
name: release
description: Release a new pinpoint-node-agent version to npm — release QA, changelog, version bump, tag, GitHub Release — and backport fixes to release/v1.4. Invoke with `/release`.
disable-model-invocation: true
---

## Release procedure

1. Create a release issue "Release X.Y.Z" with the milestone X.Y.Z and this checklist: version
   bump, CHANGELOG.md release date, release QA, npm publish, git tag, GitHub Release.
2. Release PR, on the branch the version ships from (`master`, or `release/v1.4` for 1.4.x):
   - CHANGELOG.md: replace `Unreleased` in the version's section header with the release date.
   - Bump the version in these files:
     - master: `package.json`, `package-lock.json` and the assertion in
       `test/data/dto/agent-info.test.js`
     - release/v1.4: `package.json`, `package-lock.json`, `demo/express/package.json` and the
       assertion in `test/agent.test.js`
3. After the PR is merged, run the release QA on the merged commit.
4. Publish from a worktree of the merged commit:
   - `npm publish --dry-run` lists only the agent files: no `test`, `demo`, `grpc` or `.claude`.
   - A version that is not the newest major goes under its own dist-tag, so `latest` stays on
     the newest major: `npm publish --tag release-1.4` for 1.4.x after 2.0.0.
   - `npm view pinpoint-node-agent dist-tags` shows the version under its tag; `latest` may lag
     a few minutes.
5. `git tag X.Y.Z` on the merged commit, then push it to upstream and origin.
6. `gh release create X.Y.Z`: the notes are the version's CHANGELOG.md sections, with no
   heading of their own.
7. Tick the release issue checklist, close the issue and the milestone, then sync master as in
   the AGENTS.md workflow.

## Release QA

Run it with the `qa` skill on the release commit, against a collector QA can read back.

- Functional: every scenario in `.claude/skills/qa/scenarios.md` on Express, Koa and Next.js,
  and `startup-scenarios.md` in this folder on one app.
- Memory: the three apps at the same time under a mixed load of the `scenarios.md` routes for
  30 minutes: `wrk -t2 -c2` on each app's main routes, plus its error routes every 5 seconds.
  - Heap snapshots: S1 after a 1 minute warm-up, S2 at 15 minutes, S3 at 30 minutes.
  - Compare and judge them as the `qa` skill's Memory check says.
- Post the report as a comment on the release issue, in the format of the 1.4.4 release QA
  comment (#549).

## Backport to release/v1.4

- Collect backport candidates and backport them together when a 1.4.x release starts, not one
  PR per fix.
- Work in a worktree of `upstream/release/v1.4` with its own `npm ci`; master and 1.4
  dependencies differ.
- One commit per backported issue, titled `[#N] <master issue title>`. Merge the PR with rebase
  or a merge commit, not squash, so each task stays one commit.
- Test on Node.js 22. Export only `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE`; with
  `TESTCONTAINERS_HOST_OVERRIDE` set, the endpoint assertions that expect `localhost` fail.
- The version bump and the CHANGELOG section header go in the release PR, not the backport PR.
- QA of a backport PR is functional only; the memory check runs once at the release QA.
- `Closes #N` does not close an issue when the PR base is `release/v1.4`; tick and close it by
  hand after the merge.
