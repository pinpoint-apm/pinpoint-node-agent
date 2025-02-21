/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')
const agent = require('../support/agent-singleton-mock')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const dataConvertor = require('../../lib/data/grpc-data-convertor')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const { log } = require('../test-helper')
var _ = require('lodash')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const spanMessages = require('../../lib/data/v1/Span_pb')
const CallArgumentsBuilder = require('../../lib/client/call-arguments-builder')

let statClient
let endAction
let serverT
const agentStartTime = Date.now()
let callWriteOrder = 0
let call
let callCount = 5
let dataCount = 0

function sendAgentStat(call, callback) {
    call.on('data', function (statMessage) {
        dataCount++

        if (statMessage) {
            const agentStat = statMessage.getAgentstat()
            serverT.equal(agentStat.getCollectinterval(), 1000, 'agentStat.getCollectinterval(), 1000 in server call.on("data")')

            const memory = agentStat.getGc()
            serverT.true(memory.getJvmmemoryheapused() >= 0, `index: ${memory.getJvmmemoryheapused()} equlity jvm memory heap used in server call.on("data")`)
        }
    })
    call.on('error', function (error) {
        serverT.true(false, 'when dealine, gRPC should never error in server call.on("error")')
        log.debug(`error: ${error}`)
    })
    call.on('end', function () {
        serverT.true(dataCount > 0, `dataCount: ${dataCount} matches datacount and callWirteOrder in server call.on('end')`)
        callback(null, new Empty())
    })
}

function createStatCall(t) {
    const deadline = new Date()
    deadline.setMilliseconds(deadline.getMilliseconds() + 100)
    return statClient.sendAgentStat({ deadline: deadline }, (err, response) => {
        if (err) {
            log.error(`statStream callback err: ${err} in statClient.sendAgentStat callback`)
            // t.equal(err.code, grpc.status.DEADLINE_EXCEEDED, `error code grpc.status.DEADLINE_EXCEEDED in statClient.sendAgentStat callback`)
        }

        if (response) {
            t.equal(callWriteOrder, callCount, 'call count compare in statClient.sendAgentStat callback')
            t.true(response, 'response is true in statClient.sendAgentStat callback')
        }

        setTimeout(() => {
            endAction()
        }, 0)
    })
}

function callStat(t) {
    call = createStatCall(t)
    call.on('error', (error) => {
        log.error(error)
    })

    for (let index = 0; index < callCount; index++) {
        _.delay(function () {
            const pStatMessage = dataConvertor.convertStat({
                agentId: '1212121212',
                agentStartTime: agentStartTime,
                timestamp: Date.now(),
                collectInterval: 1000,
                memory: {
                    heapUsed: index
                },
                cpu: {
                    user: 0,
                    system: 0
                }
            })
            call.write(pStatMessage, () => {
                t.true(index >= 0, `index: ${index} call.write in call.write callback `)
                callWriteOrder++
            })
        }, _.random(10, 150))
    }
}

test('client side streaming with deadline', function (t) {
    const server = new grpc.Server()
    server.addService(services.StatService, {
        sendAgentStat: sendAgentStat
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const headerInterceptor = function (options, nextCall) {
            return new grpc.InterceptingCall(nextCall(options), {
                start: function (metadata, listener, next) {
                    metadata.add('agentid', '1212121212')
                    metadata.add('applicationname', 'test')
                    metadata.add('starttime', String(agentStartTime))
                    next(metadata, listener, next)
                },
            })
        }
        statClient = new services.StatClient('localhost' + ":" + port, grpc.credentials.createInsecure(), { interceptors: [headerInterceptor] })

        serverT = t
        callStat(t)

        endAction = () => {
            call.end()
            server.tryShutdown((error) => {
                t.false(error, 'error is null in server.tryShutdown')
                t.end()
            })
        }
    })
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendAgentInfo deadline and metadata', (t) => {
    agent.bindHttp({ 'agent-name': 'testAgentName' })
    const server = new grpc.Server()
    let agentInfo = 0
    server.addService(services.AgentService, {
        // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
        requestAgentInfo: (call, callback) => {
            agentInfo++

            t.equal(call.metadata.get('agentid')[0], 'node.test.app', 'call.metadata.get("agentid")[0] is node.test.app')
            t.equal(call.metadata.get('applicationname')[0], 'test.application.name', 'call.metadata.get("applicationname")[0] is test.application.name')
            t.equal(call.metadata.get('agentName')[0], 'testAgentName', 'call.metadata.get("agentName")[0] is testAgentName')

            const result = new spanMessages.PResult()
            if (agentInfo == 1) {
                callback(null, result)
            } else if (agentInfo == 2) {
                _.delay(() => {
                    callback(null, result)
                }, 100)
            }
        }
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const grpcDataSender = new GrpcDataSender('localhost', port, port, port, agent.getAgentInfo())

        grpcDataSender.sendAgentInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, (err, response) => {
            t.true(response, '1st sendAgentInfo response is success')
            t.false(err, '1st sendAgentInfo err is false')
        })

        const callArguments = new CallArgumentsBuilder((err, response) => {
            t.false(response, '2st sendAgentInfo response is undefined')
            t.equal(err.code, 4, '2st sendAgentInfo err.code is 4')
            t.true(err.details.startsWith('Deadline exceeded'), '2st sendAgentInfo err.details is Deadline exceeded')
            t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendAgentInfo err.message is Deadline exceeded')

            t.end()
        }).setDeadlineMilliseconds(100).build()

        grpcDataSender.sendAgentInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, callArguments)

        t.teardown(() => {
            grpcDataSender.close()
            server.forceShutdown()
        })
    })
})

test('sendAgentInfo deadline and no agent name metadata', (t) => {
    agent.bindHttp()
    const server = new grpc.Server()
    let agentInfo = 0
    server.addService(services.AgentService, {
        // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
        requestAgentInfo: (call, callback) => {
            agentInfo++

            t.equal(call.metadata.get('agentid')[0], 'node.test.app', 'call.metadata.get("agentid")[0] is node.test.app')
            t.equal(call.metadata.get('applicationname')[0], 'test.application.name', 'call.metadata.get("applicationname")[0] is test.application.name')
            t.equal(call.metadata.get('agentName')[0], undefined, 'call.metadata.get("agentName")[0] is undefined')

            const result = new spanMessages.PResult()
            if (agentInfo == 1) {
                callback(null, result)
            } else if (agentInfo == 2) {
                _.delay(() => {
                    callback(null, result)
                }, 100)
            }
        }
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const grpcDataSender = new GrpcDataSender('localhost', port, port, port, agent.getAgentInfo())

        grpcDataSender.sendAgentInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, (err, response) => {
            t.true(response, '1st sendAgentInfo response is success')
            t.false(err, '1st sendAgentInfo err is false')
        })

        const callArguments = new CallArgumentsBuilder((err, response) => {
            t.false(response, '2st sendAgentInfo response is undefined')
            t.equal(err.code, 4, '2st sendAgentInfo err.code is 4')
            t.true(err.details.startsWith('Deadline exceeded'), '2st sendAgentInfo err.details is Deadline exceeded')
            t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendAgentInfo err.message is Deadline exceeded')

            t.end()
        }).setDeadlineMilliseconds(100).build()

        grpcDataSender.sendAgentInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, callArguments)

        t.teardown(() => {
            grpcDataSender.close()
            server.forceShutdown()
        })
    })
})

let apiMetaInfo = 0
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestApiMetaData(call, callback) {
    apiMetaInfo++

    const result = new spanMessages.PResult()

    if (apiMetaInfo == 1) {
        callback(null, result)
    } else if (apiMetaInfo == 2) {
        _.delay(() => {
            callback(null, result)
        }, 100)
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendApiMetaInfo deadline', (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestApiMetaData: requestApiMetaData
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const grpcDataSender = new GrpcDataSender('localhost', port, port, port, agent.getAgentInfo())

        let apiMetaInfoResponse = 0

        grpcDataSender.sendApiMetaInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, (err, response) => {
            t.true(response, '1st sendApiMetaInfo response is success')
            t.false(err, '1st sendApiMetaInfo err is false')

            apiMetaInfoResponse++
            if (apiMetaInfoResponse == 2) {
                t.end()
            }
        })

        const callArguments = new CallArgumentsBuilder((err, response) => {
            t.false(response, '2st sendApiMetaInfo response is undefined')
            t.equal(err.code, 4, '2st sendApiMetaInfo err.code is 4')
            t.true(err.details.startsWith('Deadline exceeded'), '2st sendApiMetaInfo err.details is Deadline exceeded')
            t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendApiMetaInfo err.message is Deadline exceeded')

            apiMetaInfoResponse++
            if (apiMetaInfoResponse == 2) {
                t.end()
            }
        }).setDeadlineMilliseconds(100).build()

        grpcDataSender.sendApiMetaInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, callArguments)

        t.teardown(() => {
            grpcDataSender.close()
            server.forceShutdown()
        })
    })
})

let stringMetaInfo = 0
// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestStringMetaData(call, callback) {
    stringMetaInfo++

    const result = new spanMessages.PResult()

    if (stringMetaInfo == 1) {
        callback(null, result)
    } else if (stringMetaInfo == 2) {
        _.delay(() => {
            callback(null, result)
        }, 100)
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendStringMetaInfo deadline', (t) => {
    const server = new grpc.Server()
    server.addService(services.MetadataService, {
        requestStringMetaData: requestStringMetaData
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        const grpcDataSender = new GrpcDataSender('localhost', port, port, port, agent.getAgentInfo())
        let stringMetaDataResponse = 0

        grpcDataSender.sendStringMetaInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, (err, response) => {
            t.true(response, '1st sendStringMetaInfo response is success')
            t.false(err, '1st sendStringMetaInfo err is false')

            stringMetaDataResponse++
            if (stringMetaDataResponse == 2) {
                t.end()
            }
        })

        const callArguments = new CallArgumentsBuilder((err, response) => {
            t.false(response, '2st sendStringMetaInfo response is undefined')
            t.equal(err.code, 4, '2st sendStringMetaInfo err.code is 4')
            t.true(err.details.startsWith('Deadline exceeded'), '2st sendStringMetaInfo err.details is Deadline exceeded')
            t.true(err.message.startsWith('4 DEADLINE_EXCEEDED: Deadline exceeded'), '2st sendStringMetaInfo err.message is Deadline exceeded')

            stringMetaDataResponse++
            if (stringMetaDataResponse == 2) {
                t.end()
            }
        }).setDeadlineMilliseconds(100).build()
        grpcDataSender.sendStringMetaInfo({
            hostname: 'hostname',
            "serviceType": 1400,
        }, callArguments)

        t.teardown(() => {
            grpcDataSender.close()
            server.forceShutdown()
        })
    })
})