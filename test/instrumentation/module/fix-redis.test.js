const test = require('tape')
const agent = require('../../support/agent-singleton-mock')

test(`redis destination id`, (t) => {
    agent.bindHttp()

    t.plan(1)

    const redis = require('redis-mock')
    const client = redis.createClient()

    client.on("error", function (error) {
        console.error(error);
    })

    client.set("key", "value", redis.print)
    client.get("key", redis.print)
})