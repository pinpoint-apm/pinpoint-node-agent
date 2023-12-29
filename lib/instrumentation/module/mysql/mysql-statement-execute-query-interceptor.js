/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-execute-query-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')

class MySQLStatementExecuteQueryInterceptor {
    constructor(className) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('query')
        this.methodDescriptorBuilder.setClassName(className)
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder, target, args) {
        const sqlArguments = Array.from(args)

        if (target[databaseInfoSymbol] && typeof target[databaseInfoSymbol].host === 'string') {
            recorder.recordEndPoint(target[databaseInfoSymbol].host)
        }

        if (target[databaseInfoSymbol] && typeof target[databaseInfoSymbol].database === 'string') {
            recorder.recordDestinationId(target[databaseInfoSymbol].database)
        }

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