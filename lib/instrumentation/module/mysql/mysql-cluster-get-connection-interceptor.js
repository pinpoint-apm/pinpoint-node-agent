/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const databaseInfoSymbol = require('./mysql-database-information-symbol')
const MySQLGetConnectionInterceptor = require('./mysql-get-connection-interceptor')

class MySQLClusterGetConnectionInterceptor {
    constructor(traceContext) {
        this.delegate = new MySQLGetConnectionInterceptor(traceContext)
    }

    prepareBeforeAsyncTrace(target, args) {
        if (args.length > 1 && args[1]) {
            const connection = args[1]
            if (connection.config) {
                target[databaseInfoSymbol] = {
                    host: connection.config.host,
                    database: connection.config.database
                }
            }
        }
        this.delegate.prepareBeforeAsyncTrace(target, args)
    }

    doInAfterTrace(recorder) {
        this.delegate.doInAfterTrace(recorder)
    }

    callbackIndexOf(args) {
        return this.delegate.callbackIndexOf(args)
    }
}

module.exports = MySQLClusterGetConnectionInterceptor
