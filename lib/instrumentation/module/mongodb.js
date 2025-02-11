/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const semver = require('semver')
const executeServiceType = require('./mongodb/mongodb-execute-query-service-type')
const MethodDescriptorBuilder = require('../../context/method-descriptor-builder')
const apiMetaService = require('../../context/api-meta-service')
const childTraceSymbol = Symbol('mongodb-child-trace')

module.exports = function (agent, version, mongodb) {
    if (!semver.satisfies(version, '>=4.0.0')) {
        return mongodb
    }

    if (!mongodb.MongoClient) {
        return mongodb
    }

    // https://github.com/elastic/apm-agent-nodejs/blob/8d9d5fd26993fad5924977aad9c8d5bfdb59e595/lib/instrumentation/modules/mongodb.js#L44
    class TraceableMongoClient extends mongodb.MongoClient {
        constructor() {
            // `command*` events are not emitted when using the `connect` method
            const args = Array.prototype.slice.call(arguments)
            if (!args[1]) {
                args[1] = { monitorCommands: true }
            } else if (args[1].monitorCommands !== true) {
                args[1] = Object.assign({}, args[1], { monitorCommands: true })
            }
            super(...args)

            this.on('commandStarted', this.onStart)
            this.on('commandSucceeded', this.onEnd)
            this.on('commandFailed', this.onEnd)
        }

        onStart(event) {
            const traceContext = agent.getTraceContext()
            const trace = traceContext.currentTraceObject()
            if (!trace) {
                return
            }

            if (!event?.commandName) {
                return
            }

            const methodDescriptorBuilder = new MethodDescriptorBuilder(event.commandName)
                .setClassName('MongoClient')
            const methodDescriptor = apiMetaService.cacheApiWithBuilder(methodDescriptorBuilder)

            const recorder = trace.traceBlockBegin()
            recorder.recordServiceType(executeServiceType)
            recorder.recordApi(methodDescriptor)
            recorder.recordEndPoint(event.address)
            recorder.recordDestinationId(event.databaseName)
            const asyncId = recorder.getNextAsyncId()
            trace.traceBlockEnd(recorder)

            const childTraceBuilder = traceContext.continueAsyncContextTraceObject(trace.getTraceRoot(), asyncId.nextLocalAsyncId2())
            this[childTraceSymbol] = childTraceBuilder
        }

        onEnd() {
            const childTraceBuilder = this[childTraceSymbol]
            if (!childTraceBuilder) {
                return
            }

            // https://github.com/mongodb/specifications/blob/master/source/command-logging-and-monitoring/command-logging-and-monitoring.md#events-api
            //   /**
            //    * Returns the failure. Based on the language, this SHOULD be a message string, exception
            //    * object, or error document.
            //    */
            // failure: String, Exception, Document; -> Can't Testable
            // if (typeof event?.failure === 'string') {
            //     const recorder = childTraceBuilder.traceBlockBegin()
            //     recorder.recordServiceType(executeServiceType)
            //     recorder.recordException({ name: event?.failure })
            //     childTraceBuilder.traceBlockEnd(recorder)
            // }
            childTraceBuilder.close()
        }
    }
    Object.defineProperty(mongodb, 'MongoClient', {
        enumerable: true,
        get: function () {
            return TraceableMongoClient
        }
    })

    return mongodb
}