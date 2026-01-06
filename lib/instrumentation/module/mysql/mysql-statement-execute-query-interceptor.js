/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-execute-query-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const MySQLRecorder = require('./mysql-recorder')
const apiMetaService = require('../../../context/api-meta-service')

class MySQLStatementExecuteQueryInterceptor {
    constructor(className) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('query')
        this.methodDescriptorBuilder.setClassName(className)
    }

    doInBeforeTrace(recorder, target, args) {
        const sqlArguments = Array.from(args)
        MySQLRecorder.recordDatabaseInfo(recorder, target[databaseInfoSymbol])

        if (sqlArguments.length > 0) {
            const sql = sqlArguments[0]
            if (this.hasBindVariables(sqlArguments)) {
                const bindString = sqlArguments.slice(1).slice(0, -1).join(', ')
                recorder.recordSqlInfo(sql, bindString)
            } else {
                recorder.recordSqlInfo(sql)
            }
        }
    }

    hasBindVariables(args) {
        return args.length > 2
    }

    doInAfterTrace(recorder) {
        recorder.recordApi(apiMetaService.cacheApiWithBuilder(this.methodDescriptorBuilder))
        recorder.recordServiceType(serviceType)
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

module.exports = MySQLStatementExecuteQueryInterceptor