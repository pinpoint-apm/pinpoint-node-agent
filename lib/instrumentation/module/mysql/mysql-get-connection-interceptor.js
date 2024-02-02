/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const InstrumentMethod = require('../../instrument-method')
const MySQLStatementExecuteQueryInterceptor = require('./mysql-statement-execute-query-interceptor')
const MySQLRecorder = require('./mysql-recorder')

class MySQLGetConnectionInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('getConnection')
            .setClassName('Pool')
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder, target) {
        MySQLRecorder.recordDatabaseInfo(recorder, target[databaseInfoSymbol])
    }

    prepareBeforeAsyncTrace(target, args) {
        if (args.length > 1 && args[1]) {
            const connection = args[1]
            InstrumentMethod.make(connection, 'query').addScopedInterceptor(new MySQLStatementExecuteQueryInterceptor('PoolConnection'))
        }
    }

    callbackIndexOf(args) {
        if (args.length > 1 && typeof args[1] === 'function') {
            return 1
        }

        if (typeof args[0] !== 'function') {
            return
        }

        return 0
    }
}

module.exports = MySQLGetConnectionInterceptor