/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const services = require('../../lib/data/v1/Service_grpc_pb')

var _ = require('lodash')
const grpc = require('@grpc/grpc-js')
const GrpcServer = require('./grpc-server')
const spanMessages = require('../../lib/data/v1/Span_pb')
const dataSenderFactory = require('../../lib/client/data-sender-factory')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const DataSender = require('../../lib/client/data-sender')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const MethodDescriptorBuilder = require('../../lib/context/method-descriptor-builder')

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
const requestAgentInfo = function requestAgentInfo(call, callback) {
    const succeedOnRetryAttempt = call.metadata.get('succeed-on-retry-attempt')
    const previousAttempts = call.metadata.get('grpc-previous-rpc-attempts')
    const delayTime = call.metadata.get('delay-time')

    console.log('succeed-on-retry-attempt', succeedOnRetryAttempt)
    console.log('grpc-previous-rpc-attempts', previousAttempts)
    console.log('delay-time', delayTime)

    if (succeedOnRetryAttempt.length === 0 || (previousAttempts.length === 0 && previousAttempts[0] === succeedOnRetryAttempt[0])) {
        const result = new spanMessages.PResult()
        result.setSuccess(true)
        result.setMessage(`succeed-on-retry-attempt: ${succeedOnRetryAttempt[0]}, grpc-previous-rpc-attempts: ${previousAttempts[0]}, delay-time: ${delayTime[0]}`)
        callback(null, result)
        // _.delay(() => {
        // }, parseInt(delayTime[0] || 0))
    } else {
        const statusCode = call.metadata.get('respond-with-status')
        const code = statusCode[0] ? Number.parseInt(statusCode[0]) : grpc.status.UNKNOWN
        callback({ code: code, details: `Failed on retry ${previousAttempts[0] ?? 0}`})
    }
}

function agentInfo() {
    return Object.assign(new AgentInfo({
        agentId: '12121212',
        applicationName: 'applicationName',
        agentStartTime: Date.now()
    }), {
        ip: '1'
    })
}

function before(port) {
    const dataSender = dataSenderFactory.create({
        collectorIp: 'localhost',
        collectorTcpPort: port,
        collectorStatPort: port,
        collectorSpanPort: port,
        enabledDataSending: true
    }, agentInfo())
    return dataSender
}

let tryShutdown
test('sendAgentInfo refresh', (t) => {
    const server = new grpc.Server()
    // https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
    server.addService(services.AgentService, {
        requestAgentInfo: requestAgentInfo
    })
    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        dataSender = before(port)

        dataSender.dataSender.sendAgentInfo(agentInfo(), function(error, response) {
            if (error) {
                t.fail(error)
            }
            t.true(response.getSuccess(), '1st PResult.success is true')
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined, delay-time: undefined', '1st PResult.message is "succeed-on-retry-attempt: 0, grpc-previous-rpc-attempts: 0, delay-time: 0"')
        })
        
        const origin = dataSender.dataSender.deadline.getDeadline
        // dataSender.dataSender.deadline.getDeadline = () => {
        //     const deadline = new Date()
        //     deadline.setMilliseconds(deadline.getMilliseconds() + 100)
        //     return deadline
        // }
        // const metadata = new grpc.Metadata()
        // metadata.set('succeed-on-retry-attempt', '1')
        dataSender.dataSender.sendAgentInfo(agentInfo(), function(error) {
            if (error) {
                t.fail(error)
            }
        })
        dataSender.dataSender.deadline.getDeadline = origin

        dataSender.dataSender.sendAgentInfo(agentInfo(), function(error, response) {
            if (error) {
                t.fail(error)
            }
            t.true(response.getSuccess(), '3st PResult.success is true')
            t.equal(response.getMessage(), 'succeed-on-retry-attempt: undefined, grpc-previous-rpc-attempts: undefined, delay-time: undefined', '3st PResult.message is "succeed-on-retry-attempt: 0, grpc-previous-rpc-attempts: 0, delay-time: 0"')
            t.end()
        })
    })

    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
    // server.startup((port) => {
    //     const agentInfo1 = Object.assign(new AgentInfo({
    //         agentId: '12121212',
    //         applicationName: 'applicationName',
    //         agentStartTime: Date.now()
    //     }), {
    //         ip: '1'
    //     })

    //     const create = (config, agentInfo) => {
    //         return new DataSender(config, new MockGrpcDataSender(
    //             config.collectorIp,
    //             config.collectorTcpPort,
    //             config.collectorStatPort,
    //             config.collectorSpanPort,
    //             agentInfo
    //         ))
    //     }

    //     this.dataSender = create({
    //         collectorIp: 'localhost',
    //         collectorTcpPort: port,
    //         collectorStatPort: port,
    //         collectorSpanPort: port,
    //         enabledDataSending: true
    //     }, agentInfo1)

    //     this.dataSender.dataSender.deadline.getDeadline = () => {
    //         const deadline = new Date()
    //         deadline.setMilliseconds(deadline.getMilliseconds() + 100)
    //         return deadline
    //     }

    //     let callbackTimes = 0
    //     const callback = (err, response) => {
    //         callbackTimes++
    //         t.true(err, 'retry 3 times and err deadline')
    //         t.equal(callbackTimes, 1, 'callback only once called')
    //         t.false(response, 'retry response is undefined')
    //         t.equal(requestTimes, 3, 'retry requestes 3 times')

    //         tryShutdown()
    //         this.dataSender.dataSender.agentInfoDailyScheduler.stop()
    //     }
    //     const origin = this.dataSender.dataSender.requestAgentInfo.request
    //     let requestTimes = 0
    //     this.dataSender.dataSender.requestAgentInfo.request = (data, _, timesOfRetry = 1) => {
    //         requestTimes++
    //         origin.call(this.dataSender.dataSender.requestAgentInfo, data, callback, timesOfRetry)
    //     }
    //     this.dataSender.send(agentInfo1)

    //     tryShutdown = () => {
    //         setTimeout(() => {
    //             server.tryShutdown(() => {
    //                 t.end()
    //             })
    //         }, 0)
    //     }
    // })
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestApiMetaData(call, callback) {
    const result = new spanMessages.PResult()

    _.delay(() => {
        callback(null, result)
    }, 100)
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test.skip('sendApiMetaInfo retry', (t) => {
    const server = new GrpcServer()
    server.addService(services.MetadataService, {
        requestApiMetaData: requestApiMetaData
    })
    server.startup((port) => {
        const agentInfo = Object.assign(new AgentInfo({
            agentId: '12121212',
            applicationName: 'applicationName',
            agentStartTime: Date.now()
        }), {
            ip: '1'
        })
        const apiMetaInfo = new ApiMetaInfo({
            agentId: '12121212',
            apiInfo: agentInfo,
            type: 1400
        })

        this.dataSender = dataSenderFactory.create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, agentInfo)

        this.dataSender.dataSender.requestApiMetaData.getDeadline = () => {
            const deadline = new Date()
            deadline.setMilliseconds(deadline.getMilliseconds() + 100)
            return deadline
        }
        this.dataSender.dataSender.requestApiMetaData.retryInterval = 0

        let callbackTimes = 0
        const callback = (err, response) => {
            callbackTimes++
            t.true(err, 'retry 3 times and err deadline')
            t.equal(callbackTimes, 1, 'callback only once called')
            t.false(response, 'retry response is undefined')
            t.equal(requestTimes, 3, 'retry requestes 3 times')

            tryShutdown()
        }
        const origin = this.dataSender.dataSender.requestApiMetaData.request
        let requestTimes = 0
        this.dataSender.dataSender.requestApiMetaData.request = (data, _, timesOfRetry = 1) => {
            requestTimes++
            origin.call(this.dataSender.dataSender.requestApiMetaData, data, callback, timesOfRetry)
        }
        this.dataSender.send(apiMetaInfo)

        tryShutdown = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }
    })
})

test.skip('sendApiMetaInfo lineNumber and location', (t) => {
    const server = new GrpcServer()
    server.addService(services.MetadataService, {
        requestApiMetaData: requestApiMetaData
    })
    server.startup((port) => {
        const agentInfo = Object.assign(new AgentInfo({
            agentId: '12121212',
            applicationName: 'applicationName',
            agentStartTime: Date.now()
        }), {
            ip: '1'
        })

        const apiMetaInfo = ApiMetaInfo.create(new MethodDescriptorBuilder()
            .setApiId(12121212)
            .setClassName('Router')
            .setMethodName('get')
            .setType(1400)
            .setLineNumber(481)
            .setLocation('node_modules/express/lib/application.js')
            .build()
        )

        this.dataSender = dataSenderFactory.create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, agentInfo)

        let callbackTimes = 0
        const callback = (error, response) => {
            callbackTimes++
            t.false(error, 'error is undefined')
            t.true(response, 'response')
            t.equal(callbackTimes, 1, 'callback only once called')
            t.equal(requestTimes, 1, 'requestes one time')

            tryShutdown()
        }
        const origin = this.dataSender.dataSender.requestApiMetaData.request
        let requestTimes = 0
        this.dataSender.dataSender.requestApiMetaData.request = (data, _, timesOfRetry = 1) => {
            requestTimes++
            t.equal(data.getApiid(), 12121212, 'apiId')
            t.equal(data.getApiinfo(), 'Router.get', 'Apiinfo')
            t.equal(data.getType(), 1400, 'type')
            t.equal(data.getLine(), 481, 'line')
            t.equal(data.getLocation(), 'node_modules/express/lib/application.js', 'location')
            origin.call(this.dataSender.dataSender.requestApiMetaData, data, callback, timesOfRetry)
        }
        this.dataSender.send(apiMetaInfo)

        tryShutdown = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }
    })
})

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestStringMetaData(call, callback) {
    const result = new spanMessages.PResult()
    _.delay(() => {
        callback(null, result)
    }, 100)
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test.skip('sendStringMetaInfo retry', (t) => {
    const server = new GrpcServer()
    server.addService(services.MetadataService, {
        requestStringMetaData: requestStringMetaData
    })
    server.startup((port) => {
        const agentInfo = Object.assign(new AgentInfo({
            agentId: '12121212',
            applicationName: 'applicationName',
            agentStartTime: Date.now()
        }), {
            ip: '1'
        })

        this.dataSender = dataSenderFactory.create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, agentInfo)

        const stringMetaInfo = new StringMetaInfo({
            stringId: '12121212',
            stringValue: 'agentInfo'
        })

        this.dataSender.dataSender.requestStringMetaData.getDeadline = () => {
            const deadline = new Date()
            deadline.setMilliseconds(deadline.getMilliseconds() + 100)
            return deadline
        }
        this.dataSender.dataSender.requestStringMetaData.retryInterval = 0

        let callbackTimes = 0
        const callback = (err, response) => {
            callbackTimes++
            t.true(err, 'retry 3 times and err deadline')
            t.equal(callbackTimes, 1, 'callback only once called')
            t.false(response, 'retry response is undefined')
            t.equal(requestTimes, 3, 'retry requestes 3 times')

            tryShutdown()
        }
        const origin = this.dataSender.dataSender.requestStringMetaData.request
        let requestTimes = 0
        this.dataSender.dataSender.requestStringMetaData.request = (data, _, timesOfRetry = 1) => {
            requestTimes++
            origin.call(this.dataSender.dataSender.requestStringMetaData, data, callback, timesOfRetry)
        }
        this.dataSender.send(stringMetaInfo)

        tryShutdown = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }
    })
})


// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test.skip('sendAgentInfo schedule', (t) => {
    const server = new grpc.Server()
    server.addService(services.AgentService, {
        requestAgentInfo: requestAgentInfo
    })
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            t.fail(error)
            return
        }

        const agentInfo1 = Object.assign(new AgentInfo({
            agentId: '12121212',
            applicationName: 'applicationName',
            agentStartTime: Date.now()
        }), {
            ip: '1'
        })

        const create = (config, agentInfo) => {
            return new DataSender(config, new GrpcDataSender(
                config.collectorIp,
                config.collectorTcpPort,
                config.collectorStatPort,
                config.collectorSpanPort,
                agentInfo
            ))
        }

        const dataSender = create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, agentInfo1)

        dataSender.close()

        server.forceShutdown()
        t.end()
    })
    // server.startup((port) => {
    //     const agentInfo1 = Object.assign(new AgentInfo({
    //         agentId: '12121212',
    //         applicationName: 'applicationName',
    //         agentStartTime: Date.now()
    //     }), {
    //         ip: '1'
    //     })

    //     this.dataSender = dataSenderFactory.create({
    //         collectorIp: 'localhost',
    //         collectorTcpPort: port,
    //         collectorStatPort: port,
    //         collectorSpanPort: port,
    //         enabledDataSending: true
    //     }, agentInfo1)

    //     const originAgentInfoRefreshInterval = this.dataSender.dataSender.agentInfoRefreshInterval
    //     this.dataSender.dataSender.agentInfoRefreshInterval = () => {
    //         return 100
    //     }
    //     this.dataSender.dataSender.initializeAgentInfoScheduler()

    //     let callbackTimes = 0
    //     const callback = (err, response) => {
    //         callbackTimes++

    //         t.true(callbackTimes <= 2, 'retry call is less than 2')
    //         t.true(response, 'retry by schedule')

    //         if (callbackTimes == 2) {
    //             tryShutdown()
    //         }
    //     }
    //     const origin = this.dataSender.dataSender.requestAgentInfo.request
    //     let requestTimes = 0
    //     this.dataSender.dataSender.requestAgentInfo.request = (data, _, timesOfRetry = 1) => {
    //         requestTimes++
    //         if (requestTimes == 2) {
    //             this.dataSender.dataSender.agentInfoRefreshInterval = originAgentInfoRefreshInterval
    //             this.dataSender.dataSender.agentInfoDailyScheduler.stop()
    //         }

    //         origin.call(this.dataSender.dataSender.requestAgentInfo, data, callback, timesOfRetry)
    //     }
    //     this.dataSender.send(agentInfo1)

    //     tryShutdown = () => {
    //         setTimeout(() => {
    //             server.tryShutdown(() => {
    //                 t.end()
    //             })
    //         }, 0)
    //     }
    // })
})
