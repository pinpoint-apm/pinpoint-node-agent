/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const { beforeSpecificOne, DataSourceCallCountable } = require('./grpc-fixture')

class PingOnlyDataSource extends DataSourceCallCountable {
    constructor(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config) {
        config = Object.assign({}, config, {
            sendPing: true,
        })
        super(collectorIp, collectorTcpPort, collectorStatPort, collectorSpanPort, agentInfo, config)
    }
}

// https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/v5.0.0/examples/src/grpcjs/client.ts
test('If grpc server is ended, and then retry to connect Pinpoint server', (t) => {
    const server = new grpc.Server()
    let grpcServerCount = 0
    server.addService(services.AgentService, {
        pingSession: function (call) {
            call.on('data', (ping) => {
                grpcServerCount++
                if (grpcServerCount === 1) {
                    t.true(ping, '1st ping is not null in grpc server')
                    call.write(ping)
                } else if (grpcServerCount === 2) {
                    t.true(ping, '2nd ping is not null in grpc server')
                    call.write(ping)
                    call.end()
                }
            })
            call.on('end', () => {
                if (grpcServerCount === 2) {
                    t.fail('2nd ping call.end is not server call stream in grpc server')
                }
            })
        }
    })

    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, PingOnlyDataSource)

        const pingWritableStream = dataSender.pingStream.writableStream
        pingWritableStream.count = 0
        pingWritableStream.on('data', (ping) => {
            pingWritableStream.count++

            if (pingWritableStream.count === 1) {
                t.true(ping, '1st ping is not null in writableStream')
                dataSender.sendPing()
            } else if (pingWritableStream.count === 2) {
                t.true(ping, '2nd ping is not null in writableStream')
            }
        })
        pingWritableStream.on('end', function () {
            t.true(pingWritableStream.count === 2, 'grpc server pingStream network stream ended')
            t.true(pingWritableStream.writableStream.readableEnded, 'pingDuplexStream.readableStreamEnded is true, grpc server pingStream ended')
            t.false(pingWritableStream.writableStream.writableEnded, 'pingDuplexStream.writableStreamEnded is false, grpc server pingStream ended')

            t.end()
        })
        dataSender.sendPing()
    })

    t.teardown(() => {
        dataSender.close()
        server.forceShutdown()
    })
})