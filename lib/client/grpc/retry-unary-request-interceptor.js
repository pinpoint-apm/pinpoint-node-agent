/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const InterceptingCall = grpc.InterceptingCall

var maxRetries = 3
const retryUnaryRequestInterceptor = function (options, nextCall) {
    var savedMetadata
    var savedSendMessage
    var savedReceiveMessage
    var savedMessageNext
    var requester = {
        start: function (metadata, listener, next) {
            savedMetadata = metadata
            var newListener = {
                onReceiveMessage: function (message, next) {
                    savedReceiveMessage = message
                    savedMessageNext = next
                },
                onReceiveStatus: function (status, next) {
                    var retries = 0
                    var retry = function (message, metadata) {
                        retries++
                        var newCall = nextCall(options)
                        var retryListener = {
                            onReceiveMessage: function (message) {
                                savedReceiveMessage = message
                            },
                            onReceiveStatus: function (status) {
                                if (status.code !== grpc.status.OK) {
                                    if (retries <= maxRetries) {
                                        retry(message, metadata)
                                    } else {
                                        savedMessageNext(savedReceiveMessage)
                                        next(status)
                                    }
                                } else {
                                    savedMessageNext(savedReceiveMessage)
                                    next({ code: grpc.status.OK })
                                }
                            }
                        }
                        newCall.start(metadata, retryListener)
                        newCall.sendMessage(savedSendMessage)  // Added Call
                        newCall.halfClose()  // Added Call
                    }
                    if (status.code !== grpc.status.OK) {
                        retry(savedSendMessage, savedMetadata)
                    } else {
                        savedMessageNext(savedReceiveMessage)
                        next(status)
                    }
                }
            }
            next(metadata, newListener)
        },
        sendMessage: function (message, next) {
            savedSendMessage = message
            next(message)
        }
    }
    return new InterceptingCall(nextCall(options), requester)
}

module.exports = retryUnaryRequestInterceptor