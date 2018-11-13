const Agent = require('agent')
const agent = new Agent({
    agentId: 'agent-for-dev',
    applicationName: 'test web application'
})

const test = require('tape')
const axios = require('axios')

function startServer() {
    const koa = require('koa')
    return new koa()
}

function startRouter() {
    const Router = require('koa-router')
    return new Router()
}

test('Should create a context', function(t) {
    t.plan(1)

    const app = startServer()
    const router = startRouter()

    router.get('/test', (ctx, next) => {
        ctx.body = 'hello'
    })

    app
        .use(router.routes())
        .use(router.allowedMethods())


    const server = app.listen(5006, async () => {
        await axios.get('http://localhost:5006/test')
        t.equal(agent.traceContext.getTraceObjectCount(), 1)
        server.close()
    })
})
