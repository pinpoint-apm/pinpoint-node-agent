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
route('/downstream', calls.downstream)
app.get('/downstream-throw', () => {
    throw new Error('qa downstream throws')
})
route('/call-koa', () => calls.httpRequestApp('koa', '/downstream'))
route('/call-koa-throw', () => calls.httpRequestApp('koa', '/downstream-throw'))
route('/call-nextjs', () => calls.fetchApp('nextjs', '/downstream'))
route('/call-nextjs-throw', () => calls.fetchApp('nextjs', '/downstream-throw'))
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message })
})

app.listen(Number(process.env.EXPRESS_PORT), '127.0.0.1')
