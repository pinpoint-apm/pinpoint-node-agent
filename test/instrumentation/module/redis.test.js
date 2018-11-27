const Agent = require('agent')
const agent = new Agent({
    agentId: 'agent-for-dev',
    applicationName: 'test web application'
})

const redis = require('redis')
const test = require('tape')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

test('Should create new trace by redis', function(t) {
    t.plan(1)

    resetAgent(function (endpoint, headers, data, cb) {
        const groups = [
            'FLUSHALL',
            'SET',
            'SET',
            'HSET',
            'HSET',
            'HKEYS'
        ]

        t.equal(data.transactions.length, 1)

        const trans = data.transactions[0]

        t.equal(trans.name, 'foo')
        t.equal(trans.type, 'bar')
        t.equal(trans.result, 'success')

        t.equal(trans.spans.length, groups.length)

        groups.forEach(function (name, i) {
            t.equal(trans.spans[i].name, name)
            t.equal(trans.spans[i].type, 'cache.redis')
            t.ok(trans.spans[i].start + trans.spans[i].duration < trans.duration)
        })

        t.end()
    })

    const client = redis.createClient('6379', process.env.REDIS_HOST)
    const trace = agent.createTraceObject(null)
    const spanEventRecorder = trace.traceBlockBegin()

    spanEventRecorder.recordServiceType(ServiceTypeCode.redis)

    client.flushall(function (err, reply) {
        t.error(err)
        t.equal(reply, 'OK')
        let done = 0

        client.set('string key', 'string val', function (err, reply) {
            t.error(err)
            t.equal(reply, 'OK')
            done++
        })

        // callback is optional
        client.set('string key', 'string val')

        client.hset('hash key', 'hashtest 1', 'some value', function (err, reply) {
            t.error(err)
            t.equal(reply, 1)
            done++
        })
        client.hset(['hash key', 'hashtest 2', 'some other value'], function (err, reply) {
            t.error(err)
            t.equal(reply, 1)
            done++
        })

        client.hkeys('hash key', function (err, replies) {
            t.error(err)
            t.equal(replies.length, 2)

            replies.forEach(function (reply, i) {
                t.equal(reply, 'hashtest ' + (i + 1))
            })
            t.equal(done, 3)

            agent.completeTraceObject();

            client.quit()
            agent.flush()
        })
    })
})


function resetAgent (cb) {
}
