/**
 * Pinpoint Node.js Agent
 * Copyright 2020-present NAVER Corp.
 * Apache License v2.0
 */

'use strict'

class PostgreSQLRecorder {
    static recordDatabaseInfo(recorder, databaseInfo) {
        if (typeof databaseInfo?.host === 'string' && typeof databaseInfo?.port === 'number') {
            recorder?.recordEndPoint(databaseInfo.host + ':' + (databaseInfo.port || 5432))
        }
        if (typeof databaseInfo?.database === 'string') {
            recorder?.recordDestinationId(databaseInfo.database)
        }
    }
}

module.exports = PostgreSQLRecorder