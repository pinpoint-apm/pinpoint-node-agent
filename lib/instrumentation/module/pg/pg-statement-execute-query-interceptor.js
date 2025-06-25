/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./pg-execute-query-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const PostgreSQLRecorder = require('./pg-recorder')

class PostgreSQLStatementExecuteQueryInterceptor {
    constructor(className) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('query')
        this.methodDescriptorBuilder.setClassName(className)
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder, target, args) {
        const sqlArguments = Array.from(args)
        if (typeof target?.connectionParameters == 'object') {
            PostgreSQLRecorder.recordDatabaseInfo(recorder, target.connectionParameters)
        }

        if (sqlArguments.length > 0) {
            const sql = sqlArguments[0]
            if (this.hasBindVariables(sqlArguments)) {
                // PostgreSQL uses $1, $2, etc. for parameters
                const bindString = sqlArguments.slice(1).slice(0, -1).join(', ')
                recorder.recordSqlInfo(sql, bindString)
            } else {
                recorder.recordSqlInfo(sql)
            }
        }
    }

    hasBindVariables(args) {
        // args[0] is SQL, args[1] might be parameters array, args[2] might be callback
        return args.length > 2 || (args.length === 2 && Array.isArray(args[1]))
    }

    callbackIndexOf(args) {
        let functionIndex = -1
        for (let index = 0; index < args.length; index++) {
            if (typeof args[index] === 'function') {
                functionIndex = index
            }

        }
        if (functionIndex < 0) {
            return
        }

        return functionIndex
    }
}

module.exports = PostgreSQLStatementExecuteQueryInterceptor