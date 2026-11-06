/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const { TestGrpcDataSenderBuilder, CommandAdaptor } = require('../../support/test-grpc-data-sender')
const cmdMessage = require('../../../lib/data/v1/Cmd_pb')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const shimmer = require('@pinpoint-apm/shimmer')
const GrpcReadableStream = require('../../../lib/client/grpc-readable-stream')

const reconnectTestTimeout = { timeout: 60 * 1000 }

test('If you run the ActiveRequest function, and then Node agent send the second piece of data, and the Pinpoint server fails, the ActiveRequest gRPC Stream closes and the for statement stops', reconnectTestTimeout, async (t) => {
    t.plan(29)
    let dataSender
    let requestId = 1
    let activeRequestCount = 0
    const profilerServices = {
        handleCommand: (call) => {
            handleCommandCall = call

            callHandleCommandStream(requestId)
        },
        commandStreamActiveThreadCount: (call, callback) => {
            call.on('data', (data) => {
                activeRequestCount++
                const commonStream = data.getCommonstreamresponse()
                if (commonStream.getResponseid() == 1) {
                    t.equal(data.getHistogramschematype(), 2, 'schemaType is 2')
                    t.equal(commonStream.getResponseid(), 1, 'responseId is 1')
                    t.equal(commonStream.getSequenceid(), activeRequestCount, `sequenceId is ${activeRequestCount}`)

                    if (activeRequestCount === 2) {
                        dataSender.disconnect()
                    }

                    if (activeRequestCount > 2) {
                        t.fail('The for statement should stop when the server fails')
                    }
                } else if (commonStream.getResponseid() == 2) {
                    t.equal(data.getHistogramschematype(), 2, 'schemaType is 2')
                    t.equal(commonStream.getResponseid(), 2, 'responseId is 2')
                    t.equal(commonStream.getSequenceid(), activeRequestCount - 2, `sequenceId is ${activeRequestCount - 2}`)

                    if (activeRequestCount === 4) {
                        callback(null, new Empty())
                    }
                }
            })
        }
    }
    dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(new CommandAdaptor(profilerServices))
        .build()
    let handleCommandCallCount = 0
    shimmer.wrap(dataSender.profilerClient, 'handleCommand', function (original) {
        return function () {
            handleCommandCallCount++
            const result = original.apply(this, arguments)
            result.on('end', () => {
                if (handleCommandCallCount === 3) {
                    dataSender.restart(new CommandAdaptor(profilerServices)).then(() => {
                        requestId = 2
                    })
                }
                if (handleCommandCallCount > 4) {
                    t.fail('The for statement should stop when the server fails')
                }
            })
            return result
        }
    })

    let makeCallMethodCallCount = 0
    let commandStream1st
    let activeRequestStream1st
    shimmer.wrap(GrpcReadableStream.prototype, 'pipeWritableStream', function (original) {
        return function () {
            makeCallMethodCallCount++

            const result = original.apply(this, arguments)
            if (makeCallMethodCallCount === 1) {
                commandStream1st = this
                t.equal(commandStream1st.name, '', '1st created commandStream is creating writable stream')
                commandStream1st.writableStream.on('end', () => {
                    t.true(firedError, 'The first commandStream is end method called by writable stream of first commandStream error')
                })
                let firedError
                commandStream1st.writableStream.on('error', (error) => {
                    firedError = error
                    t.equal(error.code, grpc.status.CANCELLED, 'The first commandStream is end method called by writable stream of first commandStream error')
                })
            } else if (makeCallMethodCallCount === 2) {
                activeRequestStream1st = this
                t.equal(activeRequestStream1st.name, 'activeThreadCountStream', '2nd created stream is activeRequestStream')
                activeRequestStream1st.writableStream.on('end', () => {
                    t.fail('ActiveThreadCountStream writableStream is the Server side stream, so it call directly end method')
                })
                shimmer.wrap(activeRequestStream1st.writableStream, 'end', function (original) {
                    return function () {
                        const result = original.apply(this, arguments)
                        t.false(firedError, 'The first activeRequestStream is end method called by Readable Stream ended')
                        t.equal(activeRequestStream1st.writableStream, this, 'The first activeRequestStream is end method called by Readable Stream ended')
                        return result
                    }
                })
                let firedError
                activeRequestStream1st.writableStream.on('error', (error) => {
                    firedError = error
                    t.fail('ActiveThreadCountStream writableStream is the Server side stream, so it call directly method with error argument')
                    t.equal(error.code, grpc.status.CANCELLED, 'The first activeRequestStream is end method called by writable stream of first activeRequestStream error')
                })
            } else if (makeCallMethodCallCount === 3) {
                const commandStream2nd = this
                t.equal(commandStream2nd.name, '', '3rd created stream is 2nd commandStream')
                commandStream2nd.writableStream.on('end', () => {
                    t.true(firedError, 'The second commandStream is end method called by writable stream of second commandStream error')
                })
                let firedError
                commandStream2nd.writableStream.on('error', (error) => {
                    firedError = error
                    t.equal(error.code, grpc.status.UNAVAILABLE, 'The second commandStream is end method called by writable stream of second commandStream error')
                })
            } else if (makeCallMethodCallCount === 4) {
                const commandStream3rd = this
                t.equal(commandStream3rd.name, '', '4th created stream is 3rd commandStream')
                commandStream3rd.writableStream.on('end', () => {
                    t.true(firedError, 'The third commandStream is end method called by writable stream of third commandStream')
                })
                let firedError
                commandStream3rd.writableStream.on('error', (error) => {
                    firedError = error
                    t.equal(error.code, grpc.status.UNAVAILABLE, 'The third commandStream is end method called by writable stream of third commandStream error')
                })
            } else if (makeCallMethodCallCount === 5) {
                const commandStream4th = this
                t.equal(commandStream4th.name, '', '5th created stream is 4th commandStream')
                commandStream4th.writableStream.on('end', () => {
                    t.pass('The fourth commandStream is end method called by writable stream of fourth commandStream')
                    t.end()
                })
                commandStream4th.writableStream.on('error', (error) => {
                    t.equal(error.code, grpc.status.CANCELLED, 'The fourth commandStream is ended by Collector server shutdown')
                })
            }
            return result
        }
    })

    let callCountHandleCommand = 0
    dataSender.sendSupportedServicesCommand((err) => {
        callCountHandleCommand++
        if (callCountHandleCommand == 1) {
            t.equal(err.code, 1, 'When the server is down, the error code is 1')
            t.equal(activeRequestCount, 2, 'ended activeRequestCount is 2')
        } else if (callCountHandleCommand === 2) {
            process.nextTick(() => {
                dataSender.close()
                handleCommandCall.end()
                shimmer.unwrap(GrpcReadableStream.prototype, 'pipeWritableStream')
            })
        }
    })
})

let handleCommandCall
function callHandleCommandStream(requestId) {
    const result = new cmdMessage.PCmdRequest()
    result.setRequestid(requestId)
    const message = new cmdMessage.PCmdActiveThreadCount()
    result.setCommandactivethreadcount(message)
    handleCommandCall.write(result)
}

test('If you run the ActiveRequest function, and deadline occurs, the ActiveRequest reconnection is successful', reconnectTestTimeout, async (t) => {
    let activeRequestCallCount = 0
    const profilerServices = {
        handleCommand: (call) => {
            handleCommandCall = call
            callHandleCommandStream(1)
        },
        commandStreamActiveThreadCount: (call, callback) => {
            call.on('data', (data) => {
                activeRequestCallCount++

                const commandStream = data.getCommonstreamresponse()
                t.equal(data.getHistogramschematype(), 2, 'schemaType is 2')
                t.equal(commandStream.getResponseid(), 1, 'responseId is 1')
                t.equal(commandStream.getSequenceid(), activeRequestCallCount, `sequenceId is ${activeRequestCallCount}`)

                if (activeRequestCallCount === 2) {
                    setTimeout(() => {
                        call.emit('error', new Error('Server Unknown errors Functional Test is Ended'))
                    }, 100)
                }
            })
        }
    }
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(new CommandAdaptor(profilerServices))
        .build()
    t.teardown(() => {
        dataSender.close()
        handleCommandCall.end()
        shimmer.unwrap(GrpcReadableStream.prototype, 'pipeWritableStream')
    })
    let makeCallMethodCallCount = 0
    shimmer.wrap(GrpcReadableStream.prototype, 'pipeWritableStream', function (original) {
        return function () {
            makeCallMethodCallCount++
            const result = original.apply(this, arguments)
            if (makeCallMethodCallCount === 1) {
                const commandStream1st = this
                t.equal(commandStream1st.name, '', '1st created stream is commandStream creating writable stream')
                commandStream1st.writableStream.on('end', () => {
                    t.true(firedError, 'The first commandStream is ended by Functional Test is Ended')
                })
                let firedError
                commandStream1st.writableStream.on('error', (error) => {
                    firedError = error
                    t.equal(error.code, grpc.status.CANCELLED, 'The first commandStream is end method called by writable stream of first commandStream error')
                })
            } else if (makeCallMethodCallCount === 2) {
                const activeRequestStream1st = this
                t.equal(activeRequestStream1st.name, 'activeThreadCountStream', '2nd created stream is activeRequestStream')
                const firstActiveRequestWritableStream = activeRequestStream1st.writableStream
                firstActiveRequestWritableStream.on('end', () => {
                    t.fail('The first activeRequestStream end event is no called')
                })
                firstActiveRequestWritableStream.on('status', (status) => {
                    t.true(firstActiveRequestWritableStream.writable, 'writableStream.writable in status event is true')
                    t.false(firstActiveRequestWritableStream.writableEnded, 'writableStream.writableEnded in status event is false')
                    t.equal(status.code, grpc.status.UNKNOWN, 'The status code is Unknown')
                    t.equal(sendSupportedServicesCommandError.code, status.code, 'The status code is equal to the error code of stub method callback error')
                    t.equal(sendSupportedServicesCommandError.details, status.details, 'The status details is Server Unknown errors Functional Test is Ended')
                })
                firstActiveRequestWritableStream.on('error', () => {
                    t.fail('The first activeRequestStream error event is not call')
                })
                activeRequestStream1st.readableStream.on('end', () => {
                    t.false(activeRequestStream1st.readableStream.readable, 'The readableStream.readable of first activeRequestStream is false')
                    t.true(activeRequestStream1st.readableStream.readableEnded, 'The readableStream.readableEnded of first activeRequestStream is true')
                    t.false(firstActiveRequestWritableStream.writableStream, 'The writableStream.writableStream of first activeRequestStream is false')
                    t.true(firstActiveRequestWritableStream.writableEnded, 'The writableStream.writableEnded of first activeRequestStream is true')
                    t.equal(endEventListenerWritableStream, firstActiveRequestWritableStream, 'The End method called this by writableStream.end() is equal to grpcReadableStream.writableStream.end()')
                    t.end()
                })

                let endEventListenerWritableStream
                shimmer.wrap(firstActiveRequestWritableStream, 'end', function (original) {
                    return function () {
                        const result = original.apply(this, arguments)
                        endEventListenerWritableStream = this
                        t.false(this.writable, 'The first writableStream.writable is false end method called by writableStream.end() is called by retryConnectionWritableStream()')
                        t.true(this.writableEnded, 'The first writableStream.writableEnded is true end method called by writableStream.end() is called by retryConnectionWritableStream()')
                        return result
                    }
                })
            }
            return result
        }
    })
    let sendSupportedServicesCommandError
    dataSender.sendSupportedServicesCommand((err) => {
        if (err) {
            sendSupportedServicesCommandError = err
        }
    })
})

test('sendSupportedServicesCommand and commandEcho', async (t) => {
    const commandAdaptor = new CommandAdaptor().writeEcho()
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(commandAdaptor)
        .build()

    dataSender.sendSupportedServicesCommand(async function () {
        const cmdEchoResponse = await commandAdaptor.echoResponse(commandAdaptor.requestId)
        const commonResponse = cmdEchoResponse.getCommonresponse()
        t.equal(commonResponse.getResponseid(), commandAdaptor.requestId, 'response id matches request id')
        t.equal(commonResponse.getStatus(), 0, 'status is success')
        t.equal(commonResponse.getMessage().getValue(), '', 'message is empty')

        t.equal(cmdEchoResponse.getMessage(), 'echo', 'echo message')
        dataSender.commandStream.writableStream.on('finish', () => {
            dataSender.disconnect()
            t.end()
        })
        dataSender.close()
    })
    dataSender.commandStream.writableStream.on('data', (cmdRequest) => {
        const actualRequestId = cmdRequest.getRequestid()
        t.equal(actualRequestId, commandAdaptor.requestId, 'request id matches')
        t.equal(cmdRequest.getCommandecho().getMessage(), 'echo', 'echo message')
    })
})

test('CommandStreamActiveThreadCount', async (t) => {
    const commandAdaptor = new CommandAdaptor().writeEcho()
    const dataSender = await new TestGrpcDataSenderBuilder()
        .addAdaptor(commandAdaptor)
        .build()
    t.teardown(() => {
        dataSender.close()
    })

    let once
    dataSender.sendSupportedServicesCommand(function () {
        if (once) {
            return
        }
        once = true

        process.nextTick(async () => {
            commandAdaptor.writeActiveThreadCount()
            const data = await commandAdaptor.activeThreadCountResponse(commandAdaptor.requestId)
            const commonStreamResponse = data.getCommonstreamresponse()
            t.equal(commonStreamResponse.getResponseid(), commandAdaptor.requestId, 'response id matches request id')
            t.equal(commonStreamResponse.getSequenceid(), 1, 'sequenceid is 1')
            t.equal(commonStreamResponse.getMessage().getValue(), '', 'message is empty')

            t.equal(data.getHistogramschematype(), 2, 'histogram schema type')
            t.equal(data.getActivethreadcountList()[0], 0, 'active thread count')
            t.end()
        })
    })
})
