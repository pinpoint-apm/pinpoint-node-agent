# AGENTS.md — pinpoint-node-agent

Personal, uncommitted instructions go in `~/.claude/CLAUDE.md` or `~/.claude/skills`. A `CLAUDE.local.md` anywhere in the tree stops Claude Code from reading this file.

## Testing

- Tests use Tape. While iterating, run the affected file: `npx tape test/path/to/file.test.js`.
- Before a PR, run the full suite: `npm test`. Integration tests in `test/instrumentation/module/` use testcontainers, so Docker must be running.
- New features and bug fixes need functional tests for every supported web framework (Express, Koa, Next.js).
- Lint, coverage and other commands: `run-pinpoint-node-agent` skill.

## Workflow

1. **Issue**: create a GitHub issue in `pinpoint-apm/pinpoint-node-agent` (`gh issue create`) if none exists, with the milestone of the next release. The body opens with one or two sentences on what to do, then a task checklist. Under each task, its verification as `input → expected result` bullets that run locally. Reference links go last.
2. **Branch**: create a feature branch from `upstream/master`.
3. **Code changes**: implement the feature or fix.
4. **Testing**: add or update functional tests, then run them. While they run, show the developer the PR draft (title, body, milestone).
5. **Review**: stop and wait for the developer to review the diff. Do not proceed until they explicitly approve.
6. **Commit and push**: squash into a single commit (`git commit`, not amend) and push the branch. Message: `[#ISSUE_NUMBER] Short description`, the title line only.
7. **PR**: create it with `gh pr create`. Same milestone as the issue; `Closes #ISSUE_NUMBER` in the body. A PR that changes the published package bumps `version` in `package.json` and adds a CHANGELOG.md section, crediting external reporters.
8. **After merge**: `git fetch upstream` → `git checkout master` → `git rebase upstream/master` → `git push origin master` → delete the feature branch locally and remotely. Tick the issue checklist and reflect any scope change.

Release: `release` skill.

## Writing

Issues, PRs, commits and comments are in English, concise, bullet points, no emojis. Post once the draft is approved.

- PR: the title names the main change. The body opens with why the change was made, in one or two sentences, then `## Test plan` with the checked results and `Closes #N`. No other headers.
