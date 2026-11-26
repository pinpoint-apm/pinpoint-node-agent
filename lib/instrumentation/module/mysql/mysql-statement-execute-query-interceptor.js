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
        MySQLRecorder.recordDatabaseInfo(recorder, target[databaseInfoSymbol])
        recorder.recordSqlInfo(this.sql(args), this.bindString(args))
    }

    sql(args) {
        const sql = args[0]
        if (this.isSqlObject(sql)) {
            return sql.sql
        }
        return sql
    }

    // conn.query(Query { sql, values: ['a'] }) that pool.query(sql, ['a'], cb) calls
    // connection.query({ sql, timeout: 40000 }, ['b'], cb)
    // this.query({ sql: 'START TRANSACTION', values: null }, cb) that connection.beginTransaction(cb) calls
    isSqlObject(obj) {
        return obj && typeof obj.sql === 'string'
    }

    // mysql and mysql2 run the values argument, not the values of the query options
    bindString(args) {
        const values = this.isSecondArgumentCallback(args) || this.isConnQueryInPoolQuery(args) ? args[0]?.values : args[1]
        if (this.isNoBindValues(values)) {
            return
        }
        if (Array.isArray(values)) {
            return values.map(value => this.bindValue(value)).join(',')
        }
        return this.bindValue(values)
    }

    // connection.query('SHOW TABLES', cb)
    // connection.beginTransaction(cb)
    isSecondArgumentCallback(args) {
        return typeof args[1] === 'function'
    }

    // conn.query(Query { sql, values: ['a'] }) that pool.query(sql, ['a'], cb) calls
    // connection.query('SHOW TABLES') without a callback
    isConnQueryInPoolQuery(args) {
        return args[1] === undefined
    }

    // connection.query('SHOW TABLES', cb)
    // this.query({ sql: 'START TRANSACTION', values: null }, cb) that connection.beginTransaction(cb) calls
    isNoBindValues(values) {
        return values == null
    }

    // null, or an object without toString such as Object.create(null), keeps its place as ''
    bindValue(value) {
        if (value == null || !this.isConvertible(value)) {
            return ''
        }
        return String(value)
    }

    isConvertible(value) {
        return typeof value[Symbol.toPrimitive] === 'function' ||
            typeof value.toString === 'function' ||
            typeof value.valueOf === 'function'
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