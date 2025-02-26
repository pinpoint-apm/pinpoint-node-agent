/**
 * Pinpoint Node.js Agent
 * Copyright 2021-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const test = require('tape')
const GrpcReadableStream = require('../../lib/client/grpc-readable-stream')
const { Writable } = require('node:stream')
const semver = require('semver')
const { spanMessageWithId, beforeSpecificOne } = require('./grpc-fixture')
const grpc = require('@grpc/grpc-js')
const services = require('../../lib/data/v1/Service_grpc_pb')
const cmdMessage = require('../../lib/data/v1/Cmd_pb')
const { ProfilerDataSource } = require('./grpc-fixture')
const { Empty } = require('google-protobuf/google/protobuf/empty_pb')

test('no piped readable stream', (t) => {
    const readable = new GrpcReadableStream()
    readable.push(spanMessageWithId('1111'))
    readable.push(spanMessageWithId('1111'))
    readable.push(null)

    t.equal(readable.readableStream.readable, true, 'no writable stream piped readable stream not started')
    t.equal(readable.readableStream.readableLength, 2, 'no writable stream piped readable stream buffer is not empty')
    t.end()
})

test('piped readable stream', (t) => {
    const readable = new GrpcReadableStream(() => {
        const actualSteams = []
        const writable = new Writable({
            objectMode: true,
            write(chunk, encoding, callback) {
                actualSteams.push(chunk)
                callback()
            }
        })
        writable.on('finish', () => {
            t.equal(readable.readableStream.readable, false, 'piped readable stream finished')
            t.equal(actualSteams.length, 2, 'piped readable stream')
            t.equal(actualSteams[0], expected1, 'piped readable stream test1')
            t.equal(actualSteams[1], expected2, 'piped readable stream test2')

            t.end()
        })
        return writable
    })
    const expected1 = spanMessageWithId('1111')
    const expected2 = spanMessageWithId('2222')
    readable.push(expected1)
    readable.push(expected2)
    readable.push(null)
})

test('reconnect writable stream on piped readable stream', (t) => {
    if (semver.satisfies(process.versions.node, '<17.0')) {
        t.plan(17)
    } else {
        t.plan(21)
    }
    const writableStreams = []
    let writableStreamCreatedCount = 0
    const readable = new GrpcReadableStream(() => {
        let count = 0
        const writableStream = new Writable({
            objectMode: true,
            write(chunk, encoding, callback) {
                this.actualSteams.push(chunk)
                callback()
                count++

                if (count === 2) {
                    // Writable.prototype.pipe is only public method for errorOrDestroy
                    // Writable.prototype.pipe = function() {
                    //     errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
                    // };
                    writableStream.pipe()
                }
            }
        })
        writableStream.actualSteams = []
        writableStreams.push(writableStream)
        process.nextTick(() => {
            createdWritableStream(++writableStreamCreatedCount)
        })
        return writableStream
    })

    writableStreams[0].on('error', (error) => {
        t.equal(error.message, 'Cannot pipe, not readable', 'piped writable stream error')
        t.equal(readable.readableStream.readable, true, 'piped readable stream is readable on close event')

        t.equal(writableStreams[0].actualSteams.length, 2, 'piped readable stream')
        t.equal(writableStreams[0].actualSteams[0], expected1, 'piped readable stream test1')
        t.equal(writableStreams[0].actualSteams[1], expected2, 'piped readable stream test2')

        t.true(readable.readable, 'piped readable stream is readable on error event')
    })

    writableStreams[0].on('finish', () => {
        t.fail('piped writable stream finish event is not called')
    })

    writableStreams[0].on('close', () => {
        t.equal(readable.readableStream.readable, true, 'piped readable stream is no readable on close event')
        t.equal(writableStreams[0].destroyed, true, 'piped writable stream is destroyed on close event')
    })

    writableStreams[0].on('unpipe', () => {
        t.true(true, 'piped writable stream unpipe event is called')
    })

    const expected1 = spanMessageWithId('1111')
    const expected2 = spanMessageWithId('2222')
    readable.push(expected1)
    readable.push(expected2)

    readable.readableStream.on('error', () => {
        t.fail('piped readable stream error event is not called')
    })

    readable.readableStream.on('end', () => {
        t.fail('piped readable stream end event is not called')
    })

    readable.readableStream.on('close', () => {
        t.fail('piped readable stream close event is not called')
    })

    readable.readableStream.on('unpipe', () => {
        t.fail('piped readable stream unpipe event is not called')
    })

    const expected3 = spanMessageWithId('3')
    readable.push(expected3)

    function createdWritableStream(count) {
        if (count === 2) {
            t.true(writableStreams[0].destroyed, 'piped writable stream is destroyed')
            if (semver.satisfies(process.versions.node, '>17.0')) {
                t.true(writableStreams[0].closed, 'piped writable stream is closed')
                t.equal(writableStreams[0].errored.message, 'Cannot pipe, not readable', 'piped writable stream error message')
            }
            t.true(writableStreams[0].writableObjectMode, 'piped writable stream is object mode')
            t.false(writableStreams[0].writableEnded, 'piped writable stream is not ended. It is ended by destroy and close')

            t.false(writableStreams[1].destroyed, 'new piped writable stream is not destroyed')
            if (semver.satisfies(process.versions.node, '>17.0')) {
                t.false(writableStreams[1].closed, 'new piped writable stream is not closed')
                t.false(writableStreams[1].errored, 'new piped writable stream is not errored')
            }
            t.false(writableStreams[1].writableEnded, 'new piped writable stream is not ended')
            t.true(readable.readableStream.readable, 'piped readable stream is readable on new piped writable stream')

            readable.readableStream.on('data', (data) => {
                t.equal(expected3, writableStreams[1].actualSteams[0], 'new piped writable stream data')
                t.equal(data, expected3, 'piped readable stream data')
            })
        }
    }
})

test('If the Readable stream emits an error during processing, the writable destination is not closed automatically. If an error occurs, Close each streams, ', async (t) => {
    if (semver.satisfies(process.versions.node, '<17.0')) {
        t.plan(13)
    } else {
        t.plan(16)
    }

    let throwError = false
    const readable = new GrpcReadableStream(() => {
        const actualSteams = []
        const writableStream = new Writable({
            objectMode: true,
            write(chunk, encoding, callback) {
                actualSteams.push(chunk.toString())
                callback()
            }
        })

        writableStream.on('error', () => {
            t.fail('If readable stream occur an error, piped writable stream error event is not called')
        })

        writableStream.on('finish', function () {
            t.comment('If readable stream occur an error, piped writable stream is manually must be close')
            t.false(this.closed, 'closed property is false on the finish event of writable stream')
            t.false(this.destroyed, 'destroyed property is false on the finish event of writable stream')
            t.false(this.writable, 'writable property is false on the finish event of writable stream')
        })

        writableStream.on('close', function () {
            if (semver.satisfies(process.versions.node, '>17.0')) {
                t.true(this.closed, 'closed property is true on the close event of writable stream')
            }
            t.true(this.destroyed, 'destroyed property is true on the close event of writable stream')
            t.false(this.writable, 'writable property is false on the close event of writable stream')
        })

        writableStream.on('unpipe', function () {
            t.comment('If readable stream occur an error, piped writable stream unpipe event is must be called')
            t.false(this.closed, 'closed property is false on the unpipe event of writable stream')
            t.false(this.destroyed, 'destroyed property is false on the unpipe event of writable stream')
            t.false(this.writable, 'writable property is false on the unpipe event of writable stream')
        })

        return writableStream
    }, {
        // NODE 17+
        // readable stream has only errorOrDestroy method on _read method
        // try {
        //     this._read(state.highWaterMark);
        // } catch (err) {
        //     errorOrDestroy(this, err);
        // }
        read: () => {
            if (throwError && semver.satisfies(process.versions.node, '>17.0')) {
                throw new Error('test error')
            }
        }
    })
    const expected1 = spanMessageWithId('1111')
    const expected2 = spanMessageWithId('2222')
    readable.push(expected1)
    readable.push(expected2)
    readable.readableStream.on('error', (error) => {
        if (semver.satisfies(process.versions.node, '>17.0')) {
            t.equal(error.message, 'test error', 'readable stream error message check')
        } else {
            t.equal(error.message, 'stream.push() after EOF', 'readable stream error message check')
        }
        t.equal(readable.readableStream.readable, false, 'the readable of readable stream is false on error event')
        if (semver.satisfies(process.versions.node, '>17.0')) {
            t.true(readable.readableStream.closed, 'closed property is true on error event of readable stream')
        }
        t.true(readable.readableStream.destroyed, 'destroyed property is true on error event of readable stream')
    })
    readable.readableStream.on('end', () => {
        if (semver.satisfies(process.versions.node, '>17.0')) {
            t.fail('readable stream end event is not called')
        }
    })
    readable.readableStream.on('close', function () {
        t.false(this.readable, 'readable property is false on close event of readable stream')
        if (semver.satisfies(process.versions.node, '>17.0')) {
            t.true(this.closed, 'closed property is true on close event of readable stream')
        }
        t.true(this.destroyed, 'destroyed property is true on close event of readable stream')
    })

    process.nextTick(() => {
        throwError = true
        if (semver.satisfies(process.versions.node, '<17.0')) {
            readable.readableStream.end()
        }
        readable.push(spanMessageWithId('3'))
    })
})

test('Max buffer size', (t) => {
    const dut = new GrpcReadableStream()
    const expected1 = spanMessageWithId('1111')
    dut.push(expected1)
    const expected2 = spanMessageWithId('2222')
    dut.push(expected2)
    t.true(dut.readableStream.readableLength == 2, 'buffer size is 2')

    const expected3 = spanMessageWithId('3333')
    dut.push(expected3)
    t.true(dut.readableStream.readableLength === 3, 'buffer size is 2')
    t.equal(dut.readableStream._readableState.buffer.shift(), expected1, 'buffer[0] is test1')
    t.equal(dut.readableStream._readableState.buffer.shift(), expected2, 'buffer[1] is test2')
    t.equal(dut.readableStream._readableState.buffer.shift(), expected3, 'buffer[2] is test3')

    // stream.setDefaultHighWaterMark(objectMode, value) above node@19.9
    t.equal(dut.readableStream.readableHighWaterMark, 16, 'high water mark in Object Mode is 16')

    t.end()
})

test('When gRPC server shutdown and then node agent grpcStream on error fired and then reconnection gRPC call and then check errored stream going end stream', (t) => {
    t.plan(2)
    let server = new grpc.Server()
    let requestId = 0
    let handleCommandCallback
    server.addService(services.ProfilerCommandServiceService, {
        handleCommand: (call, callback) => {
            const metadata = call.metadata
            t.equal(metadata.get('agentid').toString(), 'node.test.app', 'metadata agentid')
            if (typeof handleCommandCallback === 'function') {
                handleCommandCallback(call, callback)
            }
        },
        commandEcho: (call, callback) => {
            callback(null, new Empty())
        }
    })

    let dataSender
    const loadGrpcServerCallback = (err, port) => {
        if (loadCount === 1) {
            dataSender = beforeSpecificOne(port, ProfilerDataSource)
            handleCommandCallback = (call) => {
                requestId++
                const result = new cmdMessage.PCmdRequest()
                result.setRequestid(requestId)
                const message = new cmdMessage.PCmdEcho()
                message.setMessage('echo')
                result.setCommandecho(message)
                call.write(result)
            }
            dataSender.sendSupportedServicesCommand(() => {
                server.forceShutdown()
            })

            const commandStream = dataSender.commandStream
            let actualErroredStream
            commandStream.writableStream.on('error', function (error) {
                actualErroredStream = this
            })
            commandStream.writableStream.on('end', function () {
                t.equal(actualErroredStream, this, 'error stream should be close stream')

                server = new grpc.Server()
                server.addService(services.ProfilerCommandServiceService, {
                    handleCommand: () => {
                    }
                })
                server.bindAsync(`localhost:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
                    loadCount++
                    loadGrpcServerCallback(err, port)
                })
            })
            // endCallback(null, new cmdMessage.PResult())
        }


        if (loadCount === 2) {
            dataSender.close()
            server.forceShutdown()
            server.tryShutdown(() => {
            })
            t.end()
        }
    }
    let loadCount = 0
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (err, port) => {
        loadCount++
        loadGrpcServerCallback(err, port)
    })
})
