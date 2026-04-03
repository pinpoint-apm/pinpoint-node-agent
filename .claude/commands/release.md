## Release procedure

1. Create a release issue (e.g., "Release 1.4.1") with a checklist: update CHANGELOG.md, bump `version` in `package.json` and `demo/express/package.json`, update version assertion in `test/agent.test.js`, memory leak test, npm publish, git tag, GitHub Release.
2. Update CHANGELOG.md with release notes and migration guide links.
3. Bump version in `package.json`, `demo/express/package.json`, and `test/agent.test.js`.
4. After PR merge, run memory leak test and post results as a comment on the release issue.
5. `npm publish` and verify on npmjs.com.
6. `git tag <version>` → `git push upstream <version>`.
7. Create GitHub Release from the tag with release notes from CHANGELOG.md.
