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
route('/http-request-localhost-closed-port', calls.httpRequestLocalhostClosedPort)
route('/fetch-localhost-closed-port', calls.fetchLocalhostClosedPort)
router.get('/throw', () => {
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
router.get('/user-input-uri', (ctx) => {
    ctx.req['pinpoint.metric.uri-template'] = '/user/input/uri'
    ctx.body = { ok: true }
})
const v2 = new Router()
v2.get('/v2/users/:id', async (ctx) => {
    const { status, body } = await calls.fetchOk()
    ctx.status = status
    ctx.body = body
})
const v2Routes = v2.routes()
router.get('/v2/(.*)', (ctx, next) => v2Routes(ctx, next))
route('/downstream', calls.downstream)
router.get('/downstream-throw', () => {
    throw new Error('qa downstream throws')
})
route('/call-nextjs', () => calls.httpRequestApp('nextjs', '/downstream'))
route('/call-nextjs-throw', () => calls.httpRequestApp('nextjs', '/downstream-throw'))
route('/call-express', () => calls.fetchApp('express', '/downstream'))
route('/call-express-throw', () => calls.fetchApp('express', '/downstream-throw'))
route('/downstream-slow', calls.downstreamSlow)
route('/downstream-fetch-fail', calls.fetchClosedPort)
route('/downstream-databases', calls.downstreamDatabases)
router.get('/call-nextjs-then-throw', async () => {
    await calls.httpRequestApp('nextjs', '/downstream')
    throw new Error('qa caller throws after the call')
})
route('/call-nextjs-fetch-fail', () => calls.httpRequestApp('nextjs', '/downstream-fetch-fail'))
route('/call-nextjs-abort', () => calls.httpRequestApp('nextjs', '/downstream-slow', calls.abortBeforeAnswer()))
route('/call-nextjs-databases', () => calls.httpRequestApp('nextjs', '/downstream-databases'))
router.get('/call-express-then-throw', async () => {
    await calls.fetchApp('express', '/downstream')
    throw new Error('qa caller throws after the call')
})
route('/call-express-fetch-fail', () => calls.fetchApp('express', '/downstream-fetch-fail'))
route('/call-express-abort', () => calls.fetchApp('express', '/downstream-slow', calls.abortBeforeAnswer()))
route('/call-express-databases', () => calls.fetchApp('express', '/downstream-databases'))
route('/call-both', () => calls.both(calls.httpRequestApp('nextjs', '/downstream'), calls.fetchApp('express', '/downstream')))
app.use(router.routes())

app.listen(Number(process.env.KOA_PORT), '127.0.0.1')
