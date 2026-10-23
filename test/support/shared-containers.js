/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const path = require('path')
const test = require('tape')
const { Wait } = require('testcontainers')
const { MySqlContainer } = require('@testcontainers/mysql')
const { PostgreSqlContainer } = require('@testcontainers/postgresql')
const { RedisContainer } = require('@testcontainers/redis')
const { MongoDBContainer } = require('@testcontainers/mongodb')

const fixtures = path.resolve(__dirname, '..', 'fixtures', 'db')

// Each image starts once per process, on first use, and stops when tape finishes.
// Every call resets the data, so a test sees the fixture state whatever ran before it.
async function startMySql() {
    const container = await startOnce('mysql', () => new MySqlContainer('mysql:8.0.31')
        .withCommand(['--default-authentication-plugin=mysql_native_password'])
        .withEnvironment({
            'MYSQL_DATABASE': 'test',
            'TZ': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: path.resolve(fixtures, 'mysql.sql'),
            target: '/docker-entrypoint-initdb.d/mysql.sql'
        }])
        .start())
    await execOrThrow(container, ['mysql', '-uroot', `-p${container.getRootPassword()}`, 'test', '-e', 'DROP TABLE IF EXISTS member;\nsource /docker-entrypoint-initdb.d/mysql.sql'])
    return container
}

async function startPostgreSql() {
    const container = await startOnce('postgresql', () => new PostgreSqlContainer('postgres:13')
        .withDatabase('test')
        .withUsername('testuser')
        .withPassword('testpass')
        .withEnvironment({
            'TZ': 'Asia/Seoul',
        })
        .withCopyFilesToContainer([{
            source: path.resolve(fixtures, 'postgresql.sql'),
            target: '/docker-entrypoint-initdb.d/postgresql.sql'
        }])
        .start())
    await execOrThrow(container, ['psql', '-v', 'ON_ERROR_STOP=1', '-U', 'testuser', '-d', 'test', '-c', 'DROP TABLE IF EXISTS member', '-f', '/docker-entrypoint-initdb.d/postgresql.sql'])
    return container
}

async function startRedis() {
    const container = await startOnce('redis', () => new RedisContainer('redis:7.2')
        .withWaitStrategy(Wait.forAll([
            Wait.forListeningPorts(),
            Wait.forLogMessage('Ready to accept connections')
        ]))
        .start())
    await execOrThrow(container, ['redis-cli', 'FLUSHDB'])
    return container
}

async function startMongoDB() {
    const container = await startOnce('mongodb', () => new MongoDBContainer('mongo:6.0.1').start())
    await execOrThrow(container, ['mongosh', '--quiet', '--eval', `db.getSiblingDB('test1').dropDatabase()`])
    return container
}

const startedContainers = new Map()
function startOnce(name, start) {
    if (startedContainers.size === 0) {
        test.onFinish(stopAll)
    }
    if (!startedContainers.has(name)) {
        startedContainers.set(name, start())
    }
    return startedContainers.get(name)
}

async function stopAll() {
    const containers = await Promise.allSettled(startedContainers.values())
    startedContainers.clear()
    await Promise.allSettled(containers
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value.stop()))
}

async function execOrThrow(container, command) {
    const result = await container.exec(command)
    if (result.exitCode !== 0) {
        throw new Error(`${command[0]} exited with ${result.exitCode}: ${result.output}`)
    }
}

module.exports = {
    startMySql,
    startPostgreSql,
    startRedis,
    startMongoDB,
}
