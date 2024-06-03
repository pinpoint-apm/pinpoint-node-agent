/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const grpc = require('@grpc/grpc-js')
const InterceptingCall = grpc.InterceptingCall
const RequesterBuilder = grpc.RequesterBuilder
const ListenerBuilder = grpc.ListenerBuilder

const maxRetries = 3
const retryUnaryRequestInterceptor = function (options, nextCall) {
    let savedMetadata
    let savedSendMessage
    let savedReceiveMessage
    let savedMessageNext = function emptyNext () {}
    const requester = (new RequesterBuilder())
        .withStart((metadata, listener, next) => {
            savedMetadata = metadata
            const newListener = (new ListenerBuilder())
                .withOnReceiveMessage(function (message, next) {
                    savedReceiveMessage = message
                    savedMessageNext = next
                })
                .withOnReceiveStatus(function (status, next) {
                    let retries = 0
                    var retry = function (message, metadata) {
                        retries++
                        let newCall = nextCall(options)
                        let receivedMessage
                        newCall.start(metadata, {
                            onReceiveMessage: function (message) {
                                receivedMessage = message
                            },
                            onReceiveStatus: function (status) {
                                if (status.code !== grpc.status.OK) {
                                    if (retries <= maxRetries) {
                                        retry(message, metadata)
                                    } else {
                                        savedMessageNext(receivedMessage)
                                        next(status)
                                    }
                                } else {
                                    const newStatus = (new grpc.StatusBuilder())
                                        .withCode(grpc.status.OK)
                                        .build()
                                    savedMessageNext(receivedMessage)
                                    next(newStatus)
                                }
                            }
                        })
                        newCall.sendMessage(message)
                        newCall.halfClose()
                    }
                    if (status.code !== grpc.status.OK) {
                        retry(savedSendMessage, savedMetadata)
                    } else {
                        savedMessageNext(savedReceiveMessage)
                        next(status)
                    }
                }).build()
            next(metadata, newListener)
        }).withSendMessage(function (message, next) {
            savedSendMessage = message
            next(message)
        }).build()
    return new InterceptingCall(nextCall(options), requester)
}

module.exports = retryUnaryRequestInterceptor