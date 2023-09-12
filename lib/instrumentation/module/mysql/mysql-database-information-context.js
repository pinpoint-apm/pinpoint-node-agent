/**
 * Pinpoint Node.js Agent
 * Copyright 2023-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

const databaseInfoSymbol = require('./mysql-database-information-symbol')

class MySQLDatabaseInformationContext {
    static recordAndReturnDatabaseInfo(recorder, target, args) {
        const databaseInfo = args[0]
        if (databaseInfo && databaseInfo.host && typeof databaseInfo.host === 'string') {
            recorder.recordEndPoint(databaseInfo.host)
        }
        if (databaseInfo && databaseInfo.database && typeof databaseInfo.database === 'string') {
            recorder.recordDestinationId(databaseInfo.database)
        }
        return databaseInfo
    }
}

module.exports = MySQLDatabaseInformationContext