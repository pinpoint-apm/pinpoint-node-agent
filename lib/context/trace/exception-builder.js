/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { nextExceptionId } = require('./id-generator')
const { namedGroupCallSite } = require('../../instrumentation/call-stack')
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
    constructor(error, errorClassName, errorMessage, startTime, exceptionId, exceptionDepth) {
        this.error = error
        this.errorClassName = errorClassName
        this.errorMessage = errorMessage
        this.startTime = startTime
        this.exceptionId = exceptionId ?? nextExceptionId()
        this.exceptionDepth = exceptionDepth ?? 0
        this.frameStack = []
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
const callSiteLine = /^\s*at /

class ExceptionBuilder {
    constructor(error) {
        this.error = error
        this.depth = 0
        this.startTime = Date.now()
    }

    setExceptionId(exceptionId) {
        this.exceptionId = exceptionId
        return this
    }

    setDepth(depth) {
        this.depth = depth
        return this
    }

    setStartTime(startTime) {
        this.startTime = startTime
        return this
    }

    build() {
        const error = this.error
        const className = typeof error.name === 'string' ? error.name : nullErrorClassName
        const message = error.message ?? nullErrorMessage
        const exception = new Exception(error, className, message, this.startTime, this.exceptionId, this.depth)
        if (typeof error.stack !== 'string') {
            return exception
        }

        exception.frameStack = error.stack.split(/\r?\n/).filter(line => callSiteLine.test(line)).map(callSite => {
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
        return exception
    }
}

module.exports = {
    Exception,
    ExceptionBuilder
}
