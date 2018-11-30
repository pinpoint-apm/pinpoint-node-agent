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
    t.plan(3)

    const app = startServer()
    const router = startRouter()

    const path = '/test'
    router.get(path, async (ctx, next) => {

        await axios.get('http://localhost:3000/users')

        ctx.body = 'test'
    })

    app
        .use(router.routes())
        .use(router.allowedMethods())

    /*
        TODO: pinpoint_agent을 쓰는 두 가지 모듈을 통신 테스트 하기 위해 만들어둠
        const app2 = startServer()
        const router2 = startRouter()
        const path2 = '/users'

        router2.get(path2, (ctx, next) => {
            setTimeout(()=>{console.log('TEST')}, 1000)
            ctx.body = 'hello2'
        })

        app2
            .use(router2.routes())
            .use(router2.allowedMethods())
        const server2 = app2.listen(5007, async () => {
        })

    */

    const server = app.listen(5006, async () => {

        // 내부
        await axios.get('http://localhost:5006' + path)
        const traceMap = agent.traceContext.getAllTraceObject()
        //
        t.ok(traceMap.size > 0)
        t.ok(Array.from(traceMap.values()).some(v => v.spanRecorder && v.spanRecorder.span.rpc === path))

        // 아예 외부
        // await axios.get('http://localhost:3000/users')
        t.ok(traceMap.size > 0)

        console.log(traceMap)
        // await axios.get('http://localhost:5007' + path2)

        server.close()
        //server2.close()
    })




})
