const Agent = require('agent')
const agent = new Agent({
    agentId: 'agent-for-dev',
    applicationName: 'test web application'
})

const test = require('tap').test
const axios = require('axios')

function startServer() {
    const koa = require('koa')
    return new koa()
}

test('Should create a context', function(t) {

})
