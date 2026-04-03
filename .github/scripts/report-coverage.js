const fs = require('fs')
const { execSync } = require('child_process')

module.exports = async ({ github, context }) => {
  const lcov = fs.readFileSync('lcov.info', 'utf8')

  // Parse lcov summary
  let totalLines = 0
  let hitLines = 0
  let totalBranches = 0
  let hitBranches = 0

  for (const line of lcov.split('\n')) {
    if (line.startsWith('LF:')) totalLines += parseInt(line.slice(3), 10)
    if (line.startsWith('LH:')) hitLines += parseInt(line.slice(3), 10)
    if (line.startsWith('BRF:')) totalBranches += parseInt(line.slice(4), 10)
    if (line.startsWith('BRH:')) hitBranches += parseInt(line.slice(4), 10)
  }

  const lineCov = totalLines > 0 ? ((hitLines / totalLines) * 100).toFixed(2) : '0.00'
  const branchCov = totalBranches > 0 ? ((hitBranches / totalBranches) * 100).toFixed(2) : '0.00'

  const body = [
    '## Code Coverage Report',
    '',
    '| Metric | Hit | Total | Coverage |',
    '|--------|-----|-------|----------|',
    `| Lines | ${hitLines} | ${totalLines} | ${lineCov}% |`,
    `| Branches | ${hitBranches} | ${totalBranches} | ${branchCov}% |`
  ].join('\n')

  // Read PR number from artifact
  let prNumber
  try {
    prNumber = parseInt(fs.readFileSync('pr-number.txt', 'utf8').trim(), 10)
  } catch (e) {
    console.log('No PR number artifact found — skipping coverage comment.')
    return
  }

  // Find existing coverage comment to update
  const comments = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber
  })
  const marker = '## Code Coverage Report'
  const existing = comments.data.find(c => c.body && c.body.startsWith(marker))

  if (existing) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existing.id,
      body: body
    })
  } else {
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
      body: body
    })
  }
}
