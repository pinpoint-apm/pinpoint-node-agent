'use strict'

// An HTTP/2 proxy between the agent and the collector span or stat port. It runs without the agent.
// It logs grpc-encoding, the compressed flag and the bytes of each gRPC message as it arrives, so the messages
// of the long-lived SendAgentStat stream are logged too, and the bytes of each finished request; on SIGTERM or
// SIGINT it logs, for each RPC, the finished requests with their bytes per request, and the bytes per minute
// of everything forwarded, including streams that are still open.
// With --reject-gzip it answers a gzip request as grpc-java does without a gzip decompressor.
// The agent has one collector IP, so the proxy also forwards the GRPC_PROXY_TCP_PORTS, the other collector ports, as is.
const http2 = require('node:http2')
const net = require('node:net')
const zlib = require('node:zlib')

const rejectGzip = process.argv.includes('--reject-gzip')
const collector = http2.connect(`http://${process.env.GRPC_PROXY_COLLECTOR}`)
const totals = new Map()

const server = http2.createServer()
server.on('stream', (stream, headers) => {
    const rpc = headers[':path'].split('/').pop()
    const encoding = headers['grpc-encoding'] ?? 'identity'
    if (rejectGzip && encoding === 'gzip') {
        stream.resume()
        stream.on('end', () => log(rpc, encoding, '-', 0, 'rejected'))
        stream.respond({ ':status': 200, 'content-type': 'application/grpc', 'grpc-status': '12', 'grpc-message': "Can't find decompressor for gzip" }, { endStream: true })
        return
    }

    const upstream = collector.request(forwardedRequestHeaders(headers))
    let compressedFlag = '-'
    let requestBytes = 0
    let unread = Buffer.alloc(0)
    stream.on('data', (chunk) => {
        if (requestBytes === 0) {
            compressedFlag = chunk.readUInt8(0)
        }
        requestBytes += chunk.length
        upstream.write(chunk)
        rpcTotal(rpc).forwardedBytes += chunk.length
        unread = logMessages(rpc, encoding, Buffer.concat([unread, chunk]))
    })
    stream.on('end', () => {
        upstream.end()
        log(rpc, encoding, compressedFlag, requestBytes, 'forwarded')
    })
    forwardResponse(upstream, stream)
})
server.listen(Number(process.env.GRPC_PROXY_PORT), '127.0.0.1')

const collectorHost = process.env.GRPC_PROXY_COLLECTOR.split(':')[0]
for (const port of (process.env.GRPC_PROXY_TCP_PORTS ?? '').split(',').filter(Boolean).map(Number)) {
    net.createServer((socket) => {
        const upstream = net.connect(port, collectorHost)
        socket.pipe(upstream).pipe(socket)
        socket.on('error', () => upstream.destroy())
        upstream.on('error', () => socket.destroy())
    }).listen(port, '127.0.0.1')
}

function forwardedRequestHeaders(headers) {
    const forwarded = { ...headers }
    delete forwarded[':authority']
    delete forwarded[':scheme']
    return forwarded
}

// The agent closes its streams when it stops, so the collector answer can arrive after the agent stream is gone.
function forwardResponse(upstream, stream) {
    let trailers = {}
    stream.on('close', () => upstream.close())
    stream.on('error', () => upstream.close())
    upstream.on('error', () => stream.destroy())
    upstream.on('response', (headers) => {
        if (stream.destroyed) {
            return
        }
        if (headers['grpc-status'] !== undefined) {
            stream.respond(headers, { endStream: true })
            return
        }
        stream.respond(headers, { waitForTrailers: true })
    })
    upstream.on('data', (chunk) => {
        if (!stream.destroyed) {
            stream.write(chunk)
        }
    })
    upstream.on('trailers', (received) => {
        trailers = received
    })
    upstream.on('end', () => {
        if (stream.destroyed || !stream.headersSent || stream.writableEnded) {
            return
        }
        stream.end()
    })
    stream.on('wantTrailers', () => stream.sendTrailers(trailers))
}

// Logs each complete gRPC message (1 byte compressed flag, 4 bytes length, the message) and returns the bytes left over.
function logMessages(rpc, encoding, buffer) {
    while (buffer.length >= 5 && buffer.length >= 5 + buffer.readUInt32BE(1)) {
        const compressedFlag = buffer.readUInt8(0)
        const message = buffer.subarray(5, 5 + buffer.readUInt32BE(1))
        const uncompressedBytes = compressedFlag === 1 ? zlib.gunzipSync(message).length : message.length
        console.log(`${rpc} message grpc-encoding=${encoding} compressed=${compressedFlag} bytes=${message.length} uncompressedBytes=${uncompressedBytes}`)
        buffer = buffer.subarray(5 + message.length)
    }
    return buffer
}

function log(rpc, encoding, compressedFlag, bytes, result) {
    console.log(`${rpc} grpc-encoding=${encoding} compressed=${compressedFlag} bytes=${bytes} ${result}`)
    if (result !== 'forwarded') {
        return
    }
    const total = rpcTotal(rpc)
    total.requests++
    total.requestBytes += bytes
}

function rpcTotal(rpc) {
    if (!totals.has(rpc)) {
        totals.set(rpc, { requests: 0, requestBytes: 0, forwardedBytes: 0, startedAt: Date.now() })
    }
    return totals.get(rpc)
}

function logTotals() {
    for (const [rpc, total] of totals) {
        const minutes = (Date.now() - total.startedAt) / 60000
        const bytesPerRequest = total.requests > 0 ? Math.round(total.requestBytes / total.requests) : '-'
        console.log(`total ${rpc} requests=${total.requests} bytesPerRequest=${bytesPerRequest} forwardedBytes=${total.forwardedBytes} bytesPerMinute=${Math.round(total.forwardedBytes / minutes)}`)
    }
    process.exit(0)
}

process.on('SIGTERM', logTotals)
process.on('SIGINT', logTotals)
