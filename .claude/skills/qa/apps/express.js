'use strict'

const express = require('express')
const calls = require('./calls')

const app = express()
const route = (path, call) => app.get(path, async (req, res) => {
    const { status, body } = await call(req.headers)
    res.status(status).json(body)
})

route('/ready', calls.ready)
route('/http-request-ok', calls.httpRequestOk)
route('/fetch-ok', calls.fetchOk)
route('/http-request-closed-port', calls.httpRequestClosedPort)
route('/fetch-closed-port', calls.fetchClosedPort)
route('/http-request-localhost-closed-port', calls.httpRequestLocalhostClosedPort)
route('/fetch-localhost-closed-port', calls.fetchLocalhostClosedPort)
app.get('/throw', () => {
    throw new Error('qa route throws')
})
route('/mysql2', calls.mysql2)
route('/mysql2-error', calls.mysql2Error)
route('/pg', calls.pg)
route('/pg-error', calls.pgError)
route('/redis', calls.redis)
route('/ioredis', calls.ioredis)
route('/mongodb', calls.mongodb)
route('/parallel', calls.parallel)
route('/fetch-after-await', calls.fetchAfterAwait)
route('/fetch-in-timer', calls.fetchInTimer)
app.get('/user-input-uri', (req, res) => {
    req['pinpoint.metric.uri-template'] = '/user/input/uri'
    res.json({ ok: true })
})
const admin = express()
admin.get('/users/:id', async (req, res) => {
    const { status, body } = await calls.fetchOk()
    res.status(status).json(body)
})
app.use('/admin', admin)
app.use('/middleware-await', async (req, res, next) => {
    await new Promise((resolve) => setTimeout(resolve, 10))
    await calls.fetchOk()
    next()
})
route('/middleware-await', () => ({ status: 200, body: { ok: true } }))
route('/downstream', calls.downstream)
app.get('/downstream-throw', () => {
    throw new Error('qa downstream throws')
})
route('/call-koa', () => calls.httpRequestApp('koa', '/downstream'))
route('/call-koa-throw', () => calls.httpRequestApp('koa', '/downstream-throw'))
route('/call-nextjs', () => calls.fetchApp('nextjs', '/downstream'))
route('/call-nextjs-throw', () => calls.fetchApp('nextjs', '/downstream-throw'))
route('/downstream-slow', calls.downstreamSlow)
route('/downstream-fetch-fail', calls.fetchClosedPort)
route('/downstream-databases', calls.downstreamDatabases)
app.get('/call-koa-then-throw', async (req, res, next) => {
    await calls.httpRequestApp('koa', '/downstream')
    next(new Error('qa caller throws after the call'))
})
route('/call-koa-fetch-fail', () => calls.httpRequestApp('koa', '/downstream-fetch-fail'))
route('/call-koa-abort', () => calls.httpRequestApp('koa', '/downstream-slow', calls.abortBeforeAnswer()))
route('/call-koa-databases', () => calls.httpRequestApp('koa', '/downstream-databases'))
app.get('/call-nextjs-then-throw', async (req, res, next) => {
    await calls.fetchApp('nextjs', '/downstream')
    next(new Error('qa caller throws after the call'))
})
route('/call-nextjs-fetch-fail', () => calls.fetchApp('nextjs', '/downstream-fetch-fail'))
route('/call-nextjs-abort', () => calls.fetchApp('nextjs', '/downstream-slow', calls.abortBeforeAnswer()))
route('/call-nextjs-databases', () => calls.fetchApp('nextjs', '/downstream-databases'))
route('/call-both', () => calls.both(calls.httpRequestApp('koa', '/downstream'), calls.fetchApp('nextjs', '/downstream')))
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message })
})

app.listen(Number(process.env.EXPRESS_PORT), '127.0.0.1')
