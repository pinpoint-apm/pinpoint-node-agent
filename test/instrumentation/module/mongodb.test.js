const Agent = require('agent')
const agent = new Agent({
    agentId: 'agent-for-dev',
    applicationName: 'test web application'
})

const Server = require('mongodb-core').Server

const test = require('tape')
const ServiceTypeCode = require('constant/service-type').ServiceTypeCode

test('instrument simple command', function(t) {
    t.plan(8)

    const server = new Server({
        host: 'localhost'
        , port: 27017
        , reconnect: true
        , reconnectInterval: 50
    })

    server.on('connect', function(_server) {
        console.log('connected');
        const trace = agent.createTraceObject(null)
        const spanEventRecorder = trace.traceBlockBegin()
        spanEventRecorder.recordServiceType(ServiceTypeCode.mongodb)

        _server.command('system.$cmd', {ismaster: true}, function (err, result) {
            _server.insert('myproject.inserts1', [{a: 1}, {a: 2}], {
                writeConcern: {w: 1}, ordered: true
            }, function (err, results) {
                t.equal(null, err)
                t.equal(2, results.result.n)

                _server.update('myproject.inserts1', [{
                    q: {a: 1}, u: {'$set': {b: 1}}
                }], {
                    writeConcern: {w: 1}, ordered: true
                }, function (err, results) {
                    t.equal(null, err)
                    t.equal(1, results.result.n)

                    _server.remove('myproject.inserts1', [{
                        q: {a: 1}, limit: 1
                    }], {
                        writeConcern: {w: 1}, ordered: true
                    }, function (err, results) {
                        t.equal(null, err)
                        t.equal(1, results.result.n)

                        const cursor = _server.cursor('integration_tests.inserts_example4', {
                            find: 'integration_tests.example4'
                            , query: {a: 1}
                        })

                        // Get the first document
                        cursor.next(function (err, doc) {
                            t.equal(null, err)

                            // Execute the ismaster command
                            _server.command("system.$cmd"
                                , {ismaster: true}, function (err, result) {
                                    t.equal(null, err)
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
