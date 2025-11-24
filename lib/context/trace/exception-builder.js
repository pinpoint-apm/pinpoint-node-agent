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
    constructor(errorClassName, errorMessage, startTime) {
        this.errorClassName = errorClassName
        this.errorMessage = errorMessage
        this.startTime = startTime
        this.exceptionId = nextExceptionId()
        this.exceptionDepth = 1
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

class ExceptionBuilder {
    constructor(error) {
        this.error = error
    }

    build() {
        if (!this.error || typeof this.error.stack !== 'string') {
            return new Exception(nullErrorClassName, nullErrorMessage, Date.now())
        }

        const stack = this.error.stack.split(/\r?\n/)
        if (stack.length < 1) {
            return new Exception(nullErrorClassName, nullErrorMessage, Date.now())
        }

        const className = this.extractErrorClassName(stack[0])
        const message = this.error.message ?? nullErrorMessage

        const exception = new Exception(className, message, Date.now())
        exception.frameStack = stack.slice(1).map(callSite => {
            const { type, location, lineNumber, functionName, methodName } = namedGroupCallSite(callSite.trim())

            let functionNameWithMethod
            if (functionName && methodName) {
                functionNameWithMethod = `${functionName} [as ${methodName}]`
            } else if (functionName) {
                functionNameWithMethod = functionName
            } else if (methodName) {
                functionNameWithMethod = methodName
            }

            return new Frame(type, location, lineNumber, functionNameWithMethod)
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