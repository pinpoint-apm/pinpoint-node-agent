/**
 * Pinpoint Node.js Agent
 * Copyright 2026-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const loglevel = require('loglevel')
const services = require('../../lib/data/v1/Service_grpc_pb')
const spanMessages = require('../../lib/data/v1/Span_pb')
const SpanBatchSender = require('../../lib/client/span-batch-sender')
const UnaryDeadlineOptionsBuilder = require('../../lib/client/unary-deadline-options-builder')
const { spanWithId } = require('../support/grpc-fixture')

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
