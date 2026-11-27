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
const spanMessages = require('../../lib/data/v1/Span_pb')
const SpanBatchSender = require('../../lib/client/span-batch-sender')
const UnaryDeadlineOptionsBuilder = require('../../lib/client/unary-deadline-options-builder')
const OptionsBuilder = require('../../lib/client/retry/options-builder')
const { spanWithId } = require('../fixtures/span-with-id')

const oneMinuteMillis = 60 * 1000

test('20 spans are sent in one SendSpanBatch request', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpan: () => {
            t.fail('the SendSpan stream must not be called')
        },
        sendSpanBatch: (call, callback) => {
            callback(null, new spanMessages.PSpanResultBatch())

            const actualSpanMessages = call.request.getSpanList()
            t.equal(actualSpanMessages.length, 20, 'the request carries 20 span messages')
            t.equal(actualSpanMessages[0].getSpan().getTransactionid().getSequence(), '1', 'the first span message is the first pushed span')
            t.equal(actualSpanMessages[19].getSpan().getTransactionid().getSequence(), '20', 'the last span message is the 20th pushed span')
            t.end()
        }
    })

    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 20, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger())
        for (let sequence = 1; sequence <= 20; sequence++) {
            sender.push(spanWithId(`${sequence}`))
        }

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('remaining spans are sent deadlineMillis after the first span', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            callback(null, new spanMessages.PSpanResultBatch())

            t.equal(call.request.getSpanList().length, 1, 'the request carries the 1 pushed span message')
            t.end()
        }
    })

    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 20, deadlineMillis: 10, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger())
        sender.push(spanWithId('1'))

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('end() sends all queued spans in one SendSpanBatch request', (t) => {
    const receivedSpanCounts = []
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            callback(null, new spanMessages.PSpanResultBatch())

            receivedSpanCounts.push(call.request.getSpanList().length)
            if (receivedSpanCounts.length === 2) {
                t.deepEqual(receivedSpanCounts.sort((a, b) => a - b), [20, 45], 'the first full batch, then all 45 queued spans in one request')
                t.end()
            }
        }
    })

    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 20, deadlineMillis: oneMinuteMillis, maxRequests: 1 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger())
        for (let sequence = 1; sequence <= 65; sequence++) {
            sender.push(spanWithId(`${sequence}`))
        }
        sender.end()

        t.teardown(() => {
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('a size above 1000 is capped at 1000 so a full batch is sent before the oldest span is discarded', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            callback(null, new spanMessages.PSpanResultBatch())

            t.equal(call.request.getSpanList().length, 1000, 'the request carries 1000 span messages')
            t.equal(logger.warnMessages.length, 0, 'no span is discarded')
            t.end()
        }
    })

    const logger = new CapturingLogger()
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 2000, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), logger)
        for (let sequence = 1; sequence <= 1000; sequence++) {
            sender.push(spanWithId(`${sequence}`))
        }

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('the 11th batch waits while 10 SendSpanBatch requests are awaiting a response and is sent by the remaining spans timer after a response returns', (t) => {
    const heldCallbacks = []
    const receivedSequences = []
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            receivedSequences.push(call.request.getSpanList()[0].getSpan().getTransactionid().getSequence())
            heldCallbacks.push(callback)
            if (receivedSequences.length === 10) {
                t.equal(logger.warnMessages.length, 0, 'the waiting batch is not discarded')
                heldCallbacks[0](null, new spanMessages.PSpanResultBatch())
                return
            }
            if (receivedSequences.length === 11) {
                t.equal(receivedSequences[10], '11', 'the 11th span is sent by the timer after the first response')
                heldCallbacks.slice(1).forEach((heldCallback) => heldCallback(null, new spanMessages.PSpanResultBatch()))
                callback(null, new spanMessages.PSpanResultBatch())
                t.end()
            }
        }
    })

    const logger = new CapturingLogger()
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 1, deadlineMillis: 10, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), logger)
        for (let sequence = 1; sequence <= 11; sequence++) {
            sender.push(spanWithId(`${sequence}`))
        }

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('the oldest waiting span is discarded when 1000 spans are waiting', (t) => {
    const heldCallbacks = []
    const receivedSequences = []
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            receivedSequences.push(call.request.getSpanList()[0].getSpan().getTransactionid().getSequence())
            heldCallbacks.push(callback)
            if (receivedSequences.length === 1) {
                pushWaitingSpans()
                t.equal(logger.warnMessages.length, 1, 'one warning for the discarded span')
                t.equal(logger.warnMessages[0], 'Discarded the oldest span: 1000 spans are waiting for 1 SendSpanBatch requests awaiting a response', 'the warning names the waiting spans and the requests awaiting a response')
                heldCallbacks[0](null, new spanMessages.PSpanResultBatch())
                return
            }
            if (receivedSequences.length === 2) {
                t.equal(receivedSequences[1], '3', 'span 2, the oldest waiting span, was discarded')
                callback(null, new spanMessages.PSpanResultBatch())
                t.end()
            }
        }
    })

    const logger = new CapturingLogger()
    let sender
    function pushWaitingSpans() {
        for (let sequence = 2; sequence <= 1002; sequence++) {
            sender.push(spanWithId(`${sequence}`))
        }
    }
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        sender = new SpanBatchSender(spanClient, { size: 1, deadlineMillis: 10, maxRequests: 1 }, new UnaryDeadlineOptionsBuilder(), logger)
        sender.push(spanWithId('1'))

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('rejected spans without an errorId are logged as a warning without the errorId', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            const partialSuccess = new spanMessages.PPartialSuccess()
            partialSuccess.setRejectedSpans(2)
            partialSuccess.setErrorMessage('invalid span')
            const result = new spanMessages.PSpanResultBatch()
            result.setPartialSuccess(partialSuccess)
            callback(null, result)
        }
    })

    const logger = new CapturingLogger()
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 2, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), logger)
        logger.onWarn = () => {
            t.equal(logger.warnMessages[0], 'The collector rejected 2 spans: invalid span', 'errorId 0 is left out of the warning')
            t.end()
        }
        sender.push(spanWithId('1'))
        sender.push(spanWithId('2'))

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('rejected spans are logged with the errorId in the Java agent base64 form', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            const partialSuccess = new spanMessages.PPartialSuccess()
            partialSuccess.setRejectedSpans(2)
            partialSuccess.setErrorid('-4821937465512384719')
            partialSuccess.setErrorMessage('invalid span')
            const result = new spanMessages.PSpanResultBatch()
            result.setPartialSuccess(partialSuccess)
            callback(null, result)
        }
    })

    const logger = new CapturingLogger()
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const responses = captureSendSpanBatchResponses(spanClient)
        const sender = new SpanBatchSender(spanClient, { size: 2, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), logger)
        logger.onWarn = () => {
            t.equal(responses[0].getPartialSuccess().getErrorid(), '-4821937465512384719', 'the int64 errorId is read as a string without losing precision')
            t.equal(logger.warnMessages[0], 'The collector rejected 2 spans: errorId=vRUJbD78pzE, invalid span', 'the errorId matches ErrorId.toBase64() of the collector log')
            t.end()
        }
        sender.push(spanWithId('1'))
        sender.push(spanWithId('2'))

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('an error message without rejected spans is logged as info', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            const partialSuccess = new spanMessages.PPartialSuccess()
            partialSuccess.setErrorMessage('slow storage')
            const result = new spanMessages.PSpanResultBatch()
            result.setPartialSuccess(partialSuccess)
            callback(null, result)
        }
    })

    const logger = new CapturingLogger()
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 1, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), logger)
        logger.onInfo = () => {
            t.equal(logger.infoMessages[0], 'The collector answered SendSpanBatch with a warning: slow storage', 'the info names the error message')
            t.equal(logger.warnMessages.length, 0, 'no warning without rejected spans')
            t.end()
        }
        sender.push(spanWithId('1'))

        t.teardown(() => {
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('a collector without SendSpanBatch stops span sending with one default-logger warning', (t) => {
    const defaultLoggerWarnings = []
    const originalWarn = loglevel.warn
    loglevel.warn = function () { defaultLoggerWarnings.push(Array.from(arguments).join(' ')) }

    const server = new grpc.Server()
    server.addService(services.SpanService, {})

    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 1, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger())
        const sentRequests = countSendSpanBatchRequests(spanClient)
        afterSendSpanBatchResponses(spanClient, 2, () => {
            t.equal(defaultLoggerWarnings.length, 1, 'one default-logger warning for two UNIMPLEMENTED responses')
            t.true(defaultLoggerWarnings[0].includes('The collector does not support SendSpanBatch, so span sending stops. Collector 3.1.0 or later is required.'), 'the warning names the required collector version')

            sender.push(spanWithId('3'))
            t.equal(sentRequests.count, 2, 'a span pushed after the stop sends no request')
            t.end()
        })
        sender.push(spanWithId('1'))
        sender.push(spanWithId('2'))

        t.teardown(() => {
            loglevel.warn = originalWarn
            sender.end()
            spanClient.close()
            server.forceShutdown()
        })
    })
})

test('span batches are gzip-compressed with compression gzip and sent as is with none', (t) => {
    const collector = new Http2Collector(() => okStatus)
    collector.listen((address) => {
        const gzipSpanClient = new services.SpanClient(address, grpc.credentials.createInsecure(), new OptionsBuilder().setCompression('gzip').build())
        const uncompressedSpanClient = new services.SpanClient(address, grpc.credentials.createInsecure(), new OptionsBuilder().setCompression('none').build())
        const gzipSender = new SpanBatchSender(gzipSpanClient, { size: 1, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger(), uncompressedSpanClient)
        const uncompressedSender = new SpanBatchSender(uncompressedSpanClient, { size: 1, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger())

        collector.onRequest = () => {
            const gzipRequest = collector.requests[0]
            t.equal(gzipRequest.encoding, 'gzip', 'compression gzip sends the grpc-encoding: gzip header')
            t.true(gzipRequest.compressed, 'compression gzip sets the compressed flag of the message')
            t.equal(gzipRequest.batch.getSpanList()[0].getSpan().getTransactionid().getSequence(), '1', 'the gunzipped batch carries the pushed span')

            collector.onRequest = () => {
                const uncompressedRequest = collector.requests[1]
                t.equal(uncompressedRequest.encoding, undefined, 'compression none sends no grpc-encoding header')
                t.false(uncompressedRequest.compressed, 'compression none leaves the compressed flag unset')
                t.equal(uncompressedRequest.batch.getSpanList()[0].getSpan().getTransactionid().getSequence(), '2', 'the uncompressed batch carries the pushed span')
                t.end()
            }
            uncompressedSender.push(spanWithId('2'))
        }
        gzipSender.push(spanWithId('1'))

        t.teardown(() => {
            gzipSender.end()
            uncompressedSender.end()
            gzipSpanClient.close()
            uncompressedSpanClient.close()
            collector.close()
        })
    })
})

test('a collector without a gzip decompressor gets uncompressed span batches for the rest of the sender life with one default-logger warning', (t) => {
    const defaultLoggerWarnings = []
    const originalWarn = loglevel.warn
    loglevel.warn = function () { defaultLoggerWarnings.push(Array.from(arguments).join(' ')) }

    const collector = new Http2Collector((request) => request.encoding === 'gzip' ? decompressorUnavailableStatus : okStatus)
    collector.listen((address) => {
        const gzipSpanClient = new services.SpanClient(address, grpc.credentials.createInsecure(), new OptionsBuilder().setCompression('gzip').build())
        const uncompressedSpanClient = new services.SpanClient(address, grpc.credentials.createInsecure(), new OptionsBuilder().build())
        const sender = new SpanBatchSender(gzipSpanClient, { size: 1, deadlineMillis: oneMinuteMillis, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger(), uncompressedSpanClient)
        afterSendSpanBatchResponses(gzipSpanClient, 2, () => {
            collector.onRequest = () => {
                const requestAfterFallback = collector.requests[2]
                t.equal(requestAfterFallback.encoding, undefined, 'the batch after the fallback has no grpc-encoding header')
                t.false(requestAfterFallback.compressed, 'the batch after the fallback is not compressed')
                t.equal(requestAfterFallback.batch.getSpanList()[0].getSpan().getTransactionid().getSequence(), '3', 'span sending goes on after the fallback')
                t.equal(defaultLoggerWarnings.length, 1, 'one default-logger warning for two rejected gzip batches')
                t.true(defaultLoggerWarnings[0].includes("The collector does not accept gzip span batches (Can't find decompressor for gzip), so they are sent uncompressed from now on."), 'the warning names the collector answer')
                t.end()
            }
            sender.push(spanWithId('3'))
        })
        sender.push(spanWithId('1'))
        sender.push(spanWithId('2'))

        t.teardown(() => {
            loglevel.warn = originalWarn
            sender.end()
            gzipSpanClient.close()
            uncompressedSpanClient.close()
            collector.close()
        })
    })
})

test('a span pushed after end() sends no request', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {
        sendSpanBatch: (call, callback) => {
            callback(null, new spanMessages.PSpanResultBatch())
        }
    })

    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 20, deadlineMillis: 10, maxRequests: 10 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger())
        const sentRequests = countSendSpanBatchRequests(spanClient)
        sender.end()
        spanClient.close()

        sender.push(spanWithId('1'))
        setTimeout(() => {
            t.equal(sentRequests.count, 0, 'no SendSpanBatch request on the closed channel')
            t.end()
        }, 50)

        t.teardown(() => {
            server.forceShutdown()
        })
    })
})

test('a SendSpanBatch call that throws on a closed channel is logged instead of thrown', (t) => {
    const server = new grpc.Server()
    server.addService(services.SpanService, {})

    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        const spanClient = new services.SpanClient(`localhost:${port}`, grpc.credentials.createInsecure())
        const sender = new SpanBatchSender(spanClient, { size: 1, deadlineMillis: oneMinuteMillis, maxRequests: 1 }, new UnaryDeadlineOptionsBuilder(), new CapturingLogger())
        spanClient.close()

        t.doesNotThrow(() => sender.push(spanWithId('1')), 'push on a closed channel does not throw')
        t.equal(sender.sendingBatchCount, 0, 'the failed call does not hold a concurrent request slot')

        t.teardown(() => {
            sender.end()
            server.forceShutdown()
        })
        t.end()
    })
})

const okStatus = { code: grpc.status.OK }
// grpc-java ServerImpl answer to a request whose grpc-encoding it cannot decompress
const decompressorUnavailableStatus = { code: grpc.status.UNIMPLEMENTED, message: "Can't find decompressor for gzip" }

// grpc.Server removes grpc-encoding before a handler runs, so this collector reads the HTTP/2 request itself.
class Http2Collector {
    constructor(answer) {
        this.answer = answer
        this.requests = []
        this.server = http2.createServer()
        this.server.on('stream', (stream, headers) => {
            const chunks = []
            stream.on('data', (chunk) => chunks.push(chunk))
            stream.on('end', () => {
                const request = readSpanBatchRequest(headers, Buffer.concat(chunks))
                this.requests.push(request)
                respond(stream, this.answer(request))
                this.onRequest?.()
            })
        })
    }

    listen(callback) {
        this.server.listen(0, 'localhost', () => callback(`localhost:${this.server.address().port}`))
    }

    close() {
        this.server.close()
    }
}

function readSpanBatchRequest(headers, frame) {
    const compressed = frame.readUInt8(0) === 1
    const message = frame.subarray(5)
    return {
        encoding: headers['grpc-encoding'],
        compressed,
        batch: spanMessages.PSpanMessageBatch.deserializeBinary(compressed ? zlib.gunzipSync(message) : message)
    }
}

function respond(stream, status) {
    if (status.code !== grpc.status.OK) {
        stream.respond({ ':status': 200, 'content-type': 'application/grpc', 'grpc-status': `${status.code}`, 'grpc-message': status.message }, { endStream: true })
        return
    }

    stream.respond({ ':status': 200, 'content-type': 'application/grpc' }, { waitForTrailers: true })
    stream.on('wantTrailers', () => stream.sendTrailers({ 'grpc-status': `${grpc.status.OK}` }))
    const message = Buffer.from(new spanMessages.PSpanResultBatch().serializeBinary())
    const header = Buffer.alloc(5)
    header.writeUInt32BE(message.length, 1)
    stream.end(Buffer.concat([header, message]))
}

class CapturingLogger {
    constructor() {
        this.infoMessages = []
        this.warnMessages = []
    }

    info(message) {
        this.infoMessages.push(message)
        this.onInfo?.()
    }

    warn(message) {
        this.warnMessages.push(message)
        this.onWarn?.()
    }
}

function countSendSpanBatchRequests(spanClient) {
    const sentRequests = { count: 0 }
    const original = spanClient.sendSpanBatch
    spanClient.sendSpanBatch = function () {
        sentRequests.count++
        return original.apply(this, arguments)
    }
    return sentRequests
}

function captureSendSpanBatchResponses(spanClient) {
    const responses = []
    const original = spanClient.sendSpanBatch
    spanClient.sendSpanBatch = function (request, options, callback) {
        return original.call(this, request, options, (err, response) => {
            responses.push(response)
            callback(err, response)
        })
    }
    return responses
}

function afterSendSpanBatchResponses(spanClient, expectedResponses, afterAllResponses) {
    const original = spanClient.sendSpanBatch
    let completedResponses = 0
    spanClient.sendSpanBatch = function (request, options, callback) {
        return original.call(this, request, options, (err, response) => {
            callback(err, response)
            if (++completedResponses === expectedResponses) {
                afterAllResponses()
            }
        })
    }
}
