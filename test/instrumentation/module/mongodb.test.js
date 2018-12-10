const test = require('tape')
const { log, fixture, util, enableDataSending } = require('../../test-helper')
enableDataSending()

const Agent = require('agent')
const agent = new Agent({
    agentId: 'agent-for-dev',
    applicationName: 'test web application'
})

const Server = require('mongodb-core').Server

const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

test('instrument simple command', function(t) {
    t.plan(10)

    const server = new Server({
        host: 'localhost'
        , port: 27017
        , reconnect: true
        , reconnectInterval: 50
    })

    server.on('connect', function(_server) {
        log.debug('connected');
        const trace = agent.createTraceObject(null)
        const spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)

        _server.command('system.$cmd', {ismaster: true}, function (err, result) {
            t.error(err)
            t.equal(result.result.ismaster, true)

            _server.insert('myproject.inserts1', [{a: 1}, {a: 2}], {writeConcern: {w: 1}, ordered: true }, function (err, results) {
                t.equal(null, err)
                t.equal(2, results.result.n)

                _server.update('myproject.inserts1', [{q: {a: 1}, u: {'$set': {b: 1}}}], {writeConcern: {w: 1}, ordered: true}, function (err, results) {
                    t.equal(null, err)
                    t.equal(1, results.result.n)

                    _server.remove('myproject.inserts1', [{q: {a: 1}, limit: 1}], {writeConcern: {w: 1}, ordered: true}, function (err, results) {
                        t.equal(null, err)
                        t.equal(1, results.result.n)

                        const cursor = _server.cursor('integration_tests.inserts_example4', {find: 'integration_tests.example4', query: {a: 1}})

                        cursor.next(function (err, doc) {
                            t.equal(null, err)
                            // t.equal(doc.a, 2)

                            _server.command("system.$cmd", {ismaster: true}, function (err, result) {
                                t.equal(null, err)
                                agent.completeTraceObject()
                                _server.destroy()
                            })
                        })
                    })
                })
            })
        })
    })
    server.connect()
})
