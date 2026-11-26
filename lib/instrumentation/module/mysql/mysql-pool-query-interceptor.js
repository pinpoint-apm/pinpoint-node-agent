/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const serviceType = require('./mysql-service-type')
const MethodDescriptorBuilder = require('../../../context/method-descriptor-builder')
const databaseInfoSymbol = require('./mysql-database-information-symbol')
const MySQLRecorder = require('./mysql-recorder')
const apiMetaService = require('../../../context/api-meta-service')

// Pool.query runs the query with conn.query() in its getConnection callback, and that conn.query records the SQL.
class MySQLPoolQueryInterceptor {
    constructor() {
        this.methodDescriptorBuilder = new MethodDescriptorBuilder('query')
            .setClassName('Pool')
    }

    doInBeforeTrace(recorder, target) {
        MySQLRecorder.recordDatabaseInfo(recorder, target[databaseInfoSymbol])
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

module.exports = MySQLPoolQueryInterceptor
