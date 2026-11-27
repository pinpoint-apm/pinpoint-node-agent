/**
 * Pinpoint Node.js Agent
 * Copyright 2026-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const http2 = require('node:http2')
const zlib = require('node:zlib')
const grpc = require('@grpc/grpc-js')
const loglevel = require('loglevel')
const services = require('../../lib/data/v1/Service_grpc_pb')
const statMessages = require('../../lib/data/v1/Stat_pb')
const GrpcDataSender = require('../../lib/client/grpc-data-sender')
const StatsStreamClient = require('../../lib/client/stats-stream-client')
const GrpcReadableStreamBuilder = require('../../lib/client/grpc-readable-stream-builder')
const OptionsBuilder = require('../../lib/client/retry/options-builder')
const { ConfigBuilder } = require('../../lib/config-builder')
const { UriStatsSnapshot } = require('../../lib/metric/uri/uri-stats-snapshot')
const { UriStatsInfo } = require('../../lib/metric/uri/uri-stats-info-builder')

test('agent stats go on an uncompressed stats stream, and URI stats on a gzip stats stream unless stats compression is none', (t) => {
    const collector = new Http2StatCollector(({ path }) => path === sendAgentStatPath ? okStatus : unimplementedStatus)
    t.teardown(() => collector.close())
    collector.listen((port) => {
        const gzipDataSender = new GrpcDataSender(configWithCollectorPort(port, 'gzip'))
        t.teardown(() => gzipDataSender.close())

        collector.onMessage = () => {
            if (collector.messages.length < 2) {
                return
            }

            const agentStat = collector.messages.find(message => message.statMessage.hasAgentstat())
            t.equal(agentStat.encoding, undefined, 'the agent stat stream sends no grpc-encoding header')
            t.false(agentStat.compressed, 'the agent stat is not compressed')
            t.equal(agentStat.statMessage.getAgentstat().getTimestamp(), 1, 'the agent stat arrives')
            const uriStats = collector.messages.find(message => message.statMessage.hasAgenturistat())
            t.equal(uriStats.encoding, 'gzip', 'the URI stats stream sends the grpc-encoding: gzip header')
            t.true(uriStats.compressed, 'the URI stats are compressed')
            t.equal(uriStats.statMessage.getAgenturistat().getEachuristatList().length, 20, 'the gunzipped URI stats carry every URI')

            const noneDataSender = new GrpcDataSender(configWithCollectorPort(port, 'none'))
            t.teardown(() => noneDataSender.close())
            collector.onMessage = () => {
                const uncompressedUriStats = collector.messages[2]
                t.equal(uncompressedUriStats.encoding, undefined, 'with stats compression none, the URI stats stream sends no grpc-encoding header')
                t.false(uncompressedUriStats.compressed, 'with stats compression none, the URI stats are not compressed')
                t.equal(uncompressedUriStats.statMessage.getAgenturistat().getEachuristatList().length, 20, 'the uncompressed URI stats carry every URI')
                t.end()
            }
            noneDataSender.sendUriStats(uriStatsSnapshot(20))
        }
        gzipDataSender.sendAgentStats(agentStatAt(1))
        gzipDataSender.sendUriStats(uriStatsSnapshot(20))
    })
})

test('a collector without a gzip decompressor gets an uncompressed stats stream for the rest of the client life with one default-logger warning', (t) => {
    const defaultLoggerWarnings = []
    const originalWarn = loglevel.warn
    loglevel.warn = function () { defaultLoggerWarnings.push(Array.from(arguments).join(' ')) }
    t.teardown(() => { loglevel.warn = originalWarn })

    const collector = new Http2StatCollector(({ encoding }) => encoding === 'gzip' ? decompressorUnavailableStatus : okStatus)
    t.teardown(() => collector.close())
    collector.listen((port) => {
        const address = `localhost:${port}`
        const gzipStatClient = new services.StatClient(address, grpc.credentials.createInsecure(), new OptionsBuilder().setCompression('gzip').build())
        const uncompressedStatsClient = new services.StatClient(address, grpc.credentials.createInsecure(), new OptionsBuilder().build())
        t.teardown(() => {
            gzipStatClient.close()
            uncompressedStatsClient.close()
        })
        const stream = new GrpcReadableStreamBuilder(new StatsStreamClient(gzipStatClient, uncompressedStatsClient), 'sendAgentStat').build()
        t.teardown(() => stream.end())

        collector.onStream = () => {
            if (collector.streamEncodings.length < 2) {
                return
            }

            collector.onMessage = () => {
                t.deepEqual(collector.streamEncodings, ['gzip', undefined], 'the stream reopened after the rejected gzip stream has no grpc-encoding header')
                const statAfterFallback = collector.messages[0]
                t.false(statAfterFallback.compressed, 'the URI stats after the fallback are not compressed')
                t.equal(statAfterFallback.statMessage.getAgenturistat().getEachuristatList().length, 20, 'stat sending goes on after the fallback')
                t.equal(defaultLoggerWarnings.length, 1, 'one default-logger warning for the rejected gzip stream')
                t.true(defaultLoggerWarnings[0].includes("The collector does not accept gzip stats streams (Can't find decompressor for gzip), so they are sent uncompressed from now on."), 'the warning names the collector answer')
                t.end()
            }
            stream.push(uriStatsSnapshot(20).toProtocolBuffer())
        }
    })
})

const sendAgentStatPath = '/v1.Stat/SendAgentStat'

const okStatus = { code: grpc.status.OK }

const unimplementedStatus = { code: grpc.status.UNIMPLEMENTED, message: 'Not a stats stream' }

// grpc-java ServerImpl answer to a stream whose grpc-encoding it cannot decompress
const decompressorUnavailableStatus = { code: grpc.status.UNIMPLEMENTED, message: "Can't find decompressor for gzip" }

function configWithCollectorPort(port, statsCompression) {
    const json = require('../fixtures/pinpoint-config-test.json')
    return new ConfigBuilder({
        ...json,
        collector: { ...json.collector, ip: 'localhost', span: { port }, stats: { port, compression: statsCompression }, agent: { port } }
    }).build()
}

function agentStatAt(timestamp) {
    return { timestamp, collectInterval: 1000, cpu: { user: 0, system: 0 } }
}

function uriStatsSnapshot(uriCount) {
    const snapshot = new UriStatsSnapshot(Date.now(), uriCount)
    for (let i = 0; i < uriCount; i++) {
        snapshot.add(new UriStatsInfo(`/uri-${i}`, true, 0, 50 * i))
    }
    return snapshot
}

// grpc.Server removes grpc-encoding and the compressed flag before a handler runs,
// so this collector reads the gRPC frames of SendAgentStat streams from HTTP/2 as they arrive.
class Http2StatCollector {
    constructor(answer) {
        this.streamEncodings = []
        this.messages = []
        this.server = http2.createServer()
        this.server.on('stream', (stream, headers) => {
            const path = headers[':path']
            const encoding = headers['grpc-encoding']
            const status = answer({ path, encoding })
            if (path === sendAgentStatPath) {
                this.streamEncodings.push(encoding)
            }
            if (status.code !== grpc.status.OK) {
                stream.respond({ ':status': 200, 'content-type': 'application/grpc', 'grpc-status': `${status.code}`, 'grpc-message': status.message }, { endStream: true })
                this.onStream?.()
                return
            }

            this.readFrames(stream, encoding)
            stream.on('end', () => {
                stream.respond({ ':status': 200, 'content-type': 'application/grpc' }, { waitForTrailers: true })
                stream.on('wantTrailers', () => stream.sendTrailers({ 'grpc-status': `${grpc.status.OK}` }))
                // an uncompressed gRPC frame of the empty google.protobuf.Empty response
                stream.end(Buffer.alloc(5))
            })
            this.onStream?.()
        })
    }

    readFrames(stream, encoding) {
        let buffer = Buffer.alloc(0)
        stream.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk])
            while (buffer.length >= 5 && buffer.length >= 5 + buffer.readUInt32BE(1)) {
                const compressed = buffer.readUInt8(0) === 1
                const message = buffer.subarray(5, 5 + buffer.readUInt32BE(1))
                buffer = buffer.subarray(5 + message.length)
                this.messages.push({
                    encoding,
                    compressed,
                    statMessage: statMessages.PStatMessage.deserializeBinary(compressed ? zlib.gunzipSync(message) : message)
                })
                this.onMessage?.()
            }
        })
    }

    listen(callback) {
        this.server.listen(0, 'localhost', () => callback(this.server.address().port))
    }

    close() {
        this.server.close()
    }
}
