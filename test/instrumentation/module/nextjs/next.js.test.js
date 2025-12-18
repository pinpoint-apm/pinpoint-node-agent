/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const path = require('path')
const fixtures = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'db')
const { MySqlContainer } = require('@testcontainers/mysql')
const testAppDir = path.join(__dirname, 'nextjs-app-router')
const fs = require('fs')

let container
test('setup', async (t) => {
    const source = path.resolve(fixtures, 'mysql.sql')
    container = await new MySqlContainer()
        .withCommand('--default-authentication-plugin=mysql_native_password')
        .withEnvironment({
            'MYSQL_DATABASE': 'test',
            'TZ': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: source,
            target: '/docker-entrypoint-initdb.d/mysql.sql'
        }])
        .start()
    t.pass('setup complete')
    t.end()
})

// ref: https://github.com/elastic/apm-agent-nodejs/blob/main/test/instrumentation/modules/next/next.test.js
const haveNodeModules = fs.existsSync(
    path.join(testAppDir, 'node_modules', '.bin', 'next'),
)
test(`setup: npm ci (in ${testAppDir})`, { skip: haveNodeModules }, (t) => {
    const { execSync } = require('child_process')
    try {
        execSync('npm ci', {
            cwd: testAppDir,
            stdio: 'inherit',
        })
        t.pass('npm ci complete')
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

let nextServerProcess
test('Next.JS Production Server start', (suite) => {
    suite.test('setup: npm run build', (t) => {
        const { execSync } = require('child_process')
        try {
            execSync('npm run build', {
                cwd: testAppDir,
                stdio: 'inherit',
                env: {
                    PATH: process.env.PATH,
                    DB_HOST: container.getHost(),
                    DB_PORT: container.getPort(3306),
                    DB_USER: container.getUsername(),
                    DB_PASSWORD: container.getUserPassword(),
                },
            })
            t.pass('npm run build complete')
        } catch (err) {
            t.fail(err.message)
        }
        t.end()
    })

    suite.test('setup: start Next.js prod server (next start)', (t) => {
        const { spawn } = require('child_process')
        nextServerProcess = spawn(
            path.normalize('./node_modules/.bin/next'),
            ['start', '-H', '127.0.0.1'],
            {
                cwd: testAppDir,
                env: Object.assign({}, process.env, {
                    NODE_OPTIONS: '-r ../../../../../index.js',
                    NODE_ENV: 'production',
                    DB_HOST: container.getHost(),
                    DB_PORT: container.getPort(3306),
                    DB_USER: container.getUsername(),
                    DB_PASSWORD: container.getUserPassword(),
                    NEXT_TELEMETRY_DISABLED: '1',
                    PINPOINT_APPLICATION_NAME: 'next.js.test.js',
                }),
            }
        )
        nextServerProcess.on('error', (err) => {
            t.error(err, 'no error from next server')
        })
        nextServerProcess.stdout.on('data', (data) => {
            t.comment('next server stdout: ' + formatForTComment(data))
        })
        nextServerProcess.stderr.on('data', (data) => {
            t.comment('next server stderr: ' + formatForTComment(data))
        })

        waitForNextServerReady(nextServerProcess, (error) => {
            if (error) {
                t.fail(error.message)
                if (nextServerProcess) {
                    nextServerProcess.kill()
                }
            } else {
                t.pass('next server started')
            }
            t.end()
        })
    })
})

test('fetch http://127.0.0.1:3000/', async (t) => {
    try {
        const res = await fetch('http://127.0.0.1:3000/')
        t.equal(res.status, 200, '/ responds with 200')
    } catch (err) {
        t.fail(err.message)
    }
    t.end()
})

test('teardown', async (t) => {
    if (nextServerProcess) {
        nextServerProcess.kill()
    }
    await container.stop()
    t.pass('teardown complete')
    t.end()
})

function waitForNextServerReady(nextServerProcess, callback) {
    const timeout = setTimeout(() => {
        if (!serverReady) {
            callback?.(new Error('Server did not start'))
        }
    }, 10000)

    let serverReady = false
    nextServerProcess.stdout.on('data', (data) => {
        const output = formatForTComment(data)
        if (output.includes('Ready in')) {
            serverReady = true
            clearTimeout(timeout)
            callback?.()
        }
    })
}

// Match ANSI escapes (from https://stackoverflow.com/a/29497680/14444044).
const ANSI_RE =
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g /* eslint-disable-line no-control-regex */

/**
 * Format the given data for passing to t.comment().
 *
 * - t.comment() wipes leading whitespace. Prefix lines with '|' to avoid
 *   that, and to visually group a multi-line write.
 * - Drop ANSI escape characters, because those include control chars that
 *   are illegal in XML. When we convert TAP output to JUnit XML for
 *   Jenkins, then Jenkins complains about invalid XML. FORCE_COLOR=0
 *   can be used to disable ANSI escapes in next dev's usage of chalk,
 *   but not in its coloured exception output.
 */
function formatForTComment(data) {
    return (
        data
            .toString('utf8')
            .replace(ANSI_RE, '')
            .trimRight()
            .replace(/\r?\n/g, '\n|') + '\n'
    )
}