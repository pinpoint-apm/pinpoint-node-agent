'use strict'

// The calls the QA routes make. Each returns { status, body } for the route to send as JSON.
const http = require('http')

const target = () => `http://127.0.0.1:${process.env.TARGET_PORT}/`
const closedPort = () => `http://127.0.0.1:${process.env.CLOSED_PORT}/`
const localhostClosedPort = () => `http://localhost:${process.env.CLOSED_PORT}/`
const appUrls = {
    express: () => `http://127.0.0.1:${process.env.EXPRESS_PORT}`,
    koa: () => `http://127.0.0.1:${process.env.KOA_PORT}`,
    nextjs: () => `http://127.0.0.1:${process.env.NEXTJS_PORT}/api`,
}

let databases

module.exports = {
    ready: async () => {
        databases ??= await connectDatabases()
        return { status: 200, body: { ready: true } }
    },
    httpRequestOk: () => httpRequest(target()),
    fetchOk: () => fetchUrl(target()),
    httpRequestClosedPort: () => httpRequest(closedPort()),
    fetchClosedPort: () => fetchUrl(closedPort()),
    httpRequestLocalhostClosedPort: () => httpRequest(localhostClosedPort()),
    fetchLocalhostClosedPort: () => fetchUrl(localhostClosedPort()),
    mysql2: () => query(() => databases.mysql2.query('SELECT id, name FROM member WHERE id = ?', ['a'])),
    mysql2Error: () => query(() => databases.mysql2.query('SELECT id FROM no_such_table')),
    pg: () => query(() => databases.pg.query('SELECT id, name FROM member WHERE id = $1', ['a'])),
    pgError: () => query(() => databases.pg.query('SELECT id FROM no_such_table')),
    redis: () => query(() => new Promise((resolve, reject) => databases.redis.set('qa-redis', 'value', (error) => error ? reject(error) : resolve()))),
    ioredis: () => query(() => databases.ioredis.set('qa-ioredis', 'value')),
    mongodb: () => query(() => databases.mongodb.db('test').collection('member').findOne({ id: 'a' })),
    fetchAfterAwait: async () => {
        const first = await fetchUrl(target())
        const second = await fetchUrl(target())
        const third = await fetchUrl(target())
        return { status: 200, body: { outgoing: [first.status, second.status, third.status] } }
    },
    fetchInTimer: () => new Promise((resolve) => setTimeout(async () => {
        const outgoing = await fetchUrl(target())
        resolve({ status: 200, body: { outgoing: outgoing.status } })
    }, 10)),
    parallel: async () => {
        const [outgoing, mysql2] = await Promise.all([fetchUrl(target()), module.exports.mysql2()])
        return { status: 200, body: { outgoing: outgoing.status, mysql2: mysql2.status } }
    },
    downstream: (headers) => ({ status: 200, body: { pinpointHeaders: pinpointHeaders(headers) } }),
    httpRequestApp: (app, path) => httpRequest(appUrls[app]() + path),
    fetchApp: (app, path) => fetchUrl(appUrls[app]() + path),
}

async function connectDatabases() {
    const mysql2 = require('mysql2/promise').createPool(process.env.QA_MYSQL_URL)
    const pg = new (require('pg').Pool)({ connectionString: process.env.QA_PG_URL })
    const redis = require('redis').createClient(process.env.QA_REDIS_URL)
    const ioredis = new (require('ioredis'))(process.env.QA_REDIS_URL)
    const mongodb = await new (require('mongodb').MongoClient)(process.env.QA_MONGODB_URL, { directConnection: true }).connect()
    await Promise.all([mysql2.query('SELECT 1'), pg.query('SELECT 1')])
    return { mysql2, pg, redis, ioredis, mongodb }
}

function httpRequest(url) {
    return new Promise((resolve) => {
        http.request(url, (res) => {
            let body = ''
            res.setEncoding('utf8')
            res.on('data', (chunk) => body += chunk)
            res.on('end', () => resolve({ status: res.statusCode, body: parse(body) }))
        })
            .on('error', (error) => resolve({ status: 502, body: { code: error.code } }))
            .end()
    })
}

async function fetchUrl(url) {
    try {
        const res = await fetch(url)
        return { status: res.status, body: parse(await res.text()) }
    } catch (error) {
        return { status: 502, body: { code: error.cause?.code } }
    }
}

async function query(call) {
    try {
        await call()
        return { status: 200, body: { query: 'ok' } }
    } catch (error) {
        return { status: 500, body: { message: error.message } }
    }
}

function pinpointHeaders(headers) {
    return Object.fromEntries(Object.entries(headers).filter(([name]) => name.startsWith('pinpoint-')))
}

function parse(body) {
    try {
        return JSON.parse(body)
    } catch {
        return body
    }
}
