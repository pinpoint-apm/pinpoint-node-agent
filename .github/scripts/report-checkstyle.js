const fs = require('fs')

module.exports = async ({ github, context, workspacePath }) => {
  const xml = fs.readFileSync('checkstyle-result.xml', 'utf8')

  const annotations = []
  const fileRegex = /<file name="([^"]+)">([\s\S]*?)<\/file>/g
  const errorRegex = /<error line="(\d+)" column="(\d+)" severity="(\w+)" message="([^"]*)" source="([^"]*)"[\s]*\/>/g

  let fileMatch
  while ((fileMatch = fileRegex.exec(xml)) !== null) {
    const filePath = workspacePath
      ? fileMatch[1].replace(`${workspacePath}/`, '')
      : fileMatch[1]
    const fileContent = fileMatch[2]
    let errorMatch
    while ((errorMatch = errorRegex.exec(fileContent)) !== null) {
      annotations.push({
        path: filePath,
        start_line: parseInt(errorMatch[1], 10),
        end_line: parseInt(errorMatch[1], 10),
        annotation_level: errorMatch[3] === 'error' ? 'failure' : 'warning',
        message: `[${errorMatch[5]}] ${errorMatch[4]}`
      })
    }
  }

  const summary = annotations.length === 0
    ? 'No checkstyle issues found.'
    : `Found ${annotations.length} checkstyle issue(s).`

  const headSha = context.payload.workflow_run.head_sha

  // Checks API allows max 50 annotations per request
  const batchSize = 50
  for (let i = 0; i < Math.max(annotations.length, 1); i += batchSize) {
    const batch = annotations.slice(i, i + batchSize)
    await github.rest.checks.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      name: 'Checkstyle Report',
      head_sha: headSha,
      status: 'completed',
      conclusion: annotations.length === 0 ? 'success' : 'neutral',
      output: {
        title: 'Checkstyle Results',
        summary: summary,
        annotations: batch
      }
    })
  }
}
