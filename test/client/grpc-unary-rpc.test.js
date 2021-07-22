/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

const test = require('tape')

const services = require('../../lib/data/v1/Service_grpc_pb')

var _ = require('lodash')
const GrpcServer = require('./grpc-server')

const spanMessages = require('../../lib/data/v1/Span_pb')
const dataSenderFactory = require('../../lib/client/data-sender-factory')
const AgentInfo = require('../../lib/data/dto/agent-info')
const ApiMetaInfo = require('../../lib/data/dto/api-meta-info')
const StringMetaInfo = require('../../lib/data/dto/string-meta-info')
const DataSender = require('../../lib/client/data-sender')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')

class MockGrpcDataSender extends GrpcDataSender {
    initializeSpanStream() {

    }

    initializeStatStream() {

    }

    initializePingStream() {

    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestAgentInfo(call, callback) {
    const result = new spanMessages.PResult()
    _.delay(() => {
        callback(null, result)
    }, 100)
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
let tryShutdown
test('sendAgentInfo refresh', (t) => {
    const server = new GrpcServer()
    server.addService(services.AgentService, {
        requestAgentInfo: requestAgentInfo
    })
    server.startup((port) => {
        const agentInfo1 = Object.assign(new AgentInfo({
            agentId: '12121212',
            applicationName: 'applicationName',
            agentStartTime: Date.now()
        }), {
            ip: '1'
        })

        const create = (config, agentInfo) => {
            return new DataSender(config, new MockGrpcDataSender(
                config.collectorIp,
                config.collectorTcpPort,
                config.collectorStatPort,
                config.collectorSpanPort,
                agentInfo
            ))
        }

        this.dataSender = create({
            collectorIp: 'localhost',
            collectorTcpPort: port,
            collectorStatPort: port,
            collectorSpanPort: port,
            enabledDataSending: true
        }, agentInfo1)

        this.dataSender.dataSender.requestAgentInfo.getDeadline = () => {
            const deadline = new Date()
            deadline.setMilliseconds(deadline.getMilliseconds() + 100)
            return deadline
        }
        this.dataSender.dataSender.requestAgentInfo.retryInterval = 0

        let callbackTimes = 0
        const callback = (err, response) => {
            callbackTimes++
            t.true(err, 'retry 3 times and err deadline')
            t.equal(callbackTimes, 1, 'callback only once called')
            t.false(response, 'retry response is undefined')
            t.equal(requestTimes, 3, 'retry requestes 3 times')

            tryShutdown()
            this.dataSender.dataSender.agentInfoDailyScheduler.stop()
        }
        const origin = this.dataSender.dataSender.requestAgentInfo.request
        let requestTimes = 0
        this.dataSender.dataSender.requestAgentInfo.request = (data, _, timesOfRetry = 1) => {
            requestTimes++
            origin.call(this.dataSender.dataSender.requestAgentInfo, data, callback, timesOfRetry)
        }
        this.dataSender.send(agentInfo1)

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
function requestApiMetaData(call, callback) {
    const result = new spanMessages.PResult()

    _.delay(() => {
        callback(null, result)
    }, 100)
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendApiMetaInfo retry', (t) => {
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

test('sendApiMetaInfo lineNumber and location', (t) => {
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
            apiId: 12121212,
            apiInfo: 'express.Function.app.get(path, callback)',
            type: 1400,
            lineNumber: 481,
            location: 'node_modules/express/lib/application.js',
        })

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
            t.equal(data.getApiinfo(), 'express.Function.app.get(path, callback)', 'Apiinfo')
            t.equal(data.getType(), 1400, 'type')
            t.equal(data.getLine(), 481, 'line')
            t.equal(data.getLocation(), '', 'location')
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
test('sendStringMetaInfo retry', (t) => {
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


// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/server.ts
function requestAgentInfo2(call, callback) {
    const result = new spanMessages.PResult()
    _.delay(() => {
        callback(null, result)
    }, 100)
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('sendAgentInfo schedule', (t) => {
    const server = new GrpcServer()
    server.addService(services.AgentService, {
        requestAgentInfo: requestAgentInfo2
    })
    server.startup((port) => {
        const agentInfo1 = Object.assign(new AgentInfo({
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
        }, agentInfo1)

        this.dataSender.dataSender.requestAgentInfo.retryInterval = 0
        const originAgentInfoRefreshInterval = this.dataSender.dataSender.agentInfoRefreshInterval
        this.dataSender.dataSender.agentInfoRefreshInterval = () => {
            return 100
        }
        this.dataSender.dataSender.initializeAgentInfoScheduler()

        let callbackTimes = 0
        const callback = (err, response) => {
            callbackTimes++

            t.true(callbackTimes <= 2, 'retry call is less than 2')
            t.true(response, 'retry by schedule')

            if (callbackTimes == 2) {
                tryShutdown()
            }
        }
        const origin = this.dataSender.dataSender.requestAgentInfo.request
        let requestTimes = 0
        this.dataSender.dataSender.requestAgentInfo.request = (data, _, timesOfRetry = 1) => {
            requestTimes++
            if (requestTimes == 2) {
                this.dataSender.dataSender.agentInfoRefreshInterval = originAgentInfoRefreshInterval
                this.dataSender.dataSender.agentInfoDailyScheduler.stop()
            }

            origin.call(this.dataSender.dataSender.requestAgentInfo, data, callback, timesOfRetry)
        }
        this.dataSender.send(agentInfo1)

        tryShutdown = () => {
            setTimeout(() => {
                server.tryShutdown(() => {
                    t.end()
                })
            }, 0)
        }
    })
})
