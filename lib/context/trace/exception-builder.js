/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { nextExceptionId } = require('./id-generator')
const { namedGroupCallSite } = require('../../instrumentation/call-stack')
const { LongAnnotation } = require('../../instrumentation/context/annotation/long-annotation')
const AnnotationKey = require('../annotation-key')
const exceptionChainIdAnnotationKey = new AnnotationKey(-52, 'ExceptionChainId')
const spanMessages = require('../../data/v1/Span_pb')

class Frame {
    constructor(className = '', fileName = 'unknown', lineNumber = 0, methodName = '') {
        this.className = className
        this.fileName = fileName
        this.lineNumber = lineNumber
        this.methodName = methodName
    }

    toProtocolBuffer() {
        const pFrame = new spanMessages.PStackTraceElement()
        pFrame.setClassname(this.className)
        pFrame.setFilename(this.fileName)
        pFrame.setLinenumber(this.lineNumber)
        pFrame.setMethodname(this.methodName)
        return pFrame
    }
}

class Exception {
    constructor(errorClassName, errorMessage, startTime, exceptionId, exceptionDepth) {
        this.errorClassName = errorClassName
        this.errorMessage = errorMessage
        this.startTime = startTime
        this.exceptionId = exceptionId ?? nextExceptionId()
        this.exceptionDepth = exceptionDepth ?? 0
        this.frameStack = []
    }

    exceptionIdAnnotation() {
        return new LongAnnotation(exceptionChainIdAnnotationKey.getCode(), this.exceptionId)
    }

    toProtocolBuffer() {
        const pException = new spanMessages.PException()
        pException.setExceptionclassname(this.errorClassName)
        pException.setExceptionmessage(this.errorMessage)
        pException.setStarttime(this.startTime)
        pException.setExceptionid(this.exceptionId)
        pException.setExceptiondepth(this.exceptionDepth)

        this.frameStack.forEach(frame => {
            pException.addStacktraceelement(frame.toProtocolBuffer())
        })
        return pException
    }
}

const nullErrorClassName = 'unknown'
const nullErrorMessage = ''
const defaultMaxDepth = 10

class ExceptionBuilder {
    constructor(error, maxDepth) {
        this.error = error
        this.maxDepth = maxDepth ?? defaultMaxDepth
    }

    build() {
        return this.buildChain()
    }

    buildChain() {
        const exceptions = []
        const exceptionId = nextExceptionId()
        let current = this.error
        let depth = 0

        while (current && depth < this.maxDepth) {
            const exception = this.buildSingleException(current, exceptionId, depth)
            exceptions.push(exception)
            current = current.cause
            depth++
        }

        if (exceptions.length === 0) {
            exceptions.push(new Exception(nullErrorClassName, nullErrorMessage, Date.now(), exceptionId, 0))
        }

        return exceptions
    }

    buildSingleException(error, exceptionId, depth) {
        if (!error || typeof error.stack !== 'string') {
            return new Exception(nullErrorClassName, nullErrorMessage, Date.now(), exceptionId, depth)
        }

        const stack = error.stack.split(/\r?\n/)
        if (stack.length < 1) {
            return new Exception(nullErrorClassName, nullErrorMessage, Date.now(), exceptionId, depth)
        }

        const className = this.extractErrorClassName(stack[0])
        const message = error.message ?? nullErrorMessage

        const exception = new Exception(className, message, Date.now(), exceptionId, depth)
        exception.frameStack = stack.slice(1).map(callSite => {
            const { type, location, fileName, lineNumber, functionName, methodName } = namedGroupCallSite(callSite.trim())

            let functionNameWithMethod
            if (functionName && methodName) {
                functionNameWithMethod = `${functionName} [as ${methodName}]`
            } else if (functionName) {
                functionNameWithMethod = functionName
            } else if (methodName) {
                functionNameWithMethod = methodName
            }

            return new Frame(type || fileName || nullErrorClassName, location, lineNumber, functionNameWithMethod || '<anonymous>')
        })
        exception.stack = stack
        return exception
    }

    extractErrorClassName(firstLine) {
        if (!firstLine || typeof firstLine !== 'string') {
            return nullErrorClassName
        }

        const match = /^([^:\s]+):/.exec(firstLine)
        return match && match[1] ? match[1].trim() : nullErrorClassName
    }
}

module.exports = {
    Exception,
    ExceptionBuilder
}
