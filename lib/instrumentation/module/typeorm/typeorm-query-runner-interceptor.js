/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./typeorm-execute-query-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./typeorm-database-information-symbol')
const TypeORMRecorder = require('./typeorm-recorder')

class TypeORMQueryRunnerInterceptor {
    constructor(className) {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('query')
        this.methodDescriptorBuilder.setClassName(className)
        this.serviceType = serviceType
    }

    doInBeforeTrace(recorder, target, args) {
        const sqlArguments = Array.from(args)
        TypeORMRecorder.recordDatabaseInfo(recorder, target[databaseInfoSymbol])

        if (sqlArguments.length > 0) {
            const sql = sqlArguments[0]
            if (this.hasBindVariables(sqlArguments)) {
                const parameters = sqlArguments[1]
                if (Array.isArray(parameters)) {
                    const bindString = parameters.join(', ')
                    recorder.recordSqlInfo(sql, bindString)
                } else {
                    recorder.recordSqlInfo(sql, JSON.stringify(parameters))
                }
            } else {
                recorder.recordSqlInfo(sql)
            }
        }
    }

    hasBindVariables(args) {
        return args.length > 1 && args[1] !== undefined
    }
}

module.exports = TypeORMQueryRunnerInterceptor 