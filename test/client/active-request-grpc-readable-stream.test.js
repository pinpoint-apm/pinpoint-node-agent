/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const grpc = require('@grpc/grpc-js')
const { beforeSpecificOne } = require('./grpc-fixture')
const services = require('../../lib/data/v1/Service_grpc_pb')
const cmdMessage = require('../../lib/data/v1/Cmd_pb')
const { ProfilerDataSource } = require('./grpc-fixture')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')
const shimmer = require('@pinpoint-apm/shimmer')
const GrpcReadableStream = require('../../lib/client/grpc-readable-stream')
const semver = require('semver')

test('If you run the ActiveRequest function, send the fifth piece of data, and the Pinpoint server fails, the ActiveRequest gRPC Stream closes and the for statement stops', (t) => {
    if (semver.satisfies(process.versions.node, '<19.0')) {
        t.plan(56)
    } else {
        t.plan(55)
    }
    const server = new grpc.Server()
    let handleCommandCall
    let requestId = 1
    function callHandleCommandStream(requestId) {
        const result = new cmdMessage.PCmdRequest()
        result.setRequestid(requestId)
        const message = new cmdMessage.PCmdActiveThreadCount()
        result.setCommandactivethreadcount(message)
        handleCommandCall.write(result)
    }
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

                    if (activeRequestCount === 5) {
                        server.forceShutdown()
                    }

                    if (activeRequestCount > 5) {
                        t.fail('The for statement should stop when the server fails')
                    }
                } else if (commonStream.getResponseid() == 2) {
                    t.equal(data.getHistogramschematype(), 2, 'schemaType is 2')
                    t.equal(commonStream.getResponseid(), 2, 'responseId is 2')
                    t.equal(commonStream.getSequenceid(), activeRequestCount - 5, `sequenceId is ${activeRequestCount - 5}`)

                    if (activeRequestCount === 13) {
                        callback(null, new Empty())
                    }
                }
            })
        }
    }
    server.addService(services.ProfilerCommandServiceService, profilerServices)

    let dataSender
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        dataSender = beforeSpecificOne(port, ProfilerDataSource)
        let handleCommandCallCount = 0
        shimmer.wrap(dataSender.profilerClient, 'handleCommand', function (original) {
            return function () {
                handleCommandCallCount++
                const result = original.apply(this, arguments)
                result.on('end', () => {
                    if (handleCommandCallCount === 3) {
                        server2 = new grpc.Server()
                        server2.addService(services.ProfilerCommandServiceService, profilerServices)
                        server2.bindAsync(`localhost:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
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
                        if (semver.satisfies(process.versions.node, '<19.0')) {
                            t.true(firedError, 'The fourth commandStream is end method called by writable stream of fourth commandStream')
                        } else {
                            t.true('The fourth commandStream is end method called by writable stream of fourth commandStream')
                        }
                        t.end()
                    })
                    let firedError
                    commandStream4th.writableStream.on('error', (error) => {
                        firedError = error
                        t.equal(error.code, grpc.status.CANCELLED, 'The fourth commandStream is ended by Collector server shutdown')
                    })
                }
                return result
            }
        })

        let callCountHandleCommand = 0
        let server2
        dataSender.sendSupportedServicesCommand((err) => {
            callCountHandleCommand++
            if (callCountHandleCommand == 1) {
                t.equal(err.code, 1, 'When the server is down, the error code is 1')
                t.equal(activeRequestCount, 5, 'ended activeRequestCount is 5')
            } else if (callCountHandleCommand === 2) {
                process.nextTick(() => {
                    dataSender.close()
                    handleCommandCall.end()
                    server2.tryShutdown(() => {
                        shimmer.unwrap(GrpcReadableStream.prototype, 'pipeWritableStream')
                    })
                })
            }
        })
    })
})
