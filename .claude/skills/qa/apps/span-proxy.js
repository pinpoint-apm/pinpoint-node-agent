'use strict'

// An HTTP/2 proxy between the agent and the collector span port. It runs without the agent.
// It logs grpc-encoding, the compressed flag and the bytes of each request; on SIGTERM or SIGINT it logs
// the count and bytes per request of the forwarded requests of each RPC.
// With --reject-gzip it answers a gzip request as grpc-java does without a gzip decompressor.
// The agent has one collector IP, so the proxy also forwards the SPAN_PROXY_TCP_PORTS, the stat and tcp ports, as is.
const http2 = require('node:http2')
const net = require('node:net')

const rejectGzip = process.argv.includes('--reject-gzip')
const collector = http2.connect(`http://${process.env.SPAN_PROXY_COLLECTOR}`)
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
    const chunks = []
    stream.on('data', (chunk) => {
        chunks.push(chunk)
        upstream.write(chunk)
    })
    stream.on('end', () => {
        upstream.end()
        const body = Buffer.concat(chunks)
        log(rpc, encoding, body.length > 0 ? body.readUInt8(0) : '-', body.length, 'forwarded')
    })
    forwardResponse(upstream, stream)
})
server.listen(Number(process.env.SPAN_PROXY_PORT), '127.0.0.1')

const collectorHost = process.env.SPAN_PROXY_COLLECTOR.split(':')[0]
for (const port of (process.env.SPAN_PROXY_TCP_PORTS ?? '').split(',').filter(Boolean).map(Number)) {
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

function forwardResponse(upstream, stream) {
    let trailers = {}
    upstream.on('response', (headers) => {
        if (headers['grpc-status'] !== undefined) {
            stream.respond(headers, { endStream: true })
            return
        }
        stream.respond(headers, { waitForTrailers: true })
    })
    upstream.on('data', (chunk) => stream.write(chunk))
    upstream.on('trailers', (received) => {
        trailers = received
    })
    upstream.on('end', () => {
        if (!stream.headersSent || stream.writableEnded) {
            return
        }
        stream.end()
    })
    stream.on('wantTrailers', () => stream.sendTrailers(trailers))
}

function log(rpc, encoding, compressedFlag, bytes, result) {
    console.log(`${rpc} grpc-encoding=${encoding} compressed=${compressedFlag} bytes=${bytes} ${result}`)
    if (result !== 'forwarded') {
        return
    }
    const total = totals.get(rpc) ?? { requests: 0, bytes: 0 }
    total.requests++
    total.bytes += bytes
    totals.set(rpc, total)
}

function logTotals() {
    for (const [rpc, total] of totals) {
        console.log(`total ${rpc} requests=${total.requests} bytes=${total.bytes} bytesPerRequest=${Math.round(total.bytes / total.requests)}`)
    }
    process.exit(0)
}

process.on('SIGTERM', logTotals)
process.on('SIGINT', logTotals)
