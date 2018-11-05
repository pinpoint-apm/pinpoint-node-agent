const exec = require('child_process').execSync;

const fileName = process.argv[2] || '*'
const filePath = `"**/${fileName}.test.js"`

const testNamePattern = process.argv[3] || null

const cmd = []
cmd.push('./node_modules/.bin/tape')
cmd.push(filePath)
cmd.push('|')
cmd.push('./node_modules/.bin/tap-spec')

console.log ('>> run cmd : ' + cmd.join(' '))

try {
  exec(cmd.join(' '), {stdio: [process.stdin, process.stdout, process.stderr]});
} catch (e) {
  process.exit(1)
}
