/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const { getConfig } = require('./../../config')

class HttpStatusCodeErrors {
    constructor(errors) {
        this.errors = this.statusCode(errors)
    }

    statusCode(errors) {
        return errors.map((error) => {
            if (error === '5xx') {
                return new ServerError()
            }
            return new StatusCode(parseInt(error, 10))
        })
    }

    isErrorCode(statusCode) {
        return this.errors.some((error) => error.isCode(statusCode))
    }
}

class ServerError {
    isCode(statusCode) {
        return statusCode >= 500 && statusCode < 600
    }

    toString() {
        return '5xx'
    }
}

class StatusCode {
    constructor(code) {
        this.code = code
    }

    isCode(statusCode) {
        return this.code === statusCode
    }

    toString() {
        return this.code.toString()
    }
}

class HttpStatusCodeErrorsBuilder {
    constructor(errors) {
        this.errors = errors
    }

    build() {
        const errors = this.errors?.split(',')
        if (!errors || errors.length === 0) {
            return new HttpStatusCodeErrors(['5xx'])
        }
        return new HttpStatusCodeErrors(errors.map((error) => error.trim()))
    }
}

let httpStatusCodeErrors
function getHttpStatusCodeErrors() {
    if (!httpStatusCodeErrors) {
        const config = getConfig()
        httpStatusCodeErrors = new HttpStatusCodeErrorsBuilder(config.httpStatusCodeErrors).build()
    }
    return httpStatusCodeErrors
}

function clearHttpStatusCodeErrors() {
    httpStatusCodeErrors = undefined
}

module.exports = {
    HttpStatusCodeErrorsBuilder,
    getHttpStatusCodeErrors,
    clearHttpStatusCodeErrors
}