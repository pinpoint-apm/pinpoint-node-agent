'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const calls = require('./calls')

const app = new Koa()
const router = new Router()
const route = (path, call) => router.get(path, async (ctx) => {
    const { status, body } = await call(ctx.headers)
    ctx.status = status
    ctx.body = body
})

route('/ready', calls.ready)
route('/http-request-ok', calls.httpRequestOk)
route('/fetch-ok', calls.fetchOk)
route('/http-request-closed-port', calls.httpRequestClosedPort)
route('/fetch-closed-port', calls.fetchClosedPort)
router.get('/throw', () => {
    throw new Error('qa route throws')
})
route('/mysql2', calls.mysql2)
route('/mysql2-error', calls.mysql2Error)
route('/pg', calls.pg)
route('/redis', calls.redis)
route('/ioredis', calls.ioredis)
route('/mongodb', calls.mongodb)
route('/parallel', calls.parallel)
route('/downstream', calls.downstream)
router.get('/downstream-throw', () => {
    throw new Error('qa downstream throws')
})
route('/call-nextjs', () => calls.httpRequestApp('nextjs', '/downstream'))
route('/call-nextjs-throw', () => calls.httpRequestApp('nextjs', '/downstream-throw'))
route('/call-express', () => calls.fetchApp('express', '/downstream'))
route('/call-express-throw', () => calls.fetchApp('express', '/downstream-throw'))
app.use(router.routes())

app.listen(Number(process.env.KOA_PORT), '127.0.0.1')
