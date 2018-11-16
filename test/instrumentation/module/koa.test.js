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

test('Should create new trace by request', function(t) {
    t.plan(2)


    const app = startServer()
    const router = startRouter()

    const path = '/test'
    router.get(path, (ctx, next) => {
        ctx.body = 'hello'
    })

    app
        .use(router.routes())
        .use(router.allowedMethods())

    const server = app.listen(5006, async () => {
        await axios.get('http://localhost:5006/test')
        t.ok(agent.traceContext.getTraceObjectCount() > 0)
        t.ok(Array.from(agent.traceContext.traceObjectMap.values())
            .find(v => v.spanRecorder.span.rpc === path))
        server.close()
    })
})
